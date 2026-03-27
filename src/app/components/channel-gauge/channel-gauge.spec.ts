import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelGauge } from './channel-gauge';

describe('ChannelGauge', () => {
  let component: ChannelGauge;
  let fixture: ComponentFixture<ChannelGauge>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChannelGauge],
    }).compileComponents();

    fixture = TestBed.createComponent(ChannelGauge);
    fixture.componentRef.setInput('title', 'Channel 1');
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
