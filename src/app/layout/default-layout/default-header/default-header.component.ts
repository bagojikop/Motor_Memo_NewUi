import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, inject, Input, input } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MyProvider } from '../../../assets/services/provider';

import { 
  ColorModeService,
  ContainerComponent, 
  HeaderComponent,
  HeaderNavComponent,
  HeaderTogglerDirective, 
  NavLinkDirective,
  SidebarToggleDirective
} from '@coreui/angular';

import { IconDirective } from '@coreui/icons-angular';
import { ngselectComponent } from '../../../assets/pg/ngselect/ngselect.component';

@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
  imports: [ContainerComponent, HeaderTogglerDirective, SidebarToggleDirective, IconDirective, HeaderNavComponent, NavLinkDirective],
  providers: [ngselectComponent]
})
export class DefaultHeaderComponent extends HeaderComponent {
  private router = inject(Router);
  public provider = inject(MyProvider);
 
  @Input() sidebarId: string = 'sidebar1';
  readonly #colorModeService = inject(ColorModeService);
  readonly colorMode = this.#colorModeService.colorMode;
  
  entity: any = {};

  constructor() {
    super();
  }
 
  logout() {
    this.router.navigate(['login'])
  }
}
