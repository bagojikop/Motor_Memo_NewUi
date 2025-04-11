import { AfterViewInit, Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NgScrollbar } from 'ngx-scrollbar';
import {UserPermissions} from '../../../app/assets/services/services';
import { IconDirective } from '@coreui/icons-angular';
import {
  ContainerComponent,
  ShadowOnScrollDirective,
  SidebarBrandComponent,
  SidebarComponent,
  SidebarFooterComponent,
  SidebarHeaderComponent,
  SidebarNavComponent,
  SidebarToggleDirective,
  SidebarTogglerDirective
} from '@coreui/angular';

import { DefaultFooterComponent, DefaultHeaderComponent } from './';
import { navItems } from './_nav';

function isOverflown(element: HTMLElement) {
  return (
    element.scrollHeight > element.clientHeight ||
    element.scrollWidth > element.clientWidth
  );
}

@Component({
    selector: 'app-dashboard',
    templateUrl: './default-layout.component.html',
    styleUrls: ['./default-layout.component.scss'],
    imports: [
        SidebarComponent,
        SidebarHeaderComponent,
        SidebarBrandComponent,
        RouterLink,
        
        NgScrollbar,
        SidebarNavComponent,
        SidebarFooterComponent,
        SidebarToggleDirective,
        SidebarTogglerDirective,
        DefaultHeaderComponent,
        ShadowOnScrollDirective,
        
        RouterOutlet,
        DefaultFooterComponent
    ],
    providers:[ContainerComponent,IconDirective]
})
export class DefaultLayoutComponent implements AfterViewInit {
  navItems:any=[];

    private userPermission = inject(UserPermissions);

    ngAfterViewInit(): void {

        var x = this.userPermission.getInfo();


        let Finance = x.modules.filter(m => m.moduleId === 1)[0]?.moduleId;
        let Master = x.modules.filter(m => m.moduleId === 2)[0]?.moduleId;
        let motorMemo = x.modules.filter(m => m.moduleId === 3)[0]?.moduleId;
        let admin = x.modules.filter(m => m.moduleId === 4)[0]?.moduleId;

        
        
          this.navItems = navItems({
            isFinanceDisabled:Finance !=1 || false,
            isMasterDisabled: Master !=2 || false,
            isMotorMemoDisabled: motorMemo !=3 || false,
            isAdminDisabled: admin !=4 || false,
            
          });
        
     
    }

  onScrollbarUpdate($event: any) {
    // if ($event.verticalUsed) {
    // console.log('verticalUsed', $event.verticalUsed);
    // }
  }
}
