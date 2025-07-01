import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogsComponent } from '../../../assets/pg/dialogs/dialogs.component';
import { CommonModule, DatePipe, Location } from '@angular/common';
import { http, Master, NavbarActions } from '../../../assets/services/services';
import { validation } from '../../../assets/services/services';
import { HttpClient } from '@angular/common/http';
import { ActBtnComponent } from '../../../assets/pg/btn-cell-renderer/btn-cell-renderer.component';
import { ArraySortPipe } from '../../../assets/pipes/inrcrdr.pipe';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
declare var $: any;

interface ModuleObj {
  userId: number
  userName: string
  userLongName: string
  roleId: number
  userLevelID: number
  mobileNo: string
  token: string
  otp: string
  otpExpiry: string
  emailId: string
  localIP: string
  publicIP: string


}


@Component({
  selector: 'app-moduleaccess',
  templateUrl: './moduleaccess.component.html',
  styleUrls: ['./moduleaccess.component.scss'],
  imports: [FormsModule, CommonModule, NgSelectModule],
  providers: [http, HttpClient, DialogsComponent, ActBtnComponent, validation, DatePipe, Master, ArraySortPipe],
  schemas: [NO_ERRORS_SCHEMA]
})




export class ModuleaccessComponent {
  entity: any;
  reference: any = {};
  stateparams: any;
  mode: 0;
  pastentity: any = {};
  rowIndex: number;
  loading: boolean = false;
  param: any;
  ModuleaccessForm: any;
  disabledata: boolean = false;
  degignations = [];
  list: any = [];
  users = [];


  constructor(private http: http,
    private spinner: NgxSpinnerService,
    public valid: validation,
    private dialog: DialogsComponent,
    private location: Location,
    public navactions: NavbarActions,) {

  }
  ngOnInit(): void {
    this.entity = <ModuleObj>{}
    this.reference = {};

    this.degignations = [];
    this.users = [];
    this.Init();
  }
  ngAfterViewInit(): void {

  }
  Init() {
    this.loading = true;
    this.http.get('RoleInfo/list').subscribe({
      next: (res: any) => {
        if (res.status_cd == 1) {
          this.degignations = res.data;
        
          this.loading = false;
        } else {
          this.loading = false;
          this.dialog.swal({ dialog: 'error', title: 'Error', message: res.errors.exception.Message });
        }


        this.spinner.hide();
      }, error: (err: any) => {
        this.spinner.hide();
        this.dialog.swal({ dialog: 'error', title: 'Error', message: err.message });
      }
    })



    this.spinner.show();
    this.http.get('Modules/getmodules').subscribe({
      next: (res: any) => {

        this.list = res.data;
        this.disabledata = true;
        this.spinner.hide();


      }, error: (err: any) => {

        this.spinner.hide();
        this.dialog.swal({ dialog: 'error', title: 'Error', message: err });
      }
    })



  }


  user() {
    this.loading = true;
    var param = {
      roleid: this.entity.roleId

    }
    this.http.get('UserInfo/UserByRole', param).subscribe({
      next: (res: any) => {
        if (res.status_cd == 1) {
          this.users = res.data;
        
          this.loading = false;
        } else {
          this.loading = false;
          this.dialog.swal({ dialog: 'error', title: 'Error', message: res.errors.exception.Message });
        }


        this.spinner.hide();
      }, error: (err: any) => {
        this.spinner.hide();
        this.dialog.swal({ dialog: 'error', title: 'Error', message: err.message });
      }
    })
  }
  showmodules() {
    if (this.entity.userId) {
      this.spinner.show();
      this.http.get('Modules/list', { userid: this.entity.userId }).subscribe({
        next: (res: any) => {

          this.list = res.data;
          this.disabledata = false;
          this.spinner.hide();


        }, error: (err: any) => {

          this.spinner.hide();
          this.dialog.swal({ dialog: 'error', title: 'Error', message: err });
        }
      })
    }
  }

  save() {

    this.spinner.show();
    this.http.put("Modules/update", this.list, null).subscribe(

      {
        next: (res: any) => {
          if (res.status_cd == 1) {

            this.spinner.hide();
            this.dialog.swal({ dialog: "success", title: "Success", message: "Record is saved sucessfully" });

          } else {
            this.dialog.swal({ dialog: 'error', title: 'Error', message: res.errors.exception.Message })
          }
        }, error: (err: any) => {
          this.spinner.hide();
          this.dialog.swal({ dialog: 'error', title: 'Error', message: err.message });
        }

      })
  }


  close() {
    this.location.back();
  }

}

