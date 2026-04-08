import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { LinkStatus } from '../models/telemetry.model';
import { MavTransport } from './transport.types';
import { AppError } from '../../../core/services/error/app-error';

/**
 * Service de transport MAVLink via Web Serial.
 * Il ouvre et ferme la connexion serie, expose l'etat du lien, transmet les
 * octets recus au reste de l'application et permet l'envoi de donnees vers
 * le port selectionne.
 *
 * MAVLink transport service backed by Web Serial.
 * It opens and closes the serial connection, exposes the link status,
 * forwards incoming bytes to the rest of the application, and allows data to
 * be written to the selected port.
 */
@Injectable({ providedIn: 'root' })

export class SerialTransportService implements MavTransport {
  private readonly statusSubject = new BehaviorSubject<LinkStatus>('disconnected');
  private readonly incomingSubject = new Subject<Uint8Array>();

  readonly status$ = this.statusSubject.asObservable();
  readonly incomingBytes$ = this.incomingSubject.asObservable();

  private port: SerialPort | null = null;
  private reader: ReadableStreamDefaultReader<Uint8Array> | null = null;
  private writer: WritableStreamDefaultWriter<Uint8Array> | null = null;
  private readLoopRunning = false;

  async autoConnectAuthorized(baudRate = 115200): Promise<boolean> {
    if (!('serial' in navigator)) {
      return false;
    }

    if (this.readLoopRunning) {
      return true;
    }

    this.statusSubject.next('connecting');

    const serial = navigator.serial;
    const ports = await serial.getPorts();
    const authorizedPort = ports[0] ?? null;

    if (!authorizedPort) {
      this.statusSubject.next('disconnected');
      return false;
    }

    this.port = authorizedPort;
    await this.openCurrentPort(baudRate);

    return true;
  }

  async connect(baudRate = 115200): Promise<void> {
    if (!('serial' in navigator)) {
      this.statusSubject.next('error');
      throw new AppError('errors.transport.webserial_not_supported');
    }

    if (this.readLoopRunning) {
      return;
    }

    this.statusSubject.next('connecting');
    
    const serial = navigator.serial;

    // Reutilise un port deja autorise pour eviter de redemander l'appareil.
    if (!this.port) {
      const authorizedPorts = await serial.getPorts();
      this.port = authorizedPorts[0] ?? await serial.requestPort();
    }

    await this.openCurrentPort(baudRate);
  }

  async disconnect(): Promise<void> {
    this.readLoopRunning = false;

    try {
      await this.reader?.cancel();
    } catch {
      // Ignore read cancel errors during teardown.
    }

    this.reader?.releaseLock();
    this.writer?.releaseLock();

    this.reader = null;
    this.writer = null;

    try {
      if (this.port) {
        await this.port.close();
      }
    } catch {
      // Ignore close errors to keep UI state consistent.
    } finally {
      this.port = null;
      this.statusSubject.next('disconnected');
    }
  }

  async write(bytes: Uint8Array): Promise<void> {
    if (!this.writer) {
      throw new AppError('errors.transport.writer_unavailable');
    }
    await this.writer.write(bytes);
  }

  private async openCurrentPort(baudRate: number): Promise<void> {
    if (!this.port) {
      this.statusSubject.next('error');
      throw new AppError('errors.transport.no_port_selected');
    }

    await this.port.open({ baudRate });

    if (!this.port.readable || !this.port.writable) {
      this.statusSubject.next('error');
      throw new AppError('errors.transport.port_not_readable');
    }

    this.reader = this.port.readable.getReader();
    this.writer = this.port.writable.getWriter();
    this.statusSubject.next('connected');

    this.readLoopRunning = true;
    void this.startReadLoop();
  }

  private async startReadLoop(): Promise<void> {
    try {
      while (this.readLoopRunning && this.reader) {
        const { value, done } = await this.reader.read();
        if (done) {
          break;
        }
        if (value?.length) {
          this.incomingSubject.next(value);
        }
      }
    } finally {
      this.readLoopRunning = false;

      try {
        this.reader?.releaseLock();
      } catch {
        // Ignore release errors.
      }

      try {
        this.writer?.releaseLock();
      } catch {
        // Ignore release errors.
      }

      this.reader = null;
      this.writer = null;

      try {
        if (this.port) {
          await this.port.close();
        }
      } catch {
        // Ignore close errors during teardown.
      } finally {
        this.port = null;
      }

      if (this.statusSubject.value !== 'disconnected') {
        this.statusSubject.next('disconnected');
      }
    }
  }
}