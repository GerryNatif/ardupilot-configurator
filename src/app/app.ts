import { Component, HostListener, computed, effect, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { TranslatePipe } from '@ngx-translate/core';

import { Header as HeaderComponent } from './components/ui/header/header';
import { SidebarNavigation as SidebarNavigationComponent } from './components/ui/sidebar-navigation/sidebar-navigation';
import { FooterBar as FooterBarComponent } from './components/ui/footer-bar/footer-bar';
import { SaveBtn } from './components/ui/save-btn/save-btn';
import { DroneLinkFacade } from './core/mavlink/facade/drone-link.facade';
import { Theme } from './core/services/theme';
import { UiErrorService } from './core/services/error/ui-error.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    HeaderComponent, 
    SidebarNavigationComponent, 
    FooterBarComponent,
    SaveBtn,
    TranslatePipe,
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  protected readonly title = signal('ardupilot-configurator');
  private readonly theme = inject(Theme);
  private readonly link = inject(DroneLinkFacade);
  private readonly router = inject(Router);
  private readonly uiError = inject(UiErrorService);

  readonly sidebarMode = computed(() => this.link.isConnected() ? 'connected' : 'disconnected');
  readonly errorDialog = this.uiError.state;
  isSidebarRevealed = false;

  constructor() {
    effect(() => {
      const kind = this.link.vehicleIdentity().vehicleKind;
      this.theme.applyVehicleTheme(kind);
    });

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        if (window.innerWidth <= 575) {
          this.closeSidebar();
        }
      });
  }

  toggleSidebar(): void {
    this.isSidebarRevealed = !this.isSidebarRevealed;
  }

  closeSidebar(): void {
    this.isSidebarRevealed = false;
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    if (window.innerWidth > 575) {
      this.closeSidebar();
    }
  }

  closeErrorDialog(): void {
    this.uiError.close();
  }
}
