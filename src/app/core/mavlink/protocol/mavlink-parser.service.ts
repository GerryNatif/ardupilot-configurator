import { Injectable, OnDestroy } from '@angular/core';
import { Subject, Subscription, filter, map, share } from 'rxjs';
import { SerialTransportService } from '../transport/serial-transport.service';
import { MAVLink20Processor, mavlink20, Buffer as MavBuffer } from 'mavlink-browser';
import { AppError } from '../../error/app-error';

type AnyMavMessage = Record<string, unknown>;

interface ParsedMavMessage {
  readonly raw: AnyMavMessage;
  readonly name: string;
}

/**
 * Service responsable du décodage des trames MAVLink 2 reçues depuis le
 * transport série. Il expose un flux d'observables contenant tous les messages
 * parsés, permet de s'abonner à un type de message précis et d'envoyer des
 * paquets MAVLink 2 vers le périphérique connecté.
 *
 * This service is responsible for decoding MAVLink 2 frames received from the
 * serial transport. It exposes an observable stream of all parsed messages,
 * allows subscribing to a specific message type and sending MAVLink 2 packets
 * back to the connected device.
 */

@Injectable({ providedIn: 'root' })

export class MavlinkParserService implements OnDestroy {
  private readonly parser = new MAVLink20Processor(null, 255, 190);

  private readonly messageSubject = new Subject<ParsedMavMessage>();
  private transportSub?: Subscription;

  readonly messages$ = this.messageSubject.asObservable().pipe(
    map((entry) => entry.raw),
    share()
  );

  constructor(private readonly transport: SerialTransportService) {

    this.parser.on('message', (msg: AnyMavMessage) => {
      const name = this.getMessageName(msg);
      this.messageSubject.next({ raw: msg, name });
    });

    this.transportSub = this.transport.incomingBytes$.subscribe((chunk) => {
      this.parser.parseBuffer(chunk);
    });
  }

  ngOnDestroy(): void {
    this.transportSub?.unsubscribe();
  }

  // Envoie un message de heartbeat MAVLink 2 pour "amorcer" la communication avec le périphérique.
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