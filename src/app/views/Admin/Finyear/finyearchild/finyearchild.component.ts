import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogsComponent } from '../../../../assets/pg/dialogs/dialogs.component';
import { MyProvider } from '../../../../assets/services/provider';
import { CommonModule, DatePipe, Location } from '@angular/common';
import { http, Master, NavbarActions } from '../../../../assets/services/services';
import { validation } from '../../../../assets/services/services';
import { FinYearObj } from '../../../../assets/datatypests/finyear';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { DssInputComponent } from '../../../../assets/mydirective/dss-input/dss-input.component';
import { MydirectiveModule } from '../../../../assets/mydirective/mydirective.module';
import { ngselectComponent } from '../../../../assets/pg/ngselect/ngselect.component';
import { NavactionsComponent } from '../../../../assets/pg/navactions/navactions.component';

declare var $: any;

@Component({
  selector: 'app-finyearchild',
  templateUrl: './finyearchild.component.html',
  styleUrls: ['./finyearchild.component.scss'],
  imports: [FormsModule, CommonModule, NgSelectModule, DssInputComponent, MydirectiveModule, NavactionsComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [ngselectComponent]
})
export class FinyearchildComponent {
  entity: any;
  reference: any = {};
  stateparams: any;
  mode: 0;
  pastentity: any = {};
  rowIndex: number;
  loading: boolean = false;
  param: any;
  FinYearForm: any;
  disabledata: boolean = false;
  firms = [];
  branches = [];
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
    this.entity = <FinYearObj>{}
    this.reference = {};
    let paramss: any = this.location.getState();
    this.navactions.navaction(paramss.action);
    this.entity.divId = paramss.id;
    this.entity.firmCode = paramss.firmCode;
    this.entity.branchCode = paramss.branchCode;

    this.firms = [];
    this.branches = [];
    if (this.entity.divId) {
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

    var params = {
      currentPage: 1,
      pageSize: 10,
      keys: []
    }

    this.http.post('Firm/getList', params).subscribe({
      next: (res: any) => {
        if (res.status_cd == 1) {
          this.firms = res.data;
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

  branch() {
    this.loading = true;
    var param = {
      firmCode: this.entity.firmCode

    }
    this.http.get('Branch/branchbyFirm', param).subscribe({
      next: (res: any) => {
        if (res.status_cd == 1) {
          this.branches = res.data;
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

    var url = "FinYears/get"
    var paramss = {
      divId: this.entity.divId,
      firmCode: this.entity.firmCode,

    }
    this.http.get(url, paramss).subscribe({
      next: (res: any) => {
        if (res.status_cd == 1) {
          this.entity = res.data;
          // this.branch();
          this.isChecked = this.entity.isPrevYr == 1 ? true : false;


          this.disabledata = true;

          // this.entity.fdt = this.datepipe.transform(this.entity.fdt, 'yyyy-dd-MM');
          // this.entity.tdt = this.datepipe.transform(this.entity.tdt, 'yyyy-dd-MM');
          // this.previousyear = this.entity.active == 0 ? false : true;
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
    this.spinner.show();

    if (this.entity.divId) {
      if (!this.entity.createdUser)
        this.entity.createdUser = this.provider.companyinfo.userinfo.username;
      else
        this.entity.modifiedUser = this.provider.companyinfo.userinfo.username;

      this.http.put('FinYears/update', this.Master.cleanObject(this.entity, 2), { id: this.entity.divId, firmCode: this.entity.firmCode }).subscribe({
        next: (res: any) => {
          if (res.status_cd == 1) {

            this.entity = res.data;
            this.disabledata = true;
            this.pastentity = Object.assign({}, res.data);
            this.dialog.swal({ dialog: "success", title: "Success", message: "Record is saved sucessfully" });
            this.navaction.navaction("OK");
          }

          this.spinner.hide()

        }, error: (err: any) => {
          this.spinner.hide()
          this.dialog.swal({ dialog: 'error', title: 'Error', message: err.message })
        }
      })

    }
    else {
      this.spinner.hide()
      this.navactions.navaction('new');
    }


  }

  callbackEdit() {

  }
  states = [];

  newRecord() {
    this.entity = <FinYearObj>{};
    this.disabledata = false;
    this.reference = {};
    // let paramss: any = this.location.getState();
    // this.entity.divId = paramss.id;
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

    if (this.isChecked == true) {
      this.entity.isPrevYr = 1;
    } else {
      this.entity.isPrevYr = 0;
    }

    if (this.entity.isPrevYr == 1) {
      var url = "FinYears/getCurrToNewYear"
      var paramss = {

        firmCode: this.entity.firmCode,
        // branchCode: this.entity.branchCode

      }
      this.http.get(url, paramss).subscribe({
        next: (res: any) => {
          if (res.status_cd == 1) {

            this.entity = res.data;

          }

        }, error: (err: any) => {
          this.spinner.hide();
          this.dialog.swal({ dialog: 'error', title: 'Error', message: err });
        }


      })


    }

    else {

      this.entity.fromDivId = null;


    }

  }
}