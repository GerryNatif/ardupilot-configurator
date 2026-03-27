import { TestBed } from '@angular/core/testing';

import { DroneLinkFacade } from './drone-link.facade';

describe('DroneLinkFacade', () => {
  let service: DroneLinkFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DroneLinkFacade);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
