import { Injectable } from '@angular/core';
import { firstValueFrom, race, timer } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { MavlinkCommandService } from '../commands/mavlink-command.service';
import { MavlinkParserService } from '../protocol/mavlink-parser.service';
import { AppError } from '../../../core/services/error/app-error';
import { ParameterMetadataService } from './parameter-metadata.service';
import { ParameterStore } from '../state/parameter.store';
import { VehicleIdentityStore } from '../state/vehicle-identity.store';
import { UiErrorService } from '../../services/error/ui-error.service';

@Injectable({ providedIn: 'root' })

/**
 * Service de bootstrap de session MAVLink.
 * Il initialise une session de connexion en forçant un premier paquet MAVLink2,
 * attend l'identification du vehicule, configure les flux de telemetrie, charge
 * les metadonnees de parametres puis demarre la synchronisation des parametres.
 *
 * MAVLink session bootstrap service.
 * It initializes a connection session by forcing an initial MAVLink2 packet,
 * waits for vehicle discovery, configures telemetry streams, loads parameter
 * metadata, and then starts parameter synchronization.
 */

export class MavlinkSessionBootstrapService {
  private static readonly MAVLINK_MSG_ID_SYS_STATUS = 1;
  private static readonly MAVLINK_MSG_ID_GPS_RAW_INT = 24;
  private static readonly MAVLINK_MSG_ID_ATTITUDE = 30;
  private static readonly MAVLINK_MSG_ID_RC_CHANNELS = 65;

  private static readonly SYS_STATUS_INTERVAL_US = 500_000;
  private static readonly GPS_RAW_INT_INTERVAL_US = 200_000;
  private static readonly ATTITUDE_INTERVAL_US = 100_000;
  private static readonly RC_CHANNELS_INTERVAL_US = 100_000;

  constructor(
    private readonly parser: MavlinkParserService,
    private readonly commands: MavlinkCommandService,
    private readonly vehicleIdentityStore: VehicleIdentityStore,
    private readonly parameterStore: ParameterStore,
    private readonly parameterMetadataService: ParameterMetadataService,
    private readonly uiError: UiErrorService
  ) {}

  async initialize(): Promise<void> {
    this.reset();

    // Forcer la carte à basculer en MAVLink2 dès le début de session.
    await this.parser.sendMavlink2PrimingHeartbeat();

    // Si déjà discovered, ne pas attendre
    if (this.vehicleIdentityStore.state().discovered) {
      // console.log('[BOOTSTRAP] HEARTBEAT déjà reçu, on continue');
    } else {
      await this.waitForFirstHeartbeat(5000);
    }

    await this.requestTelemetryStreamsIfPossible();

    await this.requestAutopilotVersionIfPossible();
    await this.waitForAutopilotVersion(2000);
    try {
      await this.parameterMetadataService.loadForVehicle(this.vehicleIdentityStore.state());
    } catch (error) {
      this.uiError.show(error, 'errors.titles.generic');
    }
    await this.startParameterSync();
  }

  reset(): void {
    this.vehicleIdentityStore.reset();
    this.parameterStore.reset();
    this.parameterMetadataService.reset();
  }

  private async waitForAutopilotVersion(timeoutMs: number): Promise<void> {
    if (this.vehicleIdentityStore.state().version.major != null) {
      return;
    }

    const version$ = this.parser.onType$('AUTOPILOT_VERSION').pipe(
      take(1),
      map(() => true)
    );
    const timeout$ = timer(timeoutMs).pipe(map(() => false));

    await firstValueFrom(race(version$, timeout$));
  }

  private async waitForFirstHeartbeat(timeoutMs: number): Promise<void> {
    const heartbeat$ = this.parser.onType$('HEARTBEAT').pipe(
      take(1),
      map(() => true)
    );
    const timeout$ = timer(timeoutMs).pipe(map(() => false));

    const ok = await firstValueFrom(race(heartbeat$, timeout$));
    if (!ok) {
      throw new AppError('errors.bootstrap.no_heartbeat');
    }
  }

  private async requestAutopilotVersionIfPossible(): Promise<void> {
    const targetSystem = this.vehicleIdentityStore.targetSystemId();
    const targetComponent = this.vehicleIdentityStore.targetComponentId();

    if (targetSystem == null || targetComponent == null) {
      return;
    }

    await this.commands.requestAutopilotVersion(targetSystem, targetComponent);
  }

  private async requestTelemetryStreamsIfPossible(): Promise<void> {
    const targetSystem = this.vehicleIdentityStore.targetSystemId();
    const targetComponent = this.vehicleIdentityStore.targetComponentId();

    if (targetSystem == null || targetComponent == null) {
      return;
    }

    await this.commands.requestMessageInterval(
      targetSystem,
      targetComponent,
      MavlinkSessionBootstrapService.MAVLINK_MSG_ID_SYS_STATUS,
      MavlinkSessionBootstrapService.SYS_STATUS_INTERVAL_US
    );

    await this.commands.requestMessageInterval(
      targetSystem,
      targetComponent,
      MavlinkSessionBootstrapService.MAVLINK_MSG_ID_GPS_RAW_INT,
      MavlinkSessionBootstrapService.GPS_RAW_INT_INTERVAL_US
    );

    await this.commands.requestMessageInterval(
      targetSystem,
      targetComponent,
      MavlinkSessionBootstrapService.MAVLINK_MSG_ID_ATTITUDE,
      MavlinkSessionBootstrapService.ATTITUDE_INTERVAL_US
    );

    await this.commands.requestMessageInterval(
      targetSystem,
      targetComponent,
      MavlinkSessionBootstrapService.MAVLINK_MSG_ID_RC_CHANNELS,
      MavlinkSessionBootstrapService.RC_CHANNELS_INTERVAL_US
    );
  }

  private async startParameterSync(): Promise<void> {
    const targetSystem = this.vehicleIdentityStore.targetSystemId();
    const targetComponent = this.vehicleIdentityStore.targetComponentId();

    if (targetSystem == null || targetComponent == null) {
      throw new AppError('errors.bootstrap.unknown_target');
    }

    this.parameterStore.startSync();
    await this.commands.requestAllParameters(targetSystem, targetComponent);
  }
}