import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardLogging } from './onboard-logging';

describe('OnboardLogging', () => {
  let component: OnboardLogging;
  let fixture: ComponentFixture<OnboardLogging>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OnboardLogging],
    }).compileComponents();

    fixture = TestBed.createComponent(OnboardLogging);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
