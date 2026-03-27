import { Component, effect, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TitlePage } from '../../components/ui/title-page/title-page';
import { DroneLinkFacade } from '../../core/mavlink/facade/drone-link.facade';

@Component({
  selector: 'app-connection',
  imports: [TitlePage],
  templateUrl: './connection.html',
  styleUrl: './connection.scss',
})
export class Connection {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly link = inject(DroneLinkFacade);

  constructor() {
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
