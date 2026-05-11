import { ApplicationConfig, ErrorHandler, inject, provideBrowserGlobalErrorListeners, provideEnvironmentInitializer } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { TranslateService, provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

import { routes } from './app.routes';
import { Theme } from './core/services/theme';
import { DroneLinkFacade } from './core/mavlink/facade/drone-link.facade';
import { GlobalErrorHandlerService } from './core/services/error/global-error-handler.service';

const SUPPORTED_LANGUAGES = ['fr', 'en'] as const;
const DEFAULT_LANGUAGE = 'fr';

function getInitialLanguage(translate: TranslateService): string {
  const browserLanguage = translate.getBrowserLang() ?? DEFAULT_LANGUAGE;
  return SUPPORTED_LANGUAGES.includes(browserLanguage as (typeof SUPPORTED_LANGUAGES)[number])
    ? browserLanguage
    : DEFAULT_LANGUAGE;
}


export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandlerService,
    },
    provideHttpClient(),
    provideTranslateService({
      fallbackLang: DEFAULT_LANGUAGE,
      lang: DEFAULT_LANGUAGE,
      loader: provideTranslateHttpLoader({
        prefix: '/assets/i18n/',
        suffix: '.json',
      }),
    }),
    provideEnvironmentInitializer(() => {
      inject(Theme).init();
      const link = inject(DroneLinkFacade);
      const translate = inject(TranslateService);
      translate.addLangs([...SUPPORTED_LANGUAGES]);
      void translate.use(getInitialLanguage(translate));
      void link.tryAutoConnect();
    }),
    provideRouter(routes)
  ]
};
