import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';

import { Connection } from './connection';
import { DroneLinkFacade } from '../../core/mavlink/facade/drone-link.facade';

describe('Connection', () => {
  let component: Connection;
  let fixture: ComponentFixture<Connection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Connection],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: convertToParamMap({}),
            },
          },
        },
        {
          provide: DroneLinkFacade,
          useValue: {
            isConnected: signal(false),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Connection);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
