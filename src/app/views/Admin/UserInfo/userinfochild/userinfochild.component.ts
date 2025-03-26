import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogsComponent } from '../../../../assets/pg/dialogs/dialogs.component';
import { MyProvider } from '../../../../assets/services/provider';
import { CommonModule, DatePipe, Location } from '@angular/common';
import { http, Master, NavbarActions } from '../../../../assets/services/services';
import { validation } from '../../../../assets/services/services';
import { FormsModule, NgForm } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { DssInputComponent } from '../../../../assets/mydirective/dss-input/dss-input.component';
import { MydirectiveModule } from '../../../../assets/mydirective/mydirective.module';
import { MasternavComponent } from '../../../../assets/pg/masternav/masternav.component';
import { ngselectComponent } from '../../../../assets/pg/ngselect/ngselect.component';
import { NavbarComponent } from '@coreui/angular';
import { NavactionsComponent } from '../../../../assets/pg/navactions/navactions.component';
declare var $: any;

interface UserObj {
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
  credential: credential

}
interface credential {

  userId: number
  password: string

}
@Component({
  selector: 'app-userinfochild',
  templateUrl: './userinfochild.component.html',
  styleUrls: ['./userinfochild.component.scss'],
  imports: [FormsModule, CommonModule, NgSelectModule, DssInputComponent, MydirectiveModule, NavactionsComponent],
  providers: [NavbarActions],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class UserinfochildComponent {

  @ViewChild('UserInfoForm') UserInfoForm: NgForm;
  entity: any;
  reference: any = {};
  stateparams: any;
  mode: 0;
  pastentity: any = {};
  rowIndex: number;
  loading: boolean = false;
  param: any
  disabledata: boolean = false;
  degignations = [];
  users = [];
  pswType = "password";
  resetPassword: boolean;

  isChecked: boolean = false;
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
    this.entity = <UserObj>{};
    this.reference = {};
    let paramss: any = this.location.getState();
    this.navactions.navaction(paramss.action);
    this.entity.userId = paramss.id;
    this.resetPassword = false;
    this.degignations = [];
    this.users = [];
    if (this.entity.userId) {
      this.navactions.fieldset = true;
      this.callbackedit();
    } else {
      this.navactions.fieldset = false;
      this.newRecord();
    }

    if (paramss.id) {
      this.callbackEdit();
    };



    this.Init();
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





  }



  navbar(event) {

    switch (event) {
      case 'new':
        this.newRecord();
        break;

      case 'save':
        this.save()
        break;

      case 'edit':
        this.edit()
        break;

      case 'undo':
        this.undo()
        break;

      case 'print':
        this.print();
        break;


      case 'close':
        this.close()
        break;



    }
  }


  edit() {
    this.navactions.navaction("view");
  }

  print() { }
  callbackedit() {

    var url = "UserInfo/getuserinfo"
    var param = {
      userid: this.entity.userId,
    }
    this.http.get(url, param).subscribe({
      next: (res: any) => {
        if (res.status_cd == 1) {
          this.entity = res.data;

          this.pastentity = Object.assign({}, res.data);
          this.navaction.navaction('OK');
        }
      }, error: (err: any) => {
        this.spinner.hide();
        this.dialog.swal({ dialog: 'error', title: 'Error', message: err });
      }
    })
  }




  save() {

    if (this.UserInfoForm.valid) {
      this.spinner.show();
      var params = {
        user: this.entity,
        psw: this.entity.credential ? this.entity.credential.password : '',
      }

      this.http.post('User/insert', params).subscribe({
        next: (res: any) => {
          if (res.status_cd == 1) {
            this.entity.userId = res.data.userId;
            this.resetPassword = false;
            this.dialog.swal({ dialog: "success", title: "Success", message: "Record is saved sucessfully " });
          }
          this.spinner.hide()
        }, error: (err: any) => {
          this.spinner.hide()
          this.dialog.swal({ dialog: 'error', title: 'Error', message: err })
        }
      })
    }
    else
      this.navactions.navaction('new');
    this.dialog.swal({ dialog: 'Warning', title: 'Warning!', message: "Please fill all required Fields..." })
  }

  callbackEdit() {

  }
  states = [];

  newRecord() {
    this.entity = <UserObj>{};
    this.entity.credential = <credential>{};
    this.disabledata = false;
    this.reference = {};
    // let paramss: any = this.location.getState();
    // this.entity.divId = paramss.id;
  }


  changetype() {
    this.pswType = this.pswType == "password" ? "text" : "password";
  }

  genratepsw() {

    var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOP1234567890";
    this.entity.credential.password = "";
    for (var x = 0; x < 8; x++) {
      var i = Math.floor(Math.random() * chars.length);
      this.entity.credential.password += chars.charAt(i);
    }


  }

  resetpsw() {
    this.resetPassword = true;
  }

  disablePsw() {
    if (this.entity.userId) {
      if (this.resetPassword)
        return false;
      else
        return true
    }
    else
      return false;
  }


  mainedit() {
    this.navactions.navaction("view");
    this.navactions.save1 = false;
    this.navactions.print1 = true;
    this.navactions.fieldset = false;

  }
  undo() {
    this.entity = this.pastentity;
  }
  close() {
    this.location.back();
  }


  check() {


  }
}


