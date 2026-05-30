import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { LinkStatus } from '../models/telemetry.model';
import { MavTransport } from './transport.types';
import { AppError } from '../../error/app-error';

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
  // Sujet comportemental pour l'état du lien (disconnected, connecting, connected)
  private readonly statusSubject = new BehaviorSubject<LinkStatus>('disconnected');
  // Sujet pour les données reçues du port série
  private readonly incomingSubject = new Subject<Uint8Array>();

  // Observables publiques pour l'état du lien et les octets entrants
  readonly status$ = this.statusSubject.asObservable();
  readonly incomingBytes$ = this.incomingSubject.asObservable();

  // État du port série Web Serial
  private port: SerialPort | null = null;
  private reader: ReadableStreamDefaultReader<Uint8Array> | null = null;
  private writer: WritableStreamDefaultWriter<Uint8Array> | null = null;
  // Drapeau pour contrôler la boucle de lecture
  private readLoopRunning = false;
  // Vendors USB les plus fréquents pour les cartes de vol / adaptateurs série.
  private readonly usbRequestFilters: SerialPortFilter[] = [
    { usbVendorId: 0x0483 }, // STMicroelectronics
    { usbVendorId: 0x10C4 }, // Silicon Labs
  ];

  // Filtre un port pour vérifier s'il s'agit d'un port USB
  private isUsbPort(port: SerialPort): boolean {
    const info = port.getInfo();
    // Un port USB possède un ID de fabricant USB
    return info.usbVendorId !== undefined;
  }

  private extractErrorMessage(error: unknown): string {
    if (error instanceof Error && typeof error.message === 'string') {
      return error.message;
    }

    return String(error);
  }

  private isUserCancelledPortSelection(error: unknown): boolean {
    const message = this.extractErrorMessage(error).toLowerCase();
    return message.includes("failed to execute 'requestport' on 'serial'") && message.includes('no port selected');
  }

  // Tente une reconnexion automatique avec un port déjà autorisé
  async autoConnectAuthorized(baudRate = 115200): Promise<boolean> {
    // Vérifie si Web Serial est supporté
    if (!('serial' in navigator)) {
      return false;
    }

    // Déjà connecté
    if (this.readLoopRunning) {
      return true;
    }

    this.statusSubject.next('connecting');

    const serial = navigator.serial;
    // Récupère les ports déjà autorisés par l'utilisateur
    const ports = await serial.getPorts();
    // Filtre pour ne garder que les ports USB
    const usbPorts = ports.filter(port => this.isUsbPort(port));
    const authorizedPort = usbPorts[0] ?? null;

    // Pas de port USB autorisé trouvé
    if (!authorizedPort) {
      this.statusSubject.next('disconnected');
      return false;
    }

    // Ouvre le port sélectionné
    this.port = authorizedPort;
    await this.openCurrentPort(baudRate);

    return true;
  }

  // Établit une connexion série après que l'utilisateur sélectionne un port
  async connect(baudRate = 115200): Promise<void> {
    // Vérifie si Web Serial est supporté par le navigateur
    if (!('serial' in navigator)) {
      this.statusSubject.next('disconnected');
      throw new AppError('errors.transport.webserial_not_supported');
    }

    // Déjà en train de se connecter ou connecté
    if (this.readLoopRunning) {
      return;
    }

    // Met le statut à "connexion en cours"
    this.statusSubject.next('connecting');
    
    const serial = navigator.serial;

    // Réutilise un port USB déjà autorisé, sinon ouvre le sélecteur avec filtres USB courants.
    if (!this.port || !this.isUsbPort(this.port)) {
      const authorizedPorts = await serial.getPorts();
      const authorizedUsbPorts = authorizedPorts.filter((port) => this.isUsbPort(port));
      if (authorizedUsbPorts[0]) {
        this.port = authorizedUsbPorts[0];
      } else {
        try {
          this.port = await serial.requestPort({ filters: this.usbRequestFilters });
        } catch (error) {
          this.statusSubject.next('disconnected');

          if (this.isUserCancelledPortSelection(error)) {
            throw new AppError('errors.transport.port_selection_cancelled');
          }

          throw error;
        }
      }
    }

    // Garde-fou: rejette explicitement tout port non USB.
    if (!this.isUsbPort(this.port)) {
      this.port = null;
      this.statusSubject.next('disconnected');
      throw new AppError('errors.transport.only_usb_supported');
    }

    // Ouvre le port avec le débit binaire spécifié
    await this.openCurrentPort(baudRate);
  }

  // Ferme la connexion série et nettoie les ressources
  async disconnect(): Promise<void> {
    // Arrête la boucle de lecture
    this.readLoopRunning = false;

    // Annule la lecture du flux de données
    try {
      await this.reader?.cancel();
    } catch {
      // Ignore les erreurs lors de l'annulation du lecteur
    }

    await this.cleanupTransportState(true);
  }

  // Envoie des données vers le port série
  async write(bytes: Uint8Array): Promise<void> {
    // Vérifie que l'écrivain est disponible
    if (!this.writer) {
      throw new AppError('errors.transport.writer_unavailable');
    }
    // Écrit les octets dans le port
    await this.writer.write(bytes);
  }

  // Ouvre le port série actuel et configure les lecteurs/écrivains
  private async openCurrentPort(baudRate: number): Promise<void> {
    // Vérifie qu'un port est défini
    if (!this.port) {
      this.statusSubject.next('disconnected');
      throw new AppError('errors.transport.no_port_selected');
    }

    // Tente d'ouvrir le port avec le débit binaire spécifié
    try {
      await this.port.open({ baudRate });
    } catch (error) {
      // En cas d'erreur, passe le statut à "déconnecté" et relance l'erreur
      this.statusSubject.next('disconnected');
      throw new AppError('errors.transport.port_open_failed', {
        reason: this.extractErrorMessage(error),
      });
    }

    // Vérifie que le port est lisible et accessible en écriture
    if (!this.port.readable || !this.port.writable) {
      this.statusSubject.next('disconnected');
      throw new AppError('errors.transport.port_not_readable');
    }

    // Configure le lecteur et l'écrivain pour le flux de données
    this.reader = this.port.readable.getReader();
    this.writer = this.port.writable.getWriter();
    // Met le statut à "connecté"
    this.statusSubject.next('connected');

    // Démarre la boucle de lecture asynchrone
    this.readLoopRunning = true;
    void this.startReadLoop();
  }

  // Boucle asynchrone qui lit en continu les données du port série
  private async startReadLoop(): Promise<void> {
    try {
      // Continue de lire tant que la boucle est active et le lecteur existe
      while (this.readLoopRunning && this.reader) {
        const { value, done } = await this.reader.read();
        // Si le flux est terminé, arrête la boucle
        if (done) {
          break;
        }
        // Si des données ont été reçues, les envoie aux abonnés
        if (value?.length) {
          this.incomingSubject.next(value);
        }
      }
    } finally {
      await this.cleanupTransportState(false);
    }
  }

  private async cleanupTransportState(forceStatusUpdate: boolean): Promise<void> {
    // Nettoyage systématique des ressources même en cas d'erreur
    this.readLoopRunning = false;

    // Libère le verrou du lecteur (gère les erreurs silencieusement)
    try {
      this.reader?.releaseLock();
    } catch {
      // Ignore les erreurs de libération
    }

    // Libère le verrou de l'écrivain (gère les erreurs silencieusement)
    try {
      this.writer?.releaseLock();
    } catch {
      // Ignore les erreurs de libération
    }

    this.reader = null;
    this.writer = null;

    // Ferme le port série
    try {
      if (this.port) {
        await this.port.close();
      }
    } catch {
      // Ignore les erreurs de fermeture
    } finally {
      this.port = null;
    }

    // Met le statut à "déconnecté" en sortie de cleanup.
    if (forceStatusUpdate || this.statusSubject.value !== 'disconnected') {
      this.statusSubject.next('disconnected');
    }
  }
}