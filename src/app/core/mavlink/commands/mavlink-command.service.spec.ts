import { TestBed } from '@angular/core/testing';

import { MavlinkCommandService } from './mavlink-command.service';

describe('MavlinkCommandService', () => {
  let service: MavlinkCommandService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MavlinkCommandService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
