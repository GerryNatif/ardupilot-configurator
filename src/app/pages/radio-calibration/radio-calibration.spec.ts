import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadioCalibration } from './radio-calibration';

describe('RadioCalibration', () => {
  let component: RadioCalibration;
  let fixture: ComponentFixture<RadioCalibration>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RadioCalibration],
    }).compileComponents();

    fixture = TestBed.createComponent(RadioCalibration);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
