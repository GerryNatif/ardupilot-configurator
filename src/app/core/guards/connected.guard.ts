import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { DroneLinkFacade } from '../mavlink/facade/drone-link.facade';

export const connectedGuard: CanActivateFn = (_route, state) => {
  const link = inject(DroneLinkFacade);
  const router = inject(Router);

  if (link.isConnected()) {
    return true;
  }

  return router.createUrlTree(['/connection'], {
    queryParams: {
      returnUrl: state.url,
    },
  });
};
