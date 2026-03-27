import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SensorsStatus } from './sensors-status';

describe('SensorsStatus', () => {
  let component: SensorsStatus;
  let fixture: ComponentFixture<SensorsStatus>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SensorsStatus],
    }).compileComponents();

    fixture = TestBed.createComponent(SensorsStatus);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
