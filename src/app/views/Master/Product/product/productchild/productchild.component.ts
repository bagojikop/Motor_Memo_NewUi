import { CommonModule, DatePipe, Location } from '@angular/common';
import { http, Master, NavbarActions } from '../../../../../assets/services/services';
import { Component, AfterViewInit, HostListener, ViewChild, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { MyProvider } from '../../../../../assets/services/provider';
import { DialogsComponent } from '../../../../../assets/pg/dialogs/dialogs.component';
import { resolve } from '@angular/compiler-cli';
import { Product, invItemFactor, invItemGst, invItemlocation, supplier, invItemSupplier } from "../../../../../Models/product"
import { FormsModule, NgForm } from '@angular/forms'; 
import { HttpClient } from '@angular/common/http';
import {mst010} from '../../../../../assets/datatypests/productchild'
import { NgSelectModule } from '@ng-select/ng-select';
import { DssInputComponent } from '../../../../../assets/mydirective/dss-input/dss-input.component';
import { MydirectiveModule } from '../../../../../assets/mydirective/mydirective.module';
import { MasternavComponent } from '../../../../../assets/pg/masternav/masternav.component';
import { ngselectComponent } from '../../../../../assets/pg/ngselect/ngselect.component';
import { UppercaseDirective, NumberOnlyDirective } from '../../../../../assets/mydirective/mydirective.directive';

declare var bootstrap: any;
declare var $: any;



@Component({
  selector: 'app-productchild',
  templateUrl: './productchild.component.html',
  styleUrls: ['./productchild.component.scss'],
    imports:[FormsModule,CommonModule,NgSelectModule,NumberOnlyDirective, DssInputComponent, MydirectiveModule, MasternavComponent],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class ProductchildComponent {
  @ViewChild("vi") vi: NgForm;
  entity: mst010;
  sgCodeNavigation: string
  reference: any = {};
  acc: any = {};
  status: boolean = false;
  ngview: boolean = false;
  stateParams: any;

  mode: any;
  rowIndex: any;
  param;
  loading: boolean = false;
  placebuffer = [];
  viewing1: number = 1;
  viewing2: number = 2;
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
    this.entity = <mst010>{};
    this.stateParams = this.location.getState();
    this.mode = this.stateParams.action;
  }

  ngOnInit(): void {

    this.entity = <mst010>{};



    let paramss: any = this.location.getState();
    this.navactions.navaction(paramss.action);

    if (this.stateParams.id) {
      this.callbackedit()
    }
    this.Init();
  }


  Init() {
    //unit
    this.http.get('Unit/list').subscribe({
      next: (res: any) => {
        if (res.status_cd == 1) {
          this.reference.iUnit = res.data;
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
    var url = "productinfo/ProductInfoedit"
    this.http.get(url, { id: this.stateParams.id }).subscribe({
      next: (res: any) => {
        if (res.status_cd == 1) {
          this.entity = res.data;

          this.entity.createdDt = this.entity.createdDt ?? this.datepipe.transform(this.entity.createdDt, 'yyyy-MM-dd');
          this.entity.modifiedDt = this.entity.modifiedDt ?? this.datepipe.transform(this.entity.modifiedDt, 'yyyy-MM-dd');


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
 
    if (!this.entity.iId) {


      if (!this.entity.createdUser)

        this.entity.createdUser = this.provider.companyinfo.userinfo.username;


      let body = this.master.cleanObject(this.entity, 2);

      var a = JSON.stringify(body);
      this.http.post('ProductInfo/insert', body).subscribe({
        next: (res: any) => {
          this.spinner.hide();
          if (res.status_cd == 1) {

            this.entity.iId = res.data.iId;
            // if (!this.entity.invItemlocation) {
            //   this.entity.invItemlocation = <invItemlocation>{};
            // }


            this.pastentity = Object.assign({}, this.entity);
            this.dialog.swal({ dialog: "success", title: "Success", message: "Record is saved sucessfully" });
            this.navactions.navaction("OK");
          }
          else {
            this.dialog.swal({ dialog: 'error', title: 'Error', message: res.errors.exception.message })
          }
          this.spinner.hide();
        }, error: (err: any) => {
          this.spinner.hide();
          this.dialog.swal({ dialog: 'error', title: 'Error', message: err.message })
        }
      })

    }

    else {

      this.entity.modifiedUser = this.provider.companyinfo.userinfo.username;
      this.http.put('ProductInfo/update', this.master.cleanObject(this.entity, 2), { id: this.entity.iId }).subscribe({
        next: (res: any) => {
          this.spinner.hide()
          if (res.status_cd == 1) {
            this.entity.iId = res.data.iId;

            this.pastentity = Object.assign({}, this.entity);
            this.dialog.swal({ dialog: "success", title: "Success", message: "Record is Update sucessfully" });
            this.navactions.navaction("OK");
          }
          else {
            this.dialog.swal({ dialog: 'error', title: 'Error', message: res.errors.exception.InnerException.message })
          }

          this.spinner.hide()
        }, error: (err: any) => {
          this.spinner.hide()
          this.dialog.swal({ dialog: 'error', title: 'Error', message: err.message })
        }
      })
    }

  }

  account(index) {
    this.reference.subdealars.accName = index.accName;
  }

  close() {
    this.location.back();
  }
  newRecord() {

  }
  edit() {
    this.navactions.navaction("view");
    this.callbackedit();

  }

  undo() {
    this.entity = this.pastentity;
  }
}
