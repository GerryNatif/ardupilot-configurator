import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';

import { SidebarNavigation } from './sidebar-navigation';

@Component({
  template: '',
})
class DummyRouteComponent {}

describe('SidebarNavigation', () => {
  let component: SidebarNavigation;
  let fixture: ComponentFixture<SidebarNavigation>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarNavigation],
      providers: [
        provideRouter([
          { path: 'configuration', component: DummyRouteComponent },
          { path: 'power', component: DummyRouteComponent },
          { path: 'help', component: DummyRouteComponent },
        ]),
        provideTranslateService({
          fallbackLang: 'en',
          lang: 'en',
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarNavigation);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should follow router navigation for active tab in connected mode', async () => {
    fixture.componentRef.setInput('mode', 'connected');
    await router.navigateByUrl('/power');
    fixture.detectChanges();

    const activeItem = component.connectedItems.find((item) => item.routePath === '/power');
    expect(activeItem).toBeTruthy();
    expect(component.isActive(activeItem!)).toBe(true);
  });
});
