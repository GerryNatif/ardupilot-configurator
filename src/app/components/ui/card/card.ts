import { Component, input } from '@angular/core';

export interface CardTag {
  label: string;
  variant?: 'primary' | 'dark' | 'default';
}

export interface CardDetail {
  label: string;
  value: string;
  bold?: boolean;
}

@Component({
  selector: 'app-card',
  imports: [],
  templateUrl: './card.html',
  styleUrl: './card.scss',
})
export class Card {
  readonly image = input<string | undefined>(undefined);
  readonly title = input<string>('');
  readonly tags = input<CardTag[]>([]);
  readonly details = input<CardDetail[]>([]);
}
