import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Motors } from './motors';

describe('Motors', () => {
  let component: Motors;
  let fixture: ComponentFixture<Motors>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Motors],
    }).compileComponents();

    fixture = TestBed.createComponent(Motors);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
