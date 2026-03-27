import { Component } from '@angular/core';
import { TitlePage } from '../../components/ui/title-page/title-page';

@Component({
  selector: 'app-dashboard',
  imports: [TitlePage],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {}
