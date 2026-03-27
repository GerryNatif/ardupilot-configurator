import { Component, input } from '@angular/core';

@Component({
  selector: 'app-title-page',
  standalone: true,
  imports: [],
  templateUrl: './title-page.html',
  styleUrl: './title-page.scss',
})
export class TitlePage {
  title = input.required<string>();
  actionLabel = input<string>('');
  actionUrl = input<string>('');
  actionTarget = input<string>('_blank');
}