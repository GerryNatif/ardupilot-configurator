import { Injectable, Signal, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MavlinkCommandService } from '../commands/mavlink-command.service';
import { ParameterMetadata } from '../models/parameter-metadata.model';
import { LinkStatus, TelemetryState } from '../models/telemetry.model';
import { AppError } from '../../../core/services/app-error';
import { ParameterStore } from '../state/parameter.store';
import { ParameterMetadataService } from '../services/parameter-metadata.service';
import { TelemetryStore } from '../state/telemetry.store';
import { VehicleIdentityStore } from '../state/vehicle-identity.store';
import { MavlinkSessionBootstrapService } from '../services/mavlink-session-bootstrap.service';
import { SerialTransportService } from '../transport/serial-transport.service';

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

  private readonly linkStatusSig = toSignal(this.transport.status$, { initialValue: 'disconnected' as LinkStatus });

  readonly telemetry: Signal<TelemetryState> = this.telemetryStore.telemetry;
  readonly vehicleIdentity = this.vehicleIdentityStore.state;
  readonly parameterState = this.parameterStore.state;
  readonly parameterMetadataState = this.parameterMetadataService.state;
  readonly linkStatus = computed(() => this.linkStatusSig());
  readonly isConnected = computed(() => this.linkStatusSig() === 'connected');

  async connect(baudrate: number): Promise<void> {
    await this.transport.connect(baudrate);
    this.persistLastBaudRate(baudrate);
    await this.bootstrap.initialize();
  }

  async tryAutoConnect(): Promise<boolean> {
    const baudRate = this.getLastBaudRate();

    try {
      const connected = await this.transport.autoConnectAuthorized(baudRate);
      if (!connected) {
        return false;
      }

      await this.bootstrap.initialize();
      return true;
    } catch {
      return false;
    }
  }

  async disconnect(): Promise<void> {
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