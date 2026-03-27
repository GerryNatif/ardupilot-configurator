import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LedStrip } from './led-strip';

describe('LedStrip', () => {
  let component: LedStrip;
  let fixture: ComponentFixture<LedStrip>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LedStrip],
    }).compileComponents();

    fixture = TestBed.createComponent(LedStrip);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
