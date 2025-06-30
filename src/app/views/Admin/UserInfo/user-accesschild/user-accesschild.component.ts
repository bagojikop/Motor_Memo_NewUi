import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogsComponent } from '../../../../assets/pg/dialogs/dialogs.component';
import { MyProvider } from '../../../../assets/services/provider';
import { CommonModule, DatePipe, Location } from '@angular/common';
import { http, Master, NavbarActions, UserPermissions } from '../../../../assets/services/services';
import { validation } from '../../../../assets/services/services';
import { FormsModule } from '@angular/forms';
import { ArraySortPipe } from '../../../../assets/pipes/inrcrdr.pipe';


declare var $: any;

interface userAccessObj {
  userId: number
  a: number
  e: number
  d: number
  l: number
  p: number
  sysAdmin: number
  o: number
  j: number
  eAdmin: number
  userInfo: userInfo
}

interface userInfo {
  userId: number
  userName: string
  userLongName: string

}
@Component({
  selector: 'app-user-accesschild',
  templateUrl: './user-accesschild.component.html',
  styleUrls: ['./user-accesschild.component.scss'],
  imports: [FormsModule, CommonModule],
  providers: [DialogsComponent, validation, DatePipe, Master, ArraySortPipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class UserAccesschildComponent {
  entity: any;
  reference: any = {};
  stateparams: any;
  mode: 0;
  pastentity: any = {};
  rowIndex: number;
  loading: boolean = false;
  param: any;
  roleAccessForm: any;
  list = [];
  userinfo: userInfo[];

  userAccess = inject(UserPermissions);
  constructor(private http: http,
    private spinner: NgxSpinnerService,
    private navaction: NavbarActions,
    private provider: MyProvider,
    public valid: validation,
    private datepipe: DatePipe,
    private dialog: DialogsComponent,
    private location: Location,
    private router: Router,
    private Master: Master,
    public navactions: NavbarActions,) {

  }

  ngOnInit(): void {
    this.list = [];
 
    this.Init();

  }
  ngAfterViewInit(): void {

  }
  Init() {
    this.spinner.show();
    this.http.get('UserAuth/list').subscribe({
      next: (res: any) => {
        this.list = res.data;
        this.spinner.hide();
      }, error: (err: any) => {
        this.spinner.hide();
        this.dialog.swal({ dialog: 'error', title: 'Error', message: err });
      }
    })

  }


  changeMode(event) {
    return event == true ? 1 : 0;
  }

  save() {
    this.spinner.show();
    this.http.post('UserAuth/insert', this.list).subscribe({

      next: (res: any) => {
        if (res.status_cd == 1) {

          var x = this.userAccess.getInfo();
          var b = res.data.filter(s => s.user.userId == x.user_id)[0];
          x.a = b.a;
          x.e = b.e;
          x.o = b.o;
          x.d = b.d;
          x.p = b.p;

          this.userAccess.setInfo(x);
          this.dialog.swal({ dialog: "success", title: "Success", message: "Record is saved sucessfully" });
        }
        this.spinner.hide()

      }, error: (err: any) => {
        this.spinner.hide()
        this.dialog.swal({ dialog: 'error', title: 'Error', message: err })
      }
    })

  }


  close() {
    this.location.back();
  }
}
