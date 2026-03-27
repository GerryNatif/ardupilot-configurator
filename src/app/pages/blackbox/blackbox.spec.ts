import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Blackbox } from './blackbox';

describe('Blackbox', () => {
  let component: Blackbox;
  let fixture: ComponentFixture<Blackbox>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Blackbox],
    }).compileComponents();

    fixture = TestBed.createComponent(Blackbox);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
