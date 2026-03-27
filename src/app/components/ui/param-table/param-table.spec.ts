import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParamTable } from './param-table';

describe('ParamTable', () => {
  let component: ParamTable;
  let fixture: ComponentFixture<ParamTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParamTable],
    }).compileComponents();

    fixture = TestBed.createComponent(ParamTable);
    fixture.componentRef.setInput('section', {
      id: 'spec-section',
      title: 'Spec section',
      rows: [],
    });
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should select the matching numeric option', async () => {
    fixture.componentRef.setInput('section', {
      id: 'select-section',
      title: 'Select section',
      rows: [
        {
          name: 'BATT_MONITOR',
          type: 'select',
          value: 3,
          options: [
            { value: 0, label: 'Disabled' },
            { value: 3, label: 'Analog Voltage Only' },
          ],
        },
      ],
    });

    fixture.detectChanges();
    await fixture.whenStable();

    const select = fixture.nativeElement.querySelector('select') as HTMLSelectElement | null;
    expect(select).not.toBeNull();
    expect(select?.value).toBe('3');
    expect(select?.selectedIndex).toBe(1);
  });
});
