import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

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

  readonly disconnectedItems: ReadonlyArray<SidebarNavItem> = [
    {
      key: 'tab_landing',
      id: 'tab_landing',
      translationKey: 'tabLanding',
      label: 'Bienvenue',
      iconName: 'compass-outline.svg',
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
      key: 'tab_options',
      id: 'tab_options',
      translationKey: 'tabOptions',
      label: 'Options',
      iconName: 'chipset.svg'
    },
    {
      key: 'tab_firmware_flasher',
      id: 'tabFirmware',
      translationKey: 'tabFirmwareFlasher',
      label: 'Flasher le Firmware',
      iconName: 'usb-cable.svg'
    }
  ];

  readonly connectedItems: ReadonlyArray<SidebarNavItem> = [
    { key: 'tab_dashboard', translationKey: 'tabDashboard', label: 'Dashboard', iconName: 'view-dashboard-outline.svg', routePath: '/dashboard' },
    { key: 'tab_connection', translationKey: 'tabConnection', label: 'Connection', iconName: 'ports.svg', routePath: '/connection' },
    { key: 'tab_configuration', translationKey: 'tabConfiguration', label: 'Configuration', iconName: 'config.svg', routePath: '/configuration' },
    { key: 'tab_power', translationKey: 'tabPower', label: 'Power', iconName: 'power.svg', routePath: '/power' },
    { key: 'tab_receiver', translationKey: 'tabReceiver', label: 'Receiver', iconName: 'rx.svg', routePath: '/receiver' },
    { key: 'tab_model_editor', translationKey: 'tabModelEditor', label: 'Model Editor', iconName: 'rotate-orbit.svg', routePath: '/model-editor' },
    { key: 'tab_motors', translationKey: 'tabMotorTesting', label: 'Test Moteurs', iconName: 'rotate-orbit.svg', routePath: '/motors' },
    { key: 'tab_failsafe', translationKey: 'tabFailsafe', label: 'Failsafe', iconName: 'parachute.svg', routePath: '/failsafe' },
    { key: 'tab_pid_tuning', translationKey: 'tabPidTuning', label: 'PID Tuning', iconName: 'pid.svg', routePath: '/pid-tuning' },
    { key: 'tab_modes', translationKey: 'tabModes', label: 'Modes', iconName: 'modes.svg', routePath: '/modes' },
    { key: 'tab_servos', translationKey: 'tabServos', label: 'Servos', iconName: 'rotate-orbit.svg' },
    { key: 'tab_gps', translationKey: 'tabGPS', label: 'GPS', iconName: 'gps.svg', routePath: '/gps' },
    { key: 'tab_osd', translationKey: 'tabOsd', label: 'OSD', iconName: 'satellite-variant.svg', routePath: '/osd' },
    { key: 'tab_vtx', translationKey: 'tabVtx', label: 'VTX', iconName: 'satellite-variant.svg' },
    { key: 'tab_transponder', translationKey: 'tabTransponder', label: 'Transponder', iconName: 'satellite-variant.svg' },
    { key: 'tab_led_strip', translationKey: 'tabLedStrip', label: 'LED Strip', iconName: 'led.svg', routePath: '/led-strip' },
    { key: 'tab_onboard-logging', translationKey: 'tabOnboardLogging', label: 'BlackBox', iconName: 'data-ship.svg', routePath: '/blackbox' },
    { key: 'tab_rtl', translationKey: 'tabRtl', label: 'RTL', iconName: 'satellite-variant.svg', routePath: '/rtl' }
  ];

  readonly visibleItems = computed((): ReadonlyArray<SidebarNavItem> =>
    this.mode() === 'connected' ? this.connectedItems : this.disconnectedItems
  );

  private readonly currentActiveTabClass = computed(() =>
    this.activeTabClass() ?? this.internalActiveTabClass()
  );

  constructor() {
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

    const internalActiveClass = this.internalActiveTabClass();
    if (internalActiveClass && availableItemClasses.has(internalActiveClass)) {
      return;
    }

    this.internalActiveTabClass.set(items[0]?.key ?? null);
  }
}
