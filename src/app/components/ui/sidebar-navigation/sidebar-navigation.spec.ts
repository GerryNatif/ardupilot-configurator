import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';

import { SidebarNavigation } from './sidebar-navigation';

describe('SidebarNavigation', () => {
  let component: SidebarNavigation;
  let fixture: ComponentFixture<SidebarNavigation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarNavigation],
      providers: [
        provideTranslateService({
          fallbackLang: 'en',
          lang: 'en',
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarNavigation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
