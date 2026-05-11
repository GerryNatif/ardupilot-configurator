import { Component, effect, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DroneLinkFacade } from '../../core/mavlink/facade/drone-link.facade';

@Component({
  selector: 'app-connection',
  imports: [],
  templateUrl: './connection.html',
  styleUrl: './connection.scss',
})
export class Connection {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly link = inject(DroneLinkFacade);

  constructor() {
    //Cette route sert d'écran d'attente pendant que le contrôleur de vol redémarre et se reconnecte. 
    //This route acts as a waiting screen while the flight controller reboots and reconnects.
    effect(() => {
      if (!this.link.isConnected()) {
        return;
      }

      const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
      if (!returnUrl || returnUrl === '/connection') {
        return;
      }

      void this.router.navigateByUrl(returnUrl);
    });
  }
}
