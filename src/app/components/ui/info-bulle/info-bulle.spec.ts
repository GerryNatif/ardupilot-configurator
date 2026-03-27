import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoBulle } from './info-bulle';

describe('InfoBulle', () => {
  let component: InfoBulle;
  let fixture: ComponentFixture<InfoBulle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoBulle],
    }).compileComponents();

    fixture = TestBed.createComponent(InfoBulle);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
