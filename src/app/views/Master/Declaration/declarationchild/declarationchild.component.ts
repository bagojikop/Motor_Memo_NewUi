import { CommonModule, DatePipe, Location } from '@angular/common';
import { http, Master, NavbarActions } from '../../../../assets/services/services';
import { Component, AfterViewInit, HostListener, ViewChild, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { MyProvider } from '../../../../assets/services/provider';
import { DialogsComponent } from '../../../../assets/pg/dialogs/dialogs.component';
import { resolve } from '@angular/compiler-cli';
import { Product, invItemFactor, invItemGst, invItemlocation, supplier, invItemSupplier } from "../../../../Models/product"
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { dateFormat } from '../../../../../../assets/service/services';
import { AccountObj, mst10301sObj } from '../../../../assets/datatypests/declarationchild'
import { NgSelectModule } from '@ng-select/ng-select';
import { DssInputComponent } from '../../../../assets/mydirective/dss-input/dss-input.component';
import { MydirectiveModule } from '../../../../assets/mydirective/mydirective.module';
import { ngselectComponent } from '../../../../assets/pg/ngselect/ngselect.component';
import { pipe } from 'rxjs';
import { NavactionsComponent } from '../../../../assets/pg/navactions/navactions.component';
import { UppercaseDirective,NumberOnlyDirective, DTFormatDirective } from '../../../../assets/mydirective/mydirective.directive';

@Component({
  selector: 'app-declarationchild',
  templateUrl: './declarationchild.component.html',
  styleUrls: ['./declarationchild.component.scss'],
  imports: [FormsModule, CommonModule,DTFormatDirective, NumberOnlyDirective, ngselectComponent,NavactionsComponent, NgSelectModule, DssInputComponent, MydirectiveModule],
  providers:[NavbarActions],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class DeclarationchildComponent {
  @ViewChild("vi") vi: NgForm;
  entity: AccountObj;
  sgCodeNavigation: string
  reference: any = {};

  acc: any = {};
  status: boolean = false;
  ngview: boolean = false;
  stateParams: any;

  mode: any;
  rowIndex: any;
  param;
  pastentity;
  constructor(public location: Location,
    public http: http,
    public httpclient: HttpClient,
    private datepipe: DatePipe,
    private dialog: DialogsComponent,
    private spinner: NgxSpinnerService,
    private provider: MyProvider,
    public navactions: NavbarActions,
    public master: Master
  ) {
    this.entity = <AccountObj>{};
    this.stateParams = this.location.getState();
    this.mode = this.stateParams.action;
    this.entity.sCode = this.stateParams.id;
  }

  ngOnInit(): void {
    setInterval(() => {
      this.windowrespo();
    }, 1000)

    this.entity = <AccountObj>{};

    this.entity.fromDt = new Date().toISOString().split('T')[0]; // Format to YYYY-MM-DD

    let paramss: any = this.location.getState();
    this.navactions.navaction(paramss.action);
    this.entity.sCode = paramss.id;

    if (this.entity.sCode) {
      this.navactions.fieldset = true;
      this.callbackedit();
    } else {
      this.navactions.fieldset = false;
      this.newRecord();
    }
    this.Init();
  }

  windowrespo() {
    if (window.innerWidth <= 767) {
      this.status = true;



    } else {
      this.status = false;
    }
  }
  Init() {

  }
  navbar(s) {
    switch (s) {
      case 'new':
        this.newRecord();
        break;

      case 'edit':

        this.edit();

        break;

      case 'save':
        this.save();
        break;

      case 'undo':
        this.undo();
        break;

      case 'print':
        this.ngview = true;
        break;

      case 'close':
        this.close();
        break;
    }

  }

  callbackedit() {
    this.spinner.show();
    var url = "Declaration/edit"
    this.http.get(url, { id: this.stateParams.id }).subscribe({
      next: (res: any) => {
        if (res.status_cd == 1) {
          this.entity = res.data;

          this.entity.createdDt = this.entity.createdDt ?? this.datepipe.transform(this.entity.createdDt, 'yyyy-MM-dd')
          this.entity.modifiedDt = this.entity.modifiedDt ?? this.datepipe.transform(this.entity.modifiedDt, 'yyyy-MM-dd')


          this.pastentity = Object.assign({}, this.entity);

        }
        this.spinner.hide();

      }, error: (err: any) => {
        this.spinner.hide();
        this.dialog.swal({ dialog: 'error', title: 'Error', message: err });
      }
    })
  }

  save() {

    this.spinner.show();
    if (!this.entity.declrId) {
      if (!this.entity.createdUser)
        this.entity.createdUser = this.provider.companyinfo.company.username;
      this.entity.sCode = 2;
      this.entity.declrNo = 10;
      this.entity.fyId = this.provider.companyinfo.company.divId
      this.http.post('Declaration/insert', this.entity).subscribe({
        next: (res: any) => {
          if (res.status_cd == 1) {

            this.entity.sCode = res.data.sCode;

            this.dialog.swal({ dialog: "success", title: "Success", message: "Record is saved sucessfully" });
            this.navactions.navaction("OK");
          }

          this.spinner.hide()

        }, error: (err: any) => {
          this.spinner.hide()
          this.dialog.swal({ dialog: 'error', title: 'Error', message: err.message })
        }
      })
    }
    else {
      this.entity.modifiedUser = this.provider.companyinfo.company.userinfo.username;
      this.entity.modifiedUser = this.provider.companyinfo.company.username;
      this.http.put('Declaration/update', this.master.cleanObject(this.entity, 2), { id: this.entity.declrId }).subscribe({
        next: (res: any) => {
          this.spinner.hide()
          if (res.status_cd == 1) {
            this.entity.sCode = res.data.sCode;

            this.dialog.swal({ dialog: "success", title: "Success", message: "Record is Update sucessfully" });
            this.navactions.navaction("OK");
          } else {
            this.dialog.swal({ dialog: 'error', title: 'Error', message: res.errors.exception.InnerException.message })
          }


        }, error: (err: any) => {
          this.spinner.hide()
          this.dialog.swal({ dialog: 'error', title: 'Error', message: err.message })
        }
      })
    }

  }

  // account(index) {
  //   this.reference.subdealars.accName = index.accName;
  // }

  close() {
    this.location.back();
  }
  newRecord() {
    this.entity.mst10301s = <mst10301sObj[]>[];
  }
  edit() {
    this.navactions.navaction("view");
    this.callbackedit();

  }

  undo() {
    this.entity = this.pastentity;
  }

  isInvalidPan: boolean = false;
  validatePan(pan: string): void {
    const panPattern = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    this.isInvalidPan = pan ? !panPattern.test(pan) : false;
  }

  vehicledelete(s) {
    var params = {
      dialog: 'confirm',
      title: "warning",
      message: "Do You Want Delete Row",
    }
    this.dialog.swal(params).then(data => {
      if (data == true) {
        this.param = this.entity.mst10301s.indexOf(s);
        this.iConfVehiNo();
      }
    })
  }
  iConfVehiNo() {
    if (this.param != undefined) {
      this.entity.mst10301s.splice(this.param, 1);
      var params = {
      }
      this.dialog.swal(params);
      this.entity.noOfVehicles = this.getTotalVehicles();
    }
  }

  totalVehicle: number
  AddVehicle() {
    if (this.rowIndex == null) {
      this.entity.mst10301s.push(this.reference);
      this.entity.noOfVehicles = this.getTotalVehicles();
    } else {

      this.entity.mst10301s[this.rowIndex] = this.reference;
    }

    this.reference = {};
    this.rowIndex = null;

  }

  getTotalVehicles(): number {
    return this.entity.mst10301s.length;
  }

  getpandetails(item) {
    this.entity.panNo = item.panNo;
  }
}
