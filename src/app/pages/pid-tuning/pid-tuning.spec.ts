import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PidTuning } from './pid-tuning';

describe('PidTuning', () => {
  let component: PidTuning;
  let fixture: ComponentFixture<PidTuning>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PidTuning],
    }).compileComponents();

    fixture = TestBed.createComponent(PidTuning);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
