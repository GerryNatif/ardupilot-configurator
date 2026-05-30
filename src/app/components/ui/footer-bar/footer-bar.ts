import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DroneLinkFacade } from '../../../core/mavlink/facade/drone-link.facade';
import { SensorsStatus } from '../sensors-status/sensors-status';

@Component({
  selector: 'app-footer-bar',
  imports: [SensorsStatus],
  templateUrl: './footer-bar.html',
  styleUrls: ['./footer-bar.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterBar {
  private readonly link = inject(DroneLinkFacade);
  readonly isConnected = this.link.isConnected;
}
