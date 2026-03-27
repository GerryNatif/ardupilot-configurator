import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RtlVisualizer } from './rtl-visualizer';

describe('RtlVisualizer', () => {
  let component: RtlVisualizer;
  let fixture: ComponentFixture<RtlVisualizer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RtlVisualizer],
    }).compileComponents();

    fixture = TestBed.createComponent(RtlVisualizer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
