import { TestBed } from '@angular/core/testing';

import { ParameterStore } from './parameter.store.js';

describe('ParameterStoreTs', () => {
  let service: ParameterStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParameterStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
