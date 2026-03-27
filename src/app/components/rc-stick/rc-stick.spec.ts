import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RcStick } from './rc-stick';

describe('RcStick', () => {
  let component: RcStick;
  let fixture: ComponentFixture<RcStick>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RcStick],
    }).compileComponents();

    fixture = TestBed.createComponent(RcStick);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
