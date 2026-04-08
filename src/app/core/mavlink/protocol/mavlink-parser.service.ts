import { Injectable, OnDestroy } from '@angular/core';
import { Subject, Subscription, filter, map, share } from 'rxjs';
import { SerialTransportService } from '../transport/serial-transport.service';
import { MAVLink20Processor, mavlink20, Buffer as MavBuffer } from 'mavlink-browser';
import { AppError } from '../../../core/services/error/app-error';

type AnyMavMessage = Record<string, unknown>;

interface ParsedMavMessage {
  readonly raw: AnyMavMessage;
  readonly name: string;
}

@Injectable({ providedIn: 'root' })

export class MavlinkParserService implements OnDestroy {
  private readonly parser = new MAVLink20Processor(null, 255, 190);

  private readonly messageSubject = new Subject<ParsedMavMessage>();
  private transportSub?: Subscription;

  //private readonly rateTimerId: ReturnType<typeof setInterval>;
  readonly messages$ = this.messageSubject.asObservable().pipe(
    map((entry) => entry.raw),
    share()
  );

  constructor(private readonly transport: SerialTransportService) {
    let okCount = 0;
    let badCount = 0;

    /*
    this.rateTimerId = setInterval(() => {
      console.info('[MAVLINK] rate', { okPerSec: okCount, badPerSec: badCount });
      okCount = 0;
      badCount = 0;
    }, 1000);
    */

    this.parser.on('message', (msg: AnyMavMessage) => {
      const name = this.getMessageName(msg);
      
      // console.log('[MAVLINK] message brut', msg);
      if (name === 'BAD_DATA') {
        badCount += 1;
        const reason = (msg as { _reason?: string })['_reason'] ?? 'unknown';
        //console.warn('[MAVLINK] bad_data', reason);
      } else {
        okCount += 1;

        // Log important: affiche tous les messages utiles
        if (['HEARTBEAT', 'GPS_RAW_INT', 'SYS_STATUS', 'ATTITUDE'].includes(name)) {
          //console.info('[MAVLINK] message', name, msg);
        }
      }

      this.messageSubject.next({ raw: msg, name });
    });

    this.transportSub = this.transport.incomingBytes$.subscribe((chunk) => {
      this.parser.parseBuffer(chunk);
    });
  }

  ngOnDestroy(): void {
    //clearInterval(this.rateTimerId);
    this.transportSub?.unsubscribe();
  }

  async sendMavlink2PrimingHeartbeat(): Promise<void> {
    const m = this.mavlink();
    const heartbeat = new m.messages.heartbeat(
      m.MAV_TYPE_GCS,
      m.MAV_AUTOPILOT_INVALID,
      0,
      0,
      m.MAV_STATE_ACTIVE,
      3
    );
    await this.sendPacked(heartbeat);
  }

  onType$<T = AnyMavMessage>(name: string) {
    const normalized = name.toUpperCase();

    return this.messageSubject.asObservable().pipe(
      filter((entry) => entry.name === normalized),
      map((entry) => entry.raw as T)
    );
  }

  async sendPacked(message: { pack: (parser: unknown) => number[] | Uint8Array }): Promise<void> {
    const payload = message.pack(this.parser);
    const payloadBytes = payload instanceof Uint8Array ? payload : Uint8Array.from(payload);

    if (payloadBytes.length === 0 || payloadBytes[0] !== 253) {
      throw new AppError('errors.mavlink.invalid_start_byte');
    }

    const bytes = new MavBuffer(payloadBytes);
    await this.transport.write(bytes);
  }

  mavlink() {
    return mavlink20;
  }

  private getMessageName(msg: AnyMavMessage): string {
    const n1 = (msg as any)['name'];
    if (typeof n1 === 'string' && n1.length > 0) {
      return n1.toUpperCase();
    }

    const n2 = (msg as any)['_name'];
    if (typeof n2 === 'string' && n2.length > 0) {
      return n2.toUpperCase();
    }

    const ctorName = (msg as { constructor?: { name?: string } }).constructor?.name;
    return typeof ctorName === 'string' ? ctorName.toUpperCase() : 'UNKNOWN';
  }
}