import { Component, input } from '@angular/core';

@Component({
  selector: 'app-gui-box',
  imports: [],
  templateUrl: './gui-box.html',
  styleUrls: ['./gui-box.scss'],
})
export class GuiBox {
  readonly title = input<string>('');
}
