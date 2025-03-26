import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { MyProvider } from '../../../../assets/services/provider';
import { CommonModule, DatePipe, Location } from '@angular/common';
import { http, Master, NavbarActions, UserPermissions } from '../../../../assets/services/services';
import { FormsModule, NgForm } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../../../../assets/services/auth.service';
import { DialogsComponent } from '../../../pg/dialogs/dialogs.component';

declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [FormsModule, CommonModule],
  providers:[DialogsComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LoginComponent implements OnInit {

  @ViewChild('loginform') Loginform: NgForm;
  public otp = new BehaviorSubject<any>({});
  entity: any = {};
  reference: any = {};

  stateparams: any;
  mode: 0;
  pastentity: any = {};
  rowIndex: number;
  loading: boolean = false;
  param: any
  passwordVisible: boolean = false; // To toggle password visibility

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  userAccessCtrl = inject(UserPermissions);

  constructor(private http: http,
    private spinner: NgxSpinnerService,
    private provider: MyProvider,
    private router: Router,
    private dialog: DialogsComponent,
    public navactions: NavbarActions,
    private authService: AuthService,) {

  }


  getfn() {
    this.passwordVisible == true ? 'text' : 'password';
  }
  Submit() {
    if (this.Loginform.valid) {
      this.spinner.show();

      this.http.get("login/usergrants", this.entity).subscribe({
        next: (res) => {
          if (res.status_cd == 1) {
            this.userAccessCtrl.setInfo(res.data);
            this.router.navigate(['selectfirm']);
          } else {
          this.dialog.swal({ dialog: 'error', title: 'Error', message: "Plese Check Username and Password" });
          }
        }, error: err => {
          this.dialog.swal({ dialog: 'error', title: 'Error', message: err.message });
 
        }, complete: () => {
          this.spinner.hide();
        }
      })
    }else{
      this.dialog.swal({ dialog: 'Warning', title: 'Error', message: "Plese Enter Username and Password" });
      
    }
  }

  ngOnInit(): void {
    this.reference = {};
  } 

  setforgotpassword() {
    this.router.navigate(['Forgotpassword']);
  }


  SendOTP(obj) {
    this.http.put('token/SendOTP', null, { username: obj.username }).subscribe({
      next: (res: any) => {
        var params = { name: obj }
        this.router.navigate(['otpverification'], { state: params });
      }, error: (err: any) => {
        this.spinner.hide()
      }
    })
  };
}

