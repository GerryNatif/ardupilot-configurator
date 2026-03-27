import { TestBed } from '@angular/core/testing';

import { MavlinkParserService } from './mavlink-parser.service';

describe('MavlinkParserService', () => {
  let service: MavlinkParserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MavlinkParserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
