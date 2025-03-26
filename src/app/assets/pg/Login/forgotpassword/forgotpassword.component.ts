import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogsComponent } from '../../../../assets/pg/dialogs/dialogs.component';
import { MyProvider } from '../../../../assets/services/provider';
import { CommonModule, DatePipe, Location } from '@angular/common';
import { http, Master, NavbarActions, validation } from '../../../../assets/services/services';

import { FormsModule, NgForm } from '@angular/forms';
import { ArraySortPipe } from '../../../pipes/inrcrdr.pipe';

declare var $: any;
// interface resetpsw {
//   username:string
// }
@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.scss'],
  imports: [FormsModule, CommonModule],
  providers: [DialogsComponent, validation, Master,ArraySortPipe, DatePipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ForgotpasswordComponent {
  @ViewChild('Resetpswform') Resetpswform: NgForm;
  entity: any;
  reference: any = {};
  pastentity: any = {};
  constructor(private http: http,
    private spinner: NgxSpinnerService,
    private navaction: NavbarActions,
    private provider: MyProvider,
    public valid: validation,
    private dialog: DialogsComponent,
    private location: Location,
    private router: Router,
    private Master: Master,
    public navactions: NavbarActions,) {

  }

  ngOnInit(): void {
    this.entity = {};

  }
  async Submit() {
    if (this.Resetpswform.valid) {
      this.spinner.show();
      var param = {
        id: this.entity.username
      }
      this.http.get("login/setforgotPassword", param).subscribe({
        next: (response: any) => {
          if (response.status_cd == 1) {
            this.dialog.swal({ dialog: "success", title: "Success", message: "Password Changed sucessfully.. Please Check your E-Mail" });

            this.router.navigate(['login']);

            this.spinner.hide();
          } else {
            this.spinner.hide();
            this.dialog.swal({ dialog: "error", title: 'Error', message: "Invalid Username or Mobile No Or Email" })
          }
        }, error: (error: any) => {
          this.spinner.hide();
          this.dialog.swal({ dialog: "error", title: 'Error', message: "Something Went wrong.." })
        }

      })
    }
    else
      this.dialog.swal({ dialog: "error", title: 'Error', message: "Please enter your username and password" })



  }

}
