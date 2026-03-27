import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DroneLinkFacade } from '../../core/mavlink/facade/drone-link.facade';
import { GuiBox } from '../ui/gui-box/gui-box';

@Component({
  selector: 'app-vehicle-display',
  imports: [CommonModule, GuiBox],
  templateUrl: './vehicle-display.html',
  styleUrl: './vehicle-display.scss',
})
export class VehicleDisplay {
  private readonly link = inject(DroneLinkFacade);

  readonly isConnected = this.link.isConnected;
  readonly attitude = computed(() => this.link.telemetry().attitude);
  readonly rc = computed(() => this.link.telemetry().rc);

  readonly rollText = computed(() => this.formatDeg(this.attitude().rollDeg));
  readonly pitchText = computed(() => this.formatDeg(this.attitude().pitchDeg));
  readonly yawText = computed(() => this.formatDeg(this.attitude().yawDeg));
  readonly rcChannels = computed(() => this.rc().channelsRaw);

  private formatDeg(value: number | null): string {
    return value == null ? '--' : `${value.toFixed(1)} deg`;
  }
}