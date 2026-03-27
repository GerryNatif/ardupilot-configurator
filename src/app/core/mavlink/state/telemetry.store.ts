import { Injectable, computed, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { INITIAL_TELEMETRY_STATE, TelemetryState } from '../models/telemetry.model';
import { MavlinkParserService } from '../protocol/mavlink-parser.service';

@Injectable({ providedIn: 'root' })

/**
 * Store de telemetrie MAVLink.
 * Ce service agrege les messages de telemetrie principaux recus depuis le parser
 * MAVLink, maintient un etat reactif pour le heartbeat, le GPS, la batterie,
 * l'attitude et les voies RC, puis expose des derivees utiles a l'interface.
 *
 * MAVLink telemetry store.
 * This service aggregates the main telemetry messages received from the MAVLink
 * parser, maintains reactive state for heartbeat, GPS, battery, attitude, and
 * RC channels, and exposes useful derived values for the UI.
 */
export class TelemetryStore {
  private readonly stateSig = signal<TelemetryState>(INITIAL_TELEMETRY_STATE);

  readonly telemetry = computed(() => this.stateSig());
  readonly isArmed = computed(() => this.stateSig().heartbeat.armed);
  readonly hasGpsFix = computed(() => (this.stateSig().gps.fixType ?? 0) >= 3);

  constructor(private readonly parser: MavlinkParserService) {
    this.bindHeartbeat();
    this.bindGps();
    this.bindBattery();
    this.bindAttitude();
    this.bindRcChannels();
  }

  private bindHeartbeat(): void {
    this.parser.onType$('HEARTBEAT')
      .pipe(takeUntilDestroyed())
      .subscribe((hb: any) => {
        this.stateSig.update((s) => ({
          ...s,
          heartbeat: {
            lastSeenMs: Date.now(),
            armed: Boolean((hb.base_mode ?? 0) & 0x80),
            baseMode: hb.base_mode ?? null,
            customMode: hb.custom_mode ?? null
          }
        }));
      });
  }

  private bindGps(): void {
    this.parser.onType$('GPS_RAW_INT')
      .pipe(takeUntilDestroyed())
      .subscribe((gps: any) => {
        this.stateSig.update((s) => ({
          ...s,
          gps: {
            fixType: gps.fix_type ?? null,
            satellitesVisible: gps.satellites_visible ?? null,
            latDeg: gps.lat != null ? gps.lat / 1e7 : null,
            lonDeg: gps.lon != null ? gps.lon / 1e7 : null,
            altM: gps.alt != null ? gps.alt / 1000 : null
          }
        }));
      });
  }

  private bindBattery(): void {
    this.parser.onType$('SYS_STATUS')
      .pipe(takeUntilDestroyed())
      .subscribe((st: any) => {
        this.stateSig.update((s) => ({
          ...s,
          battery: {
            voltageV: st.voltage_battery != null ? st.voltage_battery / 1000 : null,
            currentA: st.current_battery != null ? st.current_battery / 100 : null,
            remainingPct: st.battery_remaining ?? null
          }
        }));
      });
  }

  private bindAttitude(): void {
    this.parser.onType$('ATTITUDE')
      .pipe(takeUntilDestroyed())
      .subscribe((att: any) => {
        const rollDeg = att.roll != null ? att.roll * 180 / Math.PI : null;
        const pitchDeg = att.pitch != null ? att.pitch * 180 / Math.PI : null;
        const yawDeg = att.yaw != null ? att.yaw * 180 / Math.PI : null;

        //console.info('[ATTITUDE store]', { rollDeg, pitchDeg, yawDeg });

        this.stateSig.update((s) => ({
          ...s,
          attitude: {
            lastSeenMs: Date.now(),
            rollDeg,
            pitchDeg,
            yawDeg
          }
        }));
      });
  }

  private bindRcChannels(): void {
    this.parser.onType$('RC_CHANNELS')
      .pipe(takeUntilDestroyed())
      .subscribe((rc: any) => {
        const channelsRaw = [
          rc.chan1_raw ?? null,
          rc.chan2_raw ?? null,
          rc.chan3_raw ?? null,
          rc.chan4_raw ?? null,
          rc.chan5_raw ?? null,
          rc.chan6_raw ?? null,
          rc.chan7_raw ?? null,
          rc.chan8_raw ?? null
        ] as Array<number | null>;

        this.stateSig.update((s) => ({
          ...s,
          rc: {
            lastSeenMs: Date.now(),
            channelCount: rc.chancount ?? null,
            rssi: rc.rssi ?? null,
            channelsRaw
          }
        }));
      });
  }

}