import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreejsCanvas } from './threejs-canva';

describe('ThreejsCanvas', () => {
  let component: ThreejsCanvas;
  let fixture: ComponentFixture<ThreejsCanvas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThreejsCanvas],
    }).compileComponents();

    fixture = TestBed.createComponent(ThreejsCanvas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
