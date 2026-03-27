import { TestBed } from '@angular/core/testing';

import { TelemetryStore } from './telemetry.store';

describe('TelemetryStore', () => {
  let service: TelemetryStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TelemetryStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
