import { Component } from '@angular/core';
import { TitlePage } from '../../components/ui/title-page/title-page';

@Component({
  selector: 'app-led-strip',
  imports: [TitlePage],
  templateUrl: './led-strip.html',
  styleUrl: './led-strip.scss',
})
export class LedStrip {}
