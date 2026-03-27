import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PidTable } from './pid-table';

describe('PidTable', () => {
  let component: PidTable;
  let fixture: ComponentFixture<PidTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PidTable],
    }).compileComponents();

    fixture = TestBed.createComponent(PidTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
