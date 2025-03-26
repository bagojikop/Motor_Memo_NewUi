import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  provideRouter,
  RouterLink,
  RouterLinkActive,
  withEnabledBlockingInitialNavigation,
  withHashLocation,
  withInMemoryScrolling,
  withRouterConfig,
  withViewTransitions
} from '@angular/router';

import { AvatarComponent, BadgeComponent, DropdownComponent, DropdownDividerDirective, DropdownItemDirective, DropdownModule, SidebarModule } from '@coreui/angular';
import { IconSetService } from '@coreui/icons-angular';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { DssInputComponent } from './assets/mydirective/dss-input/dss-input.component';
import { decimalDirective, DTFormatDirective, noWhiteSpaceDirective, NumberOnlyDirective, PercentDirective } from './assets/mydirective/mydirective.directive';
import { UserPermissions } from './assets/services/services';
 
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideRouter(routes,
      withRouterConfig({
        onSameUrlNavigation: 'reload'
      }),
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled'
      }),
      withEnabledBlockingInitialNavigation(),
      withViewTransitions(),
      // withHashLocation(),
     
    ),
    DropdownDividerDirective,
    DssInputComponent,
    BadgeComponent,
    DropdownComponent,
    DropdownDividerDirective,
    DropdownItemDirective,
    AvatarComponent,
    decimalDirective,
    UserPermissions,
    NumberOnlyDirective,
    DTFormatDirective,
    noWhiteSpaceDirective,
    PercentDirective,
    RouterLink, RouterLinkActive,
    importProvidersFrom(SidebarModule, DropdownModule),
    IconSetService,
    provideAnimationsAsync()
  ]
};
