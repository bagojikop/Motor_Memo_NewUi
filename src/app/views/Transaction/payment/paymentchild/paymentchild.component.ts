import { CommonModule, DatePipe, DecimalPipe, Location } from '@angular/common';
import { http, imgResize, Master, NavbarActions, toNumber } from '../../../../assets/services/services';
import { Component, AfterViewInit, HostListener, NgZone, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { MyProvider } from '../../../../assets/services/provider';
import { DialogsComponent } from '../../../../assets/pg/dialogs/dialogs.component';
import { resolve } from '@angular/compiler-cli';
import { NgxImageCompressService } from 'ngx-image-compress';
import { Router } from '@angular/router';
import { castFromArrayBuffer } from '../../../../assets/services/services';
import { ReportDictionory } from '../../../../../../assets/service/interfaces';
import { v4 as uuidv4 } from 'uuid'
import { PaymentObj, acc00200Obj, payApproveObj, acc00201Obj, paySellerBuyerObj, accCodeNavigationObj } from '../../../../assets/datatypests/paymentchild'
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { DssInputComponent } from '../../../../assets/mydirective/dss-input/dss-input.component';
import { MydirectiveModule } from '../../../../assets/mydirective/mydirective.module';
import { MasternavComponent } from '../../../../assets/pg/masternav/masternav.component';
import { ngselectComponent } from '../../../../assets/pg/ngselect/ngselect.component';
declare var bootstrap: any;
declare var $: any;
import '../../../../assets/services/datePrototype'
import { NavactionsComponent } from '../../../../assets/pg/navactions/navactions.component';
import { DTFormatDirective, NumberOnlyDirective } from '../../../../assets/mydirective/mydirective.directive';
import {CurrencyMaskDirective} from "../../../../assets/mydirective/currencyMask/currency-mask.directive"; 

@Component({
  selector: 'app-paymentchild',
  templateUrl: './paymentchild.component.html',
  styleUrls: ['./paymentchild.component.scss'],
  imports: [FormsModule, CommonModule,DTFormatDirective,CurrencyMaskDirective, ngselectComponent,NumberOnlyDirective, NgSelectModule, NgxPaginationModule, DssInputComponent, MydirectiveModule, NavactionsComponent],
  providers:[],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PaymentchildComponent {
  entity: PaymentObj;
  isDoc: boolean;
  reference: any = {};
  rec: any = {};
  rowIndex: any;
  param;
  docInfo: any = {};
  inIndex: any;
  ainIndex: any;
  viewing: number = 1;
  status: boolean = false;
  ngview: boolean = false;
  stateparams;
  mode = 0;
  doc: any = {};
  pastentity;
  imagecreate: any = [];
  formdata = new FormData();
  uploader: any;
  editImag: boolean = false;
  imgformatedsize: number;
  reader = new FileReader();
  url;
  list: any = {};
  imgbase64: string | ArrayBuffer;
  promises: any = [];
  warningMessage: any = null;
  finyear: any;
  selectyear = [
    { nm: '20232024' },
    { nm: '20222023' },
    { nm: '20212022' }
  ]

  constructor(
    public location: Location,
    public http: http,
    private datepipe: DatePipe,
    private dialog: DialogsComponent,
    private spinner: NgxSpinnerService,
    private provider: MyProvider,
    public navactions: NavbarActions,
    public master: Master) {

    this.entity = <PaymentObj>{};
    this.stateparams = this.location.getState();
    this.mode = this.stateparams.action;
    this.isDoc = this.stateparams.isDoc;
    // this.entity = this.stateparams.list;
    this.entity.vchId = this.stateparams.id;
  }
  ngOnInit(): void {

    setInterval(() => {
      this.windowrespo();
    }, 1000)

    this.entity = <PaymentObj>{};
    this.entity.acc00200 = <acc00200Obj>{};


    this.entity.payApprove = <payApproveObj>{};
    this.rec.acc00201 = <acc00201Obj>{};
    this.rec.acc00201.accCodeNavigation = <accCodeNavigationObj>{};

    this.entity.paySellerBuyer = <paySellerBuyerObj>{};
    this.finyear = this.provider.companyinfo.finyear;
    let paramss: any = this.location.getState();
    this.navactions.navaction(paramss.action);
    this.entity.vchId = paramss.id;
    if (this.entity.vchId) {
      this.navactions.fieldset = true;
      this.callbackedit();
    } else {
      this.navactions.fieldset = false;
      this.newRecord();
    }

    this.docInfo = {
      typ: "Payment",
      vch_id: this.entity.vchId,
      descr: this.doc.attachdescr,
      username: this.provider.companyinfo.userinfo.username,
      div_id: this.provider.companyinfo.company.divId
    }
    this.Init();
  }
  Init() {


  }

  getAccountDetl(obj) {
    this.rec.acc00201.accCodeNavigation = obj;
  }

  newRecord() {
    this.entity = <PaymentObj>{};
    this.entity.acc00200 = <acc00200Obj>{};
    this.entity.acc00201 = <acc00201Obj>{};

    this.entity.paySellerBuyer = <paySellerBuyerObj>{};
    this.entity.amount = 0;
    this.entity.txnType = 2;
    this.entity.against = 1;
    this.entity.paySellerBuyer.supplierType = 1;
    this.entity.paySellerBuyer.partyType = 1;
    this.entity.paySellerBuyer.stateType = "1";
    this.entity.vchDate = new Date().toShortString()
    this.entity.sdt = this.provider.companyinfo.finyear.fdt ? this.provider.companyinfo.finyear.fdt.toShortString() : '';
    this.entity.edt = this.provider.companyinfo.finyear.tdt ? this.provider.companyinfo.finyear.tdt.toShortString() : '';
    this.entity.currdt = new Date().toShortString()
  }
  DocPush(index) {
    this.entity.vchId = this.entity.vchId;
    this.entity.payAttachs.push(index);
  }
  callbackedit() {
    this.spinner.show();
    var url = "payment/payment"
    this.http.get(url, { id: this.entity.vchId }).subscribe({
      next: (res: any) => {
        if (res.status_cd == 1) {
          this.entity = res.data;
         // this.entity.accCodeNavigation = res.data.accCodeNavigation;

          this.entity.paySellerBuyer = this.entity.paySellerBuyer || <paySellerBuyerObj>{};
          this.entity.acc00200 = this.entity.acc00200 || <acc00200Obj>{};
          this.entity.vchDate = this.entity.vchDate ?? this.datepipe.transform(this.entity.vchDate, 'yyyy-MM-dd')
          this.entity.txnDate = this.entity.txnDate ?? this.datepipe.transform(this.entity.txnDate, 'yyyy-MM-dd')
          this.entity.refDate = this.entity.refDate ?? this.datepipe.transform(this.entity.refDate, 'yyyy-MM-dd')
          this.entity.acc00200.createdDt = this.entity.acc00200.createdDt ?? this.datepipe.transform(this.entity.acc00200.createdDt, 'yyyy-MM-dd')
          this.entity.acc00200.modifiedDt = this.entity.acc00200.modifiedDt ?? this.datepipe.transform(this.entity.acc00200.modifiedDt, 'yyyy-MM-dd')
          this.pastentity = Object.assign({}, this.entity);
        }
        this.spinner.hide();
        // this.navactions.navaction("OK");
      }, error: (err: any) => {
        this.spinner.hide();
        this.dialog.swal({ dialog: 'error', title: 'Error', message: err });
      }
    })
  }
  windowrespo() {
    if (window.innerWidth <= 767) {
      this.status = true;

    } else {
      this.status = false;
    }
  }

  action: any;

  navbar(s) {
    this.action = s;
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
        this.paymentprint();
        this.ngview = false;
        break;
      case 'close':
        this.close();
        break;
    }
  }
  undo() {
    this.entity = this.pastentity;
  }
  close() {
    this.location.back();
  }
  edit() {
    this.docInfo = null;
    this.docInfo = {
      typ: "Payment",
      vch_id: this.entity.vchId,
      descr: this.doc.attachdescr,
      username: this.provider.companyinfo.userinfo.username,
      div_id: this.provider.companyinfo.company.divId
    }
    this.navactions.navaction("view");
    this.callbackedit();
  }
  parameters: any[] = [];
  rptMode: boolean = false;
  pdfSrc: string;
  myServiceUrl: string;
  myReportDictionory: ReportDictionory = <ReportDictionory>{};

  paymentprint() {


    this.myServiceUrl = "PaymentReport";

    this.myReportDictionory = {
      reportCacheId: uuidv4(),
      reportParams: [
        {
          key: "vch_id", value: this.entity.vchId,
        },
        {
          key: "firm_id", value: this.provider.companyinfo.company?.firmCode,

        }]
    };
    this.rptMode = true;
  }
  save() {
    this.spinner.show();

    if (!this.entity.vchId) {
      this.entity.firmId = this.provider.companyinfo.company?.firmCode;
      this.entity.divId = this.provider.companyinfo.company.divId

      if (!this.entity.acc00200.createdUser)
        this.entity.acc00200.createdUser = this.provider.companyinfo.company.username;
      else
        this.entity.acc00200.modifiedUser = this.provider.companyinfo.company.username;


      this.http.post('payment/insert', this.master.cleanObject(this.entity, 2)).subscribe({
        next: (res: any) => {
          if (res.status_cd == 1) {

            this.entity.vchId = res.data.vchId;
            this.entity.vchNo = res.data.vchNo;
            this.entity.challanNo = res.data.challanNo;
            //this.provider.ShareData.Acclist.push(this.entity.accCode);
            this.dialog.swal({ dialog: "success", title: "Success", message: "Record is saved sucessfully" });
            this.navactions.navaction("OK");
          }

          this.spinner.hide();

        }, error: (err: any) => {
          this.spinner.hide();
          this.dialog.swal({ dialog: 'error', title: 'Error', message: err.message })
        }
      })
    }
    else {
      this.http.put('payment/update', this.master.cleanObject(this.entity, 2), { id: this.entity.vchId }).subscribe({
        next: (res: any) => {

          if (res.status_cd == 1) {
            this.entity.vchId = res.data.vchId;
            this.entity.vchNo = res.data.vchNo;
            this.entity.challanNo = res.data.challanNo;

            this.dialog.swal({ dialog: "success", title: "Success", message: "Record is Update sucessfully" });
            this.navactions.navaction("OK");
          }



          this.spinner.hide()
        }, error: (err: any) => {
          this.dialog.swal({ dialog: 'error', title: 'Error', message: err })
        }
      })
    }
  }

  tdsAmt() {
    let amount = Number(this.entity.acc00201.amount) || 0;
    let tdsRate = Number(this.entity.acc00201.tdsRate) || 0;

    let tdsAmt = (amount * tdsRate) / 100;
    this.entity.acc00201.tdsAmt = parseFloat(tdsAmt.toFixed(2));  // Rounds to 2 decimal places

    let recAmt = amount - tdsAmt;
    this.entity.acc00201.recAmt = parseFloat(recAmt.toFixed(2));
}


}
