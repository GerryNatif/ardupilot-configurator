import { Component } from '@angular/core';
import { TitlePage } from '../../components/ui/title-page/title-page';
import { AttributDropdown } from "../../components/ui/attribut-dropdown/attribut-dropdown";

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [TitlePage, AttributDropdown],
  templateUrl: './accueil.html',
  styleUrl: './accueil.scss',
})
export class Accueil {
  readonly parameters = [
    { name: 'Firmware', value: 'param1' },
    { name: 'Version', value: 'param2' },
    { name: 'Type de véhicule', value: 'param3' },
    { name: 'Controleur de vol', value: 'param4' },
    // Ajoutez autant de paramètres que nécessaire
  ];
}