import { Injectable } from '@angular/core';
import { VehicleKind } from '../mavlink/models/vehicle-identity.model';

export type ThemeName = 'earth' | 'lime' | 'steel' | 'amber' | 'sky';
export type ThemeMode = 'light' | 'dark' | 'system';

const VEHICLE_THEME_MAP: Record<VehicleKind, ThemeName | null> = {
  copter:  'lime',
  plane:   'steel',
  rover:   'earth',
  boat:    'sky',
  sub:     'sky',
  station: 'amber',
  unknown: 'amber',
};

@Injectable({
  providedIn: 'root',
})
export class Theme {
  
  private readonly themeStorageKey = 'app-theme';
  private readonly modeStorageKey = 'app-theme-mode';
  private readonly defaultTheme: ThemeName = 'amber';
  private readonly mediaQuery = this.getMediaQuery();

  init(): void {
    const savedTheme = this.normalizeThemeName(localStorage.getItem(this.themeStorageKey));
    const savedMode = (localStorage.getItem(this.modeStorageKey) as ThemeMode | null) ?? 'system';

    this.setTheme(savedTheme);
    this.setMode(savedMode, false);

    this.mediaQuery.addEventListener?.('change', () => {
      const mode = this.getMode();
      if (mode === 'system') {
        this.applyMode('system');
      }
    });
  }

  getTheme(): ThemeName {
    return this.normalizeThemeName(localStorage.getItem(this.themeStorageKey));
  }

  getMode(): ThemeMode {
    return (localStorage.getItem(this.modeStorageKey) as ThemeMode | null) ?? 'system';
  }

  setTheme(theme: ThemeName): void {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem(this.themeStorageKey, theme);
  }

  applyVehicleTheme(kind: VehicleKind): void {
    const theme = VEHICLE_THEME_MAP[kind];
    if (theme !== null) {
      document.body.setAttribute('data-theme', theme);
    } else {
      this.restoreUserTheme();
    }
  }

  restoreUserTheme(): void {
    document.body.setAttribute('data-theme', this.getTheme());
  }

  setMode(mode: ThemeMode, persist = true): void {
    this.applyMode(mode);

    if (persist) {
      localStorage.setItem(this.modeStorageKey, mode);
    }
  }

  private applyMode(mode: ThemeMode): void {
    const shouldUseDark = mode === 'dark' || (mode === 'system' && this.mediaQuery.matches);

    document.body.classList.toggle('dark-theme', shouldUseDark);
  }

  private getMediaQuery(): MediaQueryList {
    if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
      return window.matchMedia('(prefers-color-scheme: dark)');
    }

    return {
      matches: false,
      media: '(prefers-color-scheme: dark)',
      onchange: null,
      addEventListener() {},
      removeEventListener() {},
      addListener() {},
      removeListener() {},
      dispatchEvent() {
        return false;
      }
    } as MediaQueryList;
  }

  private normalizeThemeName(rawTheme: string | null): ThemeName {
    if (
      rawTheme === 'earth' ||
      rawTheme === 'lime' ||
      rawTheme === 'steel' ||
      rawTheme === 'amber' ||
      rawTheme === 'sky'
    ) {
      return rawTheme;
    }

    // Map removed legacy themes to the closest available one.
    if (rawTheme === 'yellow') {
      return 'amber';
    }

    if (rawTheme === 'green') {
      return 'lime';
    }

    if (rawTheme === 'blue') {
      return 'steel';
    }

    if (rawTheme === 'contrast') {
      return 'sky';
    }

    return this.defaultTheme;
  }
}
