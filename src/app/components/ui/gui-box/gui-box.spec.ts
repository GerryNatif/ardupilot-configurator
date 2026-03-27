import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuiBox } from './gui-box';

describe('GuiBox', () => {
  let component: GuiBox;
  let fixture: ComponentFixture<GuiBox>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuiBox],
    }).compileComponents();

    fixture = TestBed.createComponent(GuiBox);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
