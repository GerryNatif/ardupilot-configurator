import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { filter } from 'rxjs/operators';
import { DroneLinkFacade } from '../../../core/mavlink/facade/drone-link.facade';
import { UiErrorService } from '../../../core/error/ui-error.service';
import { AppError } from '../../../core/error/app-error';

type SidebarMode = 'disconnected' | 'connected';
type VehicleType = 'copter' | 'plane' | 'rover' | 'boat' | 'sub' | 'station';

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
  imports: [TranslatePipe, FormsModule],
  templateUrl: './sidebar-navigation.html',
  styleUrls: ['./sidebar-navigation.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarNavigation {
  private readonly router = inject(Router);
  private readonly link = inject(DroneLinkFacade);
  private readonly uiError = inject(UiErrorService);

  readonly mode = input<SidebarMode>('disconnected');
  readonly activeTabClass = input<string | null>(null);

  readonly iconBasePath = '/assets/icons/';
  readonly fallbackIconName = 'rotate-orbit.svg';

  readonly logoPaths: Record<VehicleType | 'default', string> = {
    default: '/assets/logos/ardupilot-logo.svg',
    copter: '/assets/logos/arducopter-logo.svg',
    plane: '/assets/logos/arduplane-logo.svg',
    rover: '/assets/logos/ardurover-logo.svg',
    boat: '/assets/logos/arduboat-logo.svg',
    sub: '/assets/logos/ardusub-logo.svg',
    station: '/assets/logos/ardustation-logo.svg',
  };

  selectedBaud: string;

  readonly vehicleIdentity = this.link.vehicleIdentity;
  readonly isConnected = this.link.isConnected;
  // ⚠️ 'error' n'est PAS un lien actif : sinon le bouton propose « Déconnecter »
  // sur un port qui n'a jamais été ouvert (deferred-work, revue sidebar 2026-05-30).
  readonly isLinkActive = computed(() => {
    const status = this.link.linkStatus();
    return status !== 'disconnected' && status !== 'error';
  });
  readonly isConnecting = computed(() => this.link.linkStatus() === 'connecting');
  readonly connectionLabel = computed(() => (this.isLinkActive() ? 'Déconnecter' : 'Connexion'));
  readonly detectedFirmware = computed(() => this.vehicleIdentity().firmwareFamily);
  readonly detectedVersion = computed(() => this.vehicleIdentity().version.text);

  readonly logoPath = computed(() => {
    const vehicle = this.vehicleIdentity().vehicleKind as VehicleType | undefined;
    return this.logoPaths[vehicle ?? 'default'] ?? this.logoPaths['default'];
  });

  private readonly internalActiveTabClass = signal<string | null>(null);
  private readonly currentUrl = signal(this.normalizeUrl(this.router.url));

  readonly disconnectedItems: ReadonlyArray<SidebarNavItem> = [
    {
      key: 'tab_landing',
      id: 'tab_landing',
      translationKey: 'tabLanding',
      label: 'Bienvenue',
      iconName: 'home-close.svg',
      routePath: '/',
    },
    {
      key: 'tab_help',
      id: 'tab_help',
      translationKey: 'tabHelp',
      label: 'Manuels & Aide',
      iconName: 'help.svg',
      routePath: '/help',
    },
  ];

  readonly connectedItems: ReadonlyArray<SidebarNavItem> = [
    { key: 'tab_configuration', translationKey: 'tabConfiguration', label: 'Configuration', iconName: 'config.svg', routePath: '/configuration' },
    { key: 'tab_power', translationKey: 'tabPower', label: 'Power', iconName: 'power.svg', routePath: '/power' },
    { key: 'tab_receiver', translationKey: 'tabReceiver', label: 'Receiver', iconName: 'rx.svg', routePath: '/receiver' },
    { key: 'tab_modes', translationKey: 'tabModes', label: 'Modes', iconName: 'modes.svg', routePath: '/modes' },
    { key: 'tab_model_editor', translationKey: 'tabModelEditor', label: 'Éditeur de Modèle', iconName: 'rotate-orbit.svg', routePath: '/model-editor' },
    { key: 'tab_motors', translationKey: 'tabMotor', label: 'Moteur/Servo', iconName: 'motor.svg', routePath: '/motors' },
    { key: 'tab_failsafe', translationKey: 'tabFailsafe', label: 'Failsafe', iconName: 'parachute.svg', routePath: '/failsafe' },
    { key: 'tab_rtl', translationKey: 'tabRtl', label: 'RTL', iconName: 'satellite-variant.svg', routePath: '/rtl' },
  ];

  readonly visibleItems = computed((): ReadonlyArray<SidebarNavItem> =>
    this.mode() === 'connected' ? this.connectedItems : this.disconnectedItems
  );

  private readonly routeActiveTabClass = computed(() => {
    const currentUrl = this.currentUrl();
    const matchingItem = this.visibleItems().find((item) => item.routePath === currentUrl);
    return matchingItem?.key ?? null;
  });

  private readonly currentActiveTabClass = computed(
    () => this.activeTabClass() ?? this.routeActiveTabClass() ?? this.internalActiveTabClass()
  );

  constructor() {
    this.selectedBaud = String(this.link.getLastBaudRate());

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

  getNamedIconPath(name: string): string {
    return this.iconBasePath + name;
  }

  async onConnectionToggle(event: Event): Promise<void> {
    event.preventDefault();
    const wasConnected = this.isLinkActive();

    try {
      if (wasConnected) {
        await this.link.disconnect();
      } else {
        await this.link.connect(Number(this.selectedBaud));
      }
    } catch (error) {
      if (!wasConnected && this.isUserCancelledPortSelection(error)) {
        return;
      }

      if (!wasConnected && this.isSerialPortOpenError(error)) {
        this.uiError.show(
          new AppError('errors.transport.port_open_failed', {
            reason: this.extractErrorMessage(error),
          }),
          'errors.titles.connect_failed'
        );
        return;
      }

      this.uiError.show(
        error,
        wasConnected ? 'errors.titles.disconnect_failed' : 'errors.titles.connect_failed'
      );
    }
  }

  private isUserCancelledPortSelection(error: unknown): boolean {
    const message = this.extractErrorMessage(error).toLowerCase();
    return (
      message.includes("failed to execute 'requestport' on 'serial'") &&
      message.includes('no port selected')
    );
  }

  private isSerialPortOpenError(error: unknown): boolean {
    const message = this.extractErrorMessage(error).toLowerCase();
    return (
      message.includes('failed to open serial port') ||
      message.includes("failed to execute 'open' on 'serialport'")
    );
  }

  private extractErrorMessage(error: unknown): string {
    if (error instanceof Error && typeof error.message === 'string') {
      return error.message;
    }
    return String(error);
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
