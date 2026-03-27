import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Rangefinder } from './rangefinder';

describe('Rangefinder', () => {
  let component: Rangefinder;
  let fixture: ComponentFixture<Rangefinder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Rangefinder],
    }).compileComponents();

    fixture = TestBed.createComponent(Rangefinder);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
