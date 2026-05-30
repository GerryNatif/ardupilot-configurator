import { Injectable, Signal, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MavlinkCommandService } from '../commands/mavlink-command.service';
import { ParameterMetadata } from '../models/parameter-metadata.model';
import { LinkStatus, TelemetryState } from '../models/telemetry.model';
import { AppError } from '../../error/app-error';
import { ParameterStore } from '../state/parameter.store';
import { ParameterMetadataService } from '../../parameter/metadata/parameter-metadata.service';
import { TelemetryStore } from '../state/telemetry.store';
import { VehicleIdentityStore } from '../state/vehicle-identity.store';
import { MavlinkSessionBootstrapService } from '../bootstrap/mavlink-session-bootstrap.service';
import { SerialTransportService } from '../transport/serial-transport.service';

/**
 * Facade metier pour les interactions MAVLink cote application.
 *
 * Usage:
 * - Exposer un point d'entree unique pour la connexion/deconnexion et l'etat du lien.
 * - Encapsuler les actions haut niveau (arm/disarm, ecriture parametres, reboot autopilote).
 * - Agreger les etats reactifs utilises par l'UI (telemetrie, identite vehicule, parametres, metadonnees).
 * - Orchestrer les sequences de bootstrap/reinitialisation sans exposer les details transport/protocole.
 *
 * Cette facade delegue l'execution technique aux services MAVLink internes
 * (transport, commandes, stores, bootstrap) et centralise les validations
 * applicatives ainsi que les erreurs metier exposees a l'interface.
 *
 * Application-facing domain facade for MAVLink interactions.
 *
 * Usage:
 * - Provide a single entry point for connect/disconnect and link status.
 * - Encapsulate high-level actions (arm/disarm, parameter writes, autopilot reboot).
 * - Aggregate reactive state consumed by the UI (telemetry, vehicle identity, parameters, metadata).
 * - Orchestrate bootstrap/reinitialization sequences without exposing transport/protocol internals.
 *
 * This facade delegates technical execution to internal MAVLink services
 * (transport, commands, stores, bootstrap) and centralizes application-level
 * validation plus domain errors surfaced to the UI.
 */
@Injectable({ providedIn: 'root' })
export class DroneLinkFacade {
  private static readonly LAST_BAUD_RATE_STORAGE_KEY = 'link:lastBaudRate';
  private static readonly DEFAULT_BAUD_RATE = 115200;

  private readonly transport = inject(SerialTransportService);
  private readonly commands = inject(MavlinkCommandService);
  private readonly telemetryStore = inject(TelemetryStore);
  private readonly vehicleIdentityStore = inject(VehicleIdentityStore);
  private readonly parameterStore = inject(ParameterStore);
  private readonly parameterMetadataService = inject(ParameterMetadataService);
  private readonly bootstrap = inject(MavlinkSessionBootstrapService);

  private readonly linkStatusSig = toSignal(this.transport.status$, {
    initialValue: 'disconnected' as LinkStatus,
  });
  private readonly sessionReadySig = signal(false);

  readonly telemetry: Signal<TelemetryState> = this.telemetryStore.telemetry;
  readonly vehicleIdentity = this.vehicleIdentityStore.state;
  readonly parameterState = this.parameterStore.state;
  readonly parameterMetadataState = this.parameterMetadataService.state;
  readonly linkStatus = computed(() => this.linkStatusSig());
  readonly isSessionReady = computed(() => this.linkStatusSig() === 'connected' && this.sessionReadySig());
  readonly isConnected = this.isSessionReady;

  async connect(baudrate: number): Promise<void> {
    this.sessionReadySig.set(false);
    await this.transport.connect(baudrate);
    this.persistLastBaudRate(baudrate);
    try {
      await this.bootstrap.initialize();
      this.sessionReadySig.set(true);
    } catch (error) {
      this.bootstrap.reset();
      this.sessionReadySig.set(false);
      await this.transport.disconnect();
      throw error;
    }
  }

  async tryAutoConnect(): Promise<boolean> {
    const baudRate = this.getLastBaudRate();
    this.sessionReadySig.set(false);

    try {
      const connected = await this.transport.autoConnectAuthorized(baudRate);
      if (!connected) {
        return false;
      }

      try {
        await this.bootstrap.initialize();
        this.sessionReadySig.set(true);
      } catch {
        this.bootstrap.reset();
        this.sessionReadySig.set(false);
        await this.transport.disconnect();
        return false;
      }

      return true;
    } catch {
      this.sessionReadySig.set(false);
      return false;
    }
  }

