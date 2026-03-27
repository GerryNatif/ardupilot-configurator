import { Component, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SensorsStatus } from "../sensors-status/sensors-status";
import { computed, inject } from '@angular/core';
import { DroneLinkFacade } from '../../../core/mavlink/facade/drone-link.facade';
import { UiErrorService } from '../../../core/services/ui-error.service';

type VehicleType = 'copter' | 'plane' | 'rover' | 'boat' | 'sub' | 'station';

@Component({
  selector: 'app-header',
  imports: [SensorsStatus, FormsModule],
  templateUrl: './header.html',
  styleUrls: ['./header.scss'],
})
export class Header {
  readonly menuToggle = output<void>();

  readonly iconBasePath = '/assets/icons/';
  readonly logoPaths: Record<VehicleType | 'default', string> = {
    default: '/assets/logos/ardupilot-logo.svg',
    copter: '/assets/logos/arducopter-logo.svg',
    plane: '/assets/logos/arduplane-logo.svg',
    rover: '/assets/logos/ardurover-logo.svg',
    boat: '/assets/logos/arduboat-logo.svg',
    sub: '/assets/logos/ardusub-logo.svg',
    station: '/assets/logos/ardustation-logo.svg',
  };

  isExpanded = false;
  selectedBaud = '115200';

  private readonly link = inject(DroneLinkFacade);
  private readonly uiError = inject(UiErrorService);
  readonly isConnected = this.link.isConnected;
  readonly connectionLabel = computed(() => this.link.isConnected() ? 'Déconnecter' : 'Connexion');
  readonly vehicleIdentity = this.link.vehicleIdentity;
  readonly detectedVehicle = computed(() => this.vehicleIdentity().vehicleKind);
  readonly detectedFirmware = computed(() => this.vehicleIdentity().firmwareFamily);
  readonly detectedVersion = computed(() => this.vehicleIdentity().version.text);

  constructor() {
    this.selectedBaud = String(this.link.getLastBaudRate());
  }

  getIconPath(iconName: string): string {
    return this.iconBasePath + iconName;
  }

  onMenuToggle(): void {
    this.menuToggle.emit();
  }

  onRevealToggle(): void {
    this.isExpanded = !this.isExpanded;
  }

  get logoPath(): string {
    const vehicle = this.detectedVehicle();

    switch (vehicle) {
      case 'copter':
        return this.logoPaths.copter;
      case 'plane':
        return this.logoPaths.plane;
      case 'rover':
        return this.logoPaths.rover;
      case 'boat':
        return this.logoPaths.boat;
      case 'sub':
        return this.logoPaths.sub;
      case 'station':
        return this.logoPaths.station;
      default:
        return this.logoPaths.default;
    }
  }

  async onConnectionToggle(event: Event): Promise<void> {
    event.preventDefault();
    const wasConnected = this.link.isConnected();

    try {
      if (wasConnected) {
        await this.link.disconnect();
      } else {
        await this.link.connect(Number(this.selectedBaud));
      }
    } catch (error) {
      this.uiError.show(error, wasConnected ? 'errors.titles.disconnect_failed' : 'errors.titles.connect_failed');
    }
  }

}
