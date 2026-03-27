import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Failsafe } from './failsafe';

describe('Failsafe', () => {
  let component: Failsafe;
  let fixture: ComponentFixture<Failsafe>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Failsafe],
    }).compileComponents();

    fixture = TestBed.createComponent(Failsafe);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
