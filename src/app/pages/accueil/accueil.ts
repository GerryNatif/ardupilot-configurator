import { Component } from '@angular/core';
import { ThreeViewer } from '../../components/three-viewer/three-viewer';
import { VehicleDisplay } from '../../components/vehicle-display/vehicle-display';
import { TitlePage } from '../../components/ui/title-page/title-page';

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [VehicleDisplay, ThreeViewer, TitlePage],
  templateUrl: './accueil.html',
  styleUrl: './accueil.scss',
})
export class Accueil {}