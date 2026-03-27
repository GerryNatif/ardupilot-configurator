import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttributDropdown } from './attribut-dropdown';

describe('AttributDropdown', () => {
  let component: AttributDropdown;
  let fixture: ComponentFixture<AttributDropdown>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttributDropdown],
    }).compileComponents();

    fixture = TestBed.createComponent(AttributDropdown);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