  async disconnect(): Promise<void> {
    this.sessionReadySig.set(false);
    this.bootstrap.reset();
    await this.transport.disconnect();
  }

  async arm(): Promise<void> {
    const targetSystem = this.vehicleIdentityStore.targetSystemId();
    const targetComponent = this.vehicleIdentityStore.targetComponentId();

    if (targetSystem == null || targetComponent == null) {
      throw new AppError('errors.facade.target_not_detected');
    }

    await this.commands.arm(targetSystem, targetComponent);
  }

  async disarm(): Promise<void> {
    const targetSystem = this.vehicleIdentityStore.targetSystemId();
    const targetComponent = this.vehicleIdentityStore.targetComponentId();

    if (targetSystem == null || targetComponent == null) {
      throw new AppError('errors.facade.target_not_detected');
    }

    await this.commands.disarm(targetSystem, targetComponent);
  }

  async setParameter(name: string, value: number): Promise<void> {
    const entry = this.parameterStore.getParameter(name);
    const targetSystem = this.vehicleIdentityStore.targetSystemId();
    const targetComponent = this.vehicleIdentityStore.targetComponentId();

    if (!entry || targetSystem == null || targetComponent == null) {
      throw new AppError('errors.facade.param_or_target_unavailable');
    }

    this.parameterStore.markPending(name, value);
    await this.commands.setParameter(targetSystem, targetComponent, name, value, entry.type);
  }

  async rebootAutopilotAndReinitialize(): Promise<void> {
    const targetSystem = this.vehicleIdentityStore.targetSystemId();
    const targetComponent = this.vehicleIdentityStore.targetComponentId();

    if (targetSystem == null || targetComponent == null) {
      throw new AppError('errors.facade.target_not_detected');
    }

    this.sessionReadySig.set(false);
    await this.commands.rebootAutopilot(targetSystem, targetComponent);

    // Laisse le temps a la commande de reboot de partir avant de couper le lien.
    await this.delay(200);

    // Force une transition d'etat deconnecte pour l'UI et nettoie la session.
    this.bootstrap.reset();
    await this.transport.disconnect();

    // Let the FC reboot before attempting to fetch heartbeat/streams again.
    await this.delay(3500);

    const reconnectOk = await this.transport.autoConnectAuthorized(this.getLastBaudRate());
    if (!reconnectOk) {
      throw new AppError('errors.facade.reconnect_after_reboot_failed');
    }

    await this.bootstrap.initialize();
    this.sessionReadySig.set(true);
  }

  getParameterMetadata(name: string): ParameterMetadata | undefined {
    return this.parameterMetadataService.get(name);
  }

  hasParameterMetadata(name: string): boolean {
    return this.parameterMetadataService.has(name);
  }

  getRoundedParameterValue(name: string): number | null {
    const value = this.parameterStore.getParameter(name)?.value ?? null;
    if (value == null) {
      return null;
    }

    const metadata = this.parameterMetadataService.get(name);
    const increment = metadata?.increment ?? null;

    if (increment == null || increment <= 0) {
      return value;
    }

    const base = metadata?.min ?? 0;
    const decimals = this.countDecimals(increment);
    const rawSteps = (value - base) / increment;
    const snapped = Math.round(rawSteps) * increment + base;

    return Number(snapped.toFixed(decimals));
  }

  private countDecimals(value: number): number {
    const asText = value.toString();
    const decimalSeparatorIndex = asText.indexOf('.');
    return decimalSeparatorIndex < 0 ? 0 : asText.length - decimalSeparatorIndex - 1;
  }

  private async delay(ms: number): Promise<void> {
    await new Promise<void>((resolve) => {
      window.setTimeout(() => resolve(), ms);
    });
  }

  getLastBaudRate(): number {
    try {
      const raw = localStorage.getItem(DroneLinkFacade.LAST_BAUD_RATE_STORAGE_KEY);
      const parsed = raw ? Number(raw) : NaN;
      return Number.isFinite(parsed) && parsed > 0 ? parsed : DroneLinkFacade.DEFAULT_BAUD_RATE;
    } catch {
      return DroneLinkFacade.DEFAULT_BAUD_RATE;
    }
  }

  private persistLastBaudRate(baudRate: number): void {
    try {
      localStorage.setItem(DroneLinkFacade.LAST_BAUD_RATE_STORAGE_KEY, String(baudRate));
    } catch {
      // Ignore storage errors.
    }
  }
}
