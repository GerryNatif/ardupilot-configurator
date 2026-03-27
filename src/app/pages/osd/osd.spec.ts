import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Osd } from './osd';

describe('Osd', () => {
  let component: Osd;
  let fixture: ComponentFixture<Osd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Osd],
    }).compileComponents();

    fixture = TestBed.createComponent(Osd);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
