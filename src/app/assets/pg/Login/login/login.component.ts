import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner'; 
import { MyProvider } from '../../../../assets/services/provider';
import { CommonModule, DatePipe, Location } from '@angular/common';
import { http, Master, NavbarActions } from '../../../../assets/services/services'; 
import { FormsModule, NgForm } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../../../../assets/services/auth.service';

declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
    imports:[FormsModule,CommonModule],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
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

  constructor(private http: http,
    private spinner: NgxSpinnerService,
    private provider: MyProvider,
    // private dialog: DialogsComponent,
    private router: Router,
    //private _cacheService: CacheService,
    public navactions: NavbarActions,
    private authService: AuthService,) {

  }


  getfn() {
    this.passwordVisible == true ? 'text' : 'password';
  }
  logfun() {
    this.router.navigate(['/home']);
  }

  ngOnInit(): void {

    this.reference = {};

  } 
  async Submit() {
    this.router.navigate(['selectfirm']);
  }
  setforgotpassword() {


    this.router.navigate(['forgotpassword']);

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

