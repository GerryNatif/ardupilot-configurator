import { Observable } from 'rxjs';
import { LinkStatus } from '../models/telemetry.model';

/**
 * Contrat de transport MAVLink.
 * Cette interface definit les flux d'etat et d'octets recus, ainsi que les
 * operations minimales pour etablir, fermer et utiliser un lien de transport.
 *
 * MAVLink transport contract.
 * This interface defines the status and incoming byte streams, along with the
 * minimal operations required to establish, close, and use a transport link.
 */
export interface MavTransport {
  readonly status$: Observable<LinkStatus>;
  readonly incomingBytes$: Observable<Uint8Array>;

  connect(): Promise<void>;
  disconnect(): Promise<void>;
  write(bytes: Uint8Array): Promise<void>;
}