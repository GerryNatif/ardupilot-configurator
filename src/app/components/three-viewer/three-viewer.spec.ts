import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreeViewer } from './three-viewer';
import { DroneLinkFacade } from '../../core/mavlink/facade/drone-link.facade';
import { INITIAL_TELEMETRY_STATE } from '../../core/mavlink/models/telemetry.model';

describe('ThreeViewer', () => {
  let component: ThreeViewer;
  let fixture: ComponentFixture<ThreeViewer>;
  const telemetry = signal({
    ...INITIAL_TELEMETRY_STATE,
    attitude: {
      lastSeenMs: Date.now(),
      rollDeg: 12.4,
      pitchDeg: -3.8,
      yawDeg: 91.2
    }
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThreeViewer],
      providers: [
        {
          provide: DroneLinkFacade,
          useValue: {
            telemetry,
            isConnected: signal(true)
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ThreeViewer);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose current attitude values in the HUD', () => {
    const content = fixture.nativeElement.textContent as string;

    expect(content).toContain('12.4 deg');
    expect(content).toContain('-3.8 deg');
    expect(content).toContain('91.2 deg');
  });
});
