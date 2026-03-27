import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleDisplay } from './vehicle-display';

describe('VehicleDisplay', () => {
  let component: VehicleDisplay;
  let fixture: ComponentFixture<VehicleDisplay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleDisplay],
    }).compileComponents();

    fixture = TestBed.createComponent(VehicleDisplay);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
