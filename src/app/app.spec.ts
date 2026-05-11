import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';

import { App } from './app';
import { DroneLinkFacade } from './core/mavlink/facade/drone-link.facade';
import { Theme } from './core/services/theme';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        provideTranslateService({
          lang: 'fr',
          fallbackLang: 'fr',
        }),
        {
          provide: DroneLinkFacade,
          useValue: {
            isConnected: signal(false),
            vehicleIdentity: signal({
              vehicleKind: 'copter',
              firmwareFamily: 'arducopter',
              version: { text: '4.5.0' },
            }),
            connect: async () => {},
            disconnect: async () => {},
            getLastBaudRate: () => 115200,
          },
        },
        {
          provide: Theme,
          useValue: {
            init: () => {},
            applyVehicleTheme: () => {},
          },
        },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.app-shell')).toBeTruthy();
  });
});
