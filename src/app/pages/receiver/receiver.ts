import { Component } from '@angular/core';
import { TitlePage } from '../../components/ui/title-page/title-page';
import { ChannelGauge } from '../../components/channel-gauge/channel-gauge';
import { RcStick } from '../../components/rc-stick/rc-stick';
import { GuiBox } from '../../components/ui/gui-box/gui-box';

@Component({
  selector: 'app-receiver',
  imports: [TitlePage, ChannelGauge, RcStick, GuiBox],
  templateUrl: './receiver.html',
  styleUrl: './receiver.scss',
})
export class Receiver {
  
}

/*
RCMAP_*

Channel 1: Roll input
Channel 2: Pitch input
Channel 3: Throttle input
Channel 4: Yaw input
 RCMAP_ROLL, RCMAP_PITCH, RCMAP_THROTTLE and RCMAP_YAW
 need reboot

RCx_MIN
RCx_MAX
RCx_TRIM
RCx_REVERSED
RCx_DZ
RCx_OPTION

*/
