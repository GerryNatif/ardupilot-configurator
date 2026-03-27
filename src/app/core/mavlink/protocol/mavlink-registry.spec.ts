import { TestBed } from '@angular/core/testing';

import { MavlinkRegistry } from './mavlink-registry';

describe('MavlinkRegistry', () => {
  let service: MavlinkRegistry;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MavlinkRegistry);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
