import { Component } from '@angular/core';
import { GuiBox } from '../../components/ui/gui-box/gui-box';
import { TitlePage } from '../../components/ui/title-page/title-page';

@Component({
  selector: 'app-help',
  imports: [GuiBox, TitlePage],
  templateUrl: './help.html',
  styleUrl: './help.scss',
})
export class Help {}
