import { TestBed } from '@angular/core/testing';

import { VehicleIdentityStore } from './vehicle-identity.store.js';

describe('VehicleIdentityStoreTs', () => {
  let service: VehicleIdentityStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VehicleIdentityStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
