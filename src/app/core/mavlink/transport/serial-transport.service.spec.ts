import { TestBed } from '@angular/core/testing';

import { SerialTransportService } from './serial-transport.service';

describe('SerialTransportService', () => {
  let service: SerialTransportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SerialTransportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
