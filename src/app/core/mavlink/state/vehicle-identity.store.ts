import { Injectable, computed, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  INITIAL_VEHICLE_IDENTITY_STATE,
  decodeFlightSwVersion,
  isArduPilotAutopilot,
  mapFirmwareFamily,
  mapVehicleKind
} from '../models/vehicle-identity.model';
import { MavlinkParserService } from '../protocol/mavlink-parser.service';

@Injectable({ providedIn: 'root' })

/**
 * Store d'identite du vehicule MAVLink.
 * Ce service determine et conserve l'identite de la cible a partir des messages
 * HEARTBEAT et AUTOPILOT_VERSION, notamment le systeme cible, le composant,
 * le type de vehicule, la famille firmware et la version detectee.
 *
 * MAVLink vehicle identity store.
 * This service determines and keeps the target identity from HEARTBEAT and
 * AUTOPILOT_VERSION messages, including target system, component, vehicle type,
 * firmware family, and detected version information.
 */
export class VehicleIdentityStore {
  private readonly stateSig = signal(INITIAL_VEHICLE_IDENTITY_STATE);

  readonly state = computed(() => this.stateSig());
  readonly targetSystemId = computed(() => this.stateSig().targetSystemId);
  readonly targetComponentId = computed(() => this.stateSig().targetComponentId);
  readonly vehicleKind = computed(() => this.stateSig().vehicleKind);
  readonly firmwareFamily = computed(() => this.stateSig().firmwareFamily);
  readonly versionText = computed(() => this.stateSig().version.text);
  readonly isReady = computed(() => this.stateSig().discovered);

  constructor(private readonly parser: MavlinkParserService) {
    this.bindHeartbeat();
    this.bindAutopilotVersion();
  }

  reset(): void {
    this.stateSig.set(INITIAL_VEHICLE_IDENTITY_STATE);
  }

  private bindHeartbeat(): void {
    this.parser.onType$('HEARTBEAT')
      .pipe(takeUntilDestroyed())
      .subscribe((hb: any) => {
        const autopilot = hb.autopilot ?? null;
        const mavType = hb.type ?? null;
        const source = this.extractSource(hb);

        this.stateSig.update((current) => ({
          ...current,
          discovered: true,
          targetSystemId: source.systemId,
          targetComponentId: source.componentId,
          autopilot,
          mavType,
          baseMode: hb.base_mode ?? null,
          customMode: hb.custom_mode ?? null,
          vehicleKind: mapVehicleKind(mavType),
          firmwareFamily: mapFirmwareFamily(autopilot, mavType),
          isArduPilot: isArduPilotAutopilot(autopilot),
          discoveredAtMs: current.discoveredAtMs ?? Date.now()
        }));
      });
  }

  private bindAutopilotVersion(): void {
    this.parser.onType$('AUTOPILOT_VERSION')
      .pipe(takeUntilDestroyed())
      .subscribe((msg: any) => {
        this.stateSig.update((current) => ({
          ...current,
          version: decodeFlightSwVersion(msg.flight_sw_version ?? null),
          versionReceivedAtMs: Date.now()
        }));
      });
  }

  private extractSource(msg: any): { systemId: number | null; componentId: number | null } {
    const header = msg?._header ?? {};
    const systemId =
      header.srcSystem ??
      header.srcSystemId ??
      msg?.srcSystem ??
      msg?.sysid ??
      null;

    const componentId =
      header.srcComponent ??
      header.srcComponentId ??
      msg?.srcComponent ??
      msg?.compid ??
      null;

    return { systemId, componentId };
  }
}