import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Rtl } from './rtl';

describe('Rtl', () => {
  let component: Rtl;
  let fixture: ComponentFixture<Rtl>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Rtl],
    }).compileComponents();

    fixture = TestBed.createComponent(Rtl);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
