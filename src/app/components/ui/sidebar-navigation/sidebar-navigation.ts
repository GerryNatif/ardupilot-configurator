import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { filter } from 'rxjs/operators';

type SidebarMode = 'disconnected' | 'connected';

interface SidebarNavItem {
  key: string;
  translationKey: string;
  label: string;
  iconName?: string;
  id?: string;
  routePath?: string;
}

@Component({
  selector: 'app-sidebar-navigation',
  imports: [CommonModule, TranslatePipe],
  templateUrl: './sidebar-navigation.html',
  styleUrls: ['./sidebar-navigation.scss'],
})

export class SidebarNavigation {
  private readonly router = inject(Router);

  readonly mode = input<SidebarMode>('disconnected');
  readonly activeTabClass = input<string | null>(null);
  
  readonly iconBasePath = '/assets/icons/';
  readonly fallbackIconName = 'rotate-orbit.svg';
  private readonly internalActiveTabClass = signal<string | null>(null);
  private readonly currentUrl = signal(this.normalizeUrl(this.router.url));

  readonly disconnectedItems: ReadonlyArray<SidebarNavItem> = [
    {
      key: 'tab_landing', 
      id: 'tab_landing',
      translationKey: 'tabLanding',
      label: 'Bienvenue',
      iconName: 'home-close.svg',
      routePath: '/'
    },
    {
      key: 'tab_help',
      id: 'tab_help',
      translationKey: 'tabHelp',
      label: 'Manuels & Aide',
      iconName: 'help.svg',
      routePath: '/help'
    },
    
    {
      key: 'tab_firmware_flasher',
      id: 'tabFirmware',
      translationKey: 'tabFirmwareFlasher',
      label: 'Flasher le Firmware',
      iconName: 'usb-cable.svg',
      routePath: '/firmware'

    },
    /*{
      key: 'tab_model_editor',
      id: 'tab_model_editor',
      translationKey: 'tabModelEditor',
      label: 'Éditeur de Modèle',
      iconName: 'rotate-orbit.svg',
      routePath: '/model-editor'
    },
    {
      key: 'tab_options',
      id: 'tab_options',
      translationKey: 'tabOptions',
      label: 'Options',
      iconName: 'chipset.svg'
    },*/
  ];

  readonly connectedItems: ReadonlyArray<SidebarNavItem> = [
    { key: 'tab_configuration', translationKey: 'tabConfiguration', label: 'Configuration', iconName: 'config.svg', routePath: '/configuration' },
    //{ key: 'tab_connection', translationKey: 'tabConnection', label: 'Connection', iconName: 'ports.svg', routePath: '/connection' },
    { key: 'tab_power', translationKey: 'tabPower', label: 'Power', iconName: 'power.svg', routePath: '/power' },
    { key: 'tab_receiver', translationKey: 'tabReceiver', label: 'Receiver', iconName: 'rx.svg', routePath: '/receiver' },
    { key: 'tab_modes', translationKey: 'tabModes', label: 'Modes', iconName: 'modes.svg', routePath: '/modes' },
    //{ key: 'tab_model_editor', translationKey: 'tabModelEditor', label: 'Éditeur de Modèle', iconName: 'rotate-orbit.svg', routePath: '/model-editor' },
    { key: 'tab_motors', translationKey: 'tabMotor', label: 'Moteur/Servo', iconName: 'motor.svg', routePath: '/motors' },
    { key: 'tab_failsafe', translationKey: 'tabFailsafe', label: 'Failsafe', iconName: 'parachute.svg', routePath: '/failsafe' },
    //{ key: 'tab_pid_tuning', translationKey: 'tabPidTuning', label: 'PID Tuning', iconName: 'pid.svg', routePath: '/pid-tuning' },
    //{ key: 'tab_gps', translationKey: 'tabGPS', label: 'GPS', iconName: 'gps.svg', routePath: '/gps' },
    //{ key: 'tab_osd', translationKey: 'tabOsd', label: 'OSD', iconName: 'satellite-variant.svg', routePath: '/osd' },
    //{ key: 'tab_vtx', translationKey: 'tabVtx', label: 'VTX', iconName: 'satellite-variant.svg' },
    //{ key: 'tab_transponder', translationKey: 'tabTransponder', label: 'Transponder', iconName: 'satellite-variant.svg' },
    //{ key: 'tab_led_strip', translationKey: 'tabLedStrip', label: 'LED Strip', iconName: 'led.svg', routePath: '/led-strip' },
    //{ key: 'tab_onboard-logging', translationKey: 'tabOnboardLogging', label: 'BlackBox', iconName: 'data-ship.svg', routePath: '/blackbox' },
    { key: 'tab_rtl', translationKey: 'tabRtl', label: 'RTL', iconName: 'satellite-variant.svg', routePath: '/rtl' }
  ];

  readonly visibleItems = computed((): ReadonlyArray<SidebarNavItem> =>
    this.mode() === 'connected' ? this.connectedItems : this.disconnectedItems
  );

  private readonly routeActiveTabClass = computed(() => {
    const currentUrl = this.currentUrl();
    const matchingItem = this.visibleItems().find((item) => item.routePath === currentUrl);
    return matchingItem?.key ?? null;
  });

  private readonly currentActiveTabClass = computed(() =>
    this.activeTabClass() ?? this.routeActiveTabClass() ?? this.internalActiveTabClass()
  );

  constructor() {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed()
      )
      .subscribe((event) => {
        this.currentUrl.set(this.normalizeUrl(event.urlAfterRedirects));
      });

    effect(() => {
      this.ensureValidActiveTab();
    });
  }

  isActive(item: SidebarNavItem): boolean {
    return this.currentActiveTabClass() === item.key;
  }

  onItemClick(item: SidebarNavItem, event: MouseEvent): void {
    event.preventDefault();

    if (this.activeTabClass() === null) {
      this.internalActiveTabClass.set(item.key);
    }

    if (item.routePath) {
      void this.router.navigateByUrl(item.routePath);
    }
  }

  getIconPath(item: SidebarNavItem): string {
    return this.iconBasePath + (item.iconName ?? this.fallbackIconName);
  }

  private ensureValidActiveTab(): void {
    const items = this.visibleItems();
    const availableItemClasses = new Set(items.map((item) => item.key));

    const externalActiveClass = this.activeTabClass();
    if (externalActiveClass && availableItemClasses.has(externalActiveClass)) {
      return;
    }

    const routeActiveClass = this.routeActiveTabClass();
    if (routeActiveClass && availableItemClasses.has(routeActiveClass)) {
      this.internalActiveTabClass.set(routeActiveClass);
      return;
    }

    const internalActiveClass = this.internalActiveTabClass();
    if (internalActiveClass && availableItemClasses.has(internalActiveClass)) {
      return;
    }

    this.internalActiveTabClass.set(items[0]?.key ?? null);
  }

  private normalizeUrl(url: string): string {
    const [path] = url.split('?');
    return path || '/';
  }
}
