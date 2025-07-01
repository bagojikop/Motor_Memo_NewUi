import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogsComponent } from '../../../assets/pg/dialogs/dialogs.component';
import { MyProvider } from '../../../assets/services/provider';
import { DatePipe} from '@angular/common';
import { http, Master, NavbarActions } from '../../../assets/services/services';
import { HttpClient } from '@angular/common/http';
import { ActBtnComponent } from '../../../assets/pg/btn-cell-renderer/btn-cell-renderer.component';
import { DssGridComponent } from '../../../assets/pg/dss-grid/dss-grid.component';
import { ArraySortPipe } from '../../../assets/pipes/inrcrdr.pipe';

declare var $: any;


interface BalanceForwardObj {

}

@Component({
  selector: 'app-balanceforward',
  templateUrl: './balanceforward.component.html',
  styleUrls: ['./balanceforward.component.scss'],
    imports:[],
  providers:[http,HttpClient,DssGridComponent,DialogsComponent,ArraySortPipe, DatePipe,Master, ActBtnComponent, DssGridComponent],
  schemas:[NO_ERRORS_SCHEMA]
})
export class BalanceforwardComponent {

  entity: any;
  reference: any = {};
  DayEndForm: any;
  rowIndex: number;
  loading: boolean = false;
  param: any;
  disabledata: boolean = false;
  isChecked: boolean = false;
  firms = [];
  constructor(private http: http,
    private spinner: NgxSpinnerService,
    private provider: MyProvider,
    private dialog: DialogsComponent,
    public navactions: NavbarActions,) {

  }

  ngOnInit(): void {
    this.entity = <BalanceForwardObj>{}
    this.reference = {};

    this.entity.finyear = this.provider.companyinfo.company.divId;

  }
 
  
  check() {

    if (this.entity.account == true) {

      var params = {
        firmcode: this.entity.firmCode,
        branchcode: this.entity.branchCode,
        divid: this.entity.finyear,
        user: this.provider.companyinfo.userinfo.username



      }

      this.http.get('BalanceForward/accOpeningbalanceForward', params).subscribe({
        next: (res: any) => {
          if (res.status_cd == 1) {
            this.dialog.swal({ dialog: "success", title: "Success", message: "Balance Forward  Sucessfully" });
          } else {
            this.dialog.swal({ dialog: 'error', title: 'Error', message: res.errors.exception.Message });
          }
          this.spinner.hide();
        }, error: (err: any) => {
          this.spinner.hide();
          this.dialog.swal({ dialog: 'error', title: 'Error', message: err.message });
        }
      })

    }


  }

  check1() {
    if (this.entity.inventory) {
      var params = {
        firmcode: this.entity.firmCode,
        branchcode: this.entity.branchCode,
        divid: this.entity.finyear,
        user: this.provider.companyinfo.userinfo.username,
        mrp: ''


      }

      this.http.get('BalanceForward/bomOpeningbalForward', params).subscribe({
        next: (res: any) => {
          if (res.status_cd == 1) {
            this.dialog.swal({ dialog: "success", title: "Success", message: "Balance Forward  Sucessfully" });
          } else {
            this.dialog.swal({ dialog: 'error', title: 'Error', message: res.errors.exception.Message });
          }
          this.spinner.hide();
        }, error: (err: any) => {
          this.spinner.hide();
          this.dialog.swal({ dialog: 'error', title: 'Error', message: err.message });
        }
      })

    }


  }

}
