import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';

import { Power } from './power';
import { DroneLinkFacade } from '../../core/mavlink/facade/drone-link.facade';
import { INITIAL_PARAMETER_STATE } from '../../core/mavlink/models/parameter.model';
import { INITIAL_PARAMETER_METADATA_STATE } from '../../core/mavlink/models/parameter-metadata.model';

describe('Power', () => {
  let component: Power;
  let fixture: ComponentFixture<Power>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Power],
      providers: [
        provideRouter([]),
        {
          provide: DroneLinkFacade,
          useValue: {
            isConnected: signal(false),
            parameterState: signal(INITIAL_PARAMETER_STATE),
            parameterMetadataState: signal(INITIAL_PARAMETER_METADATA_STATE),
            getParameterMetadata: () => undefined,
            getRoundedParameterValue: () => null,
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Power);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
