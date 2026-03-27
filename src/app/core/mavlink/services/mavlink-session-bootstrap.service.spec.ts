import { TestBed } from '@angular/core/testing';

import { MavlinkSessionBootstrapService } from './mavlink-session-bootstrap.service';

describe('MavlinkSessionBootstrapService', () => {
  let service: MavlinkSessionBootstrapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MavlinkSessionBootstrapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
