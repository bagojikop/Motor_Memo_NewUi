import { CommonModule, DatePipe, Location } from '@angular/common';
import { http, imgResize, Master, NavbarActions, toNumber } from '../../../../assets/services/services';
import { Component, NgZone, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { MyProvider } from '../../../../assets/services/provider';
import { DialogsComponent } from '../../../../assets/pg/dialogs/dialogs.component';
import { NgxImageCompressService } from 'ngx-image-compress';
import { v4 as uuidv4 } from 'uuid'
import { ReportDictionory } from '../../../../../../assets/service/interfaces';
import { ContraObj, contraAuditObj, contraItemsObj, contraApproveObj, accCodeNavigationObj } from '../../../../assets/datatypests/contrachild'
import "../../../../../app/assets/services/datePrototype"
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { DssInputComponent } from '../../../../assets/mydirective/dss-input/dss-input.component';
import { MydirectiveModule } from '../../../../assets/mydirective/mydirective.module';
 import { ngselectComponent } from '../../../../assets/pg/ngselect/ngselect.component';
import { NavactionsComponent } from '../../../../assets/pg/navactions/navactions.component';
import {CurrencyMaskDirective} from "../../../../assets/mydirective/currencyMask/currency-mask.directive"; 
import { DTFormatDirective } from '../../../../assets/mydirective/mydirective.directive';

declare var bootstrap: any;
declare var $: any; 

@Component({
  selector: 'app-contrachild',
  templateUrl: './contrachild.component.html',
  styleUrls: ['./contrachild.component.scss'],
    imports:[FormsModule,CommonModule,DTFormatDirective,CurrencyMaskDirective,ngselectComponent,NgSelectModule, DssInputComponent, MydirectiveModule, NavactionsComponent],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class ContrachildComponent {
  entity: ContraObj;
  reference: any = {};
  rec: any = {};
  rowIndex: any;
  param;
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
  imgbase64: string | ArrayBuffer;
  promises: any = [];
  viewing1: number = 1;
  finyear: any;
  constructor(
    public location: Location,
    public http: http,
    private datepipe: DatePipe,
    private dialog: DialogsComponent,
    private spinner: NgxSpinnerService,
    public provider: MyProvider,
    public navactions: NavbarActions,
    public imgResize: imgResize,
    private toNumber: toNumber,
    private imageCompress: NgxImageCompressService,
    private zone: NgZone,
    public master: Master) {

    this.entity = <ContraObj>{};
    this.stateparams = this.location.getState();
    this.mode = this.stateparams.action;
    this.entity.vchId = this.stateparams.id;
  }
  ngOnInit(): void {

    setInterval(() => {
      this.windowrespo();
    }, 1000)

    this.entity = <ContraObj>{};
    this.entity.contraAudit = <contraAuditObj>{};
    // this.entity.recSellerBuyer = <recSellerBuyerObj>{};
    this.entity.contraApprove = <contraApproveObj>{};
    // this.reference.recGsts = <recGstsObj>{};
    this.rec.contraItems = <contraItemsObj>{};
    this.rec.contraItems.accCodeNavigation = <accCodeNavigationObj>{};
    // this.reference.recLinks = <recLinksObj>{};
    // this.reference.recAttachs = <recAttachsObj>{};
    // this.reference.chqRtns = <chqRtnsObj>{};
    this.reference.states = [];
    this.reference.accounts = [];
    this.reference.products = [];
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
    this.Init();
  }
  Init() {
    this.entity.acc00601s = <contraItemsObj[]>[];
    //Account
    // this.http.get('Account/BankCash').subscribe({
    //   next: (res: any) => {
    //     if (res.status_cd == 1) {
    //       this.reference.accounts = res.data;
    //     } else {
    //       this.dialog.swal({ dialog: 'error', title: 'Error', message: res.errors.exception.Message });
    //     }
    //     this.spinner.hide();
    //   }, error: (err: any) => {
    //     this.spinner.hide();
    //     this.dialog.swal({ dialog: 'error', title: 'Error', message: err.message });
    //   }
    // })
  }
  windowrespo() {
    if (window.innerWidth <= 767) {
      this.status = true;



    } else {
      this.status = false;
    }
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
        this.contraprint();
        this.ngview = true;
        break;
      case 'close':
        this.close();
        break;
    }
  }
  parameters: any[] = [];
  rptMode: boolean = false;
  pdfSrc: string;
  myServiceUrl: string;
  myReportDictionory: ReportDictionory = <ReportDictionory>{};



  contraprint() {


    this.myServiceUrl = "ContraReport";

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


  edit() {
    this.navactions.navaction("view");
    this.callbackedit();
  }
  undo() {
    this.entity = this.pastentity;
  }
  close() {
    this.location.back();
  }
  callbackedit() {
    this.spinner.show();
    var url = "contra/contra"
    this.http.get(url, { id: this.entity.vchId }).subscribe({
      next: (res: any) => {
        if (res.status_cd == 1) {
          this.entity = res.data;

          // this.entity.recSellerBuyer = this.entity.recSellerBuyer || <recSellerBuyerObj>{};
          this.entity.contraApprove = this.entity.contraApprove || <contraApproveObj>{};
          this.entity.contraAudit = this.entity.contraAudit || <contraAuditObj>{};
          this.entity.vchDate = this.entity.vchDate ?? this.datepipe.transform(this.entity.vchDate, 'yyyy-MM-dd')  
          // this.entity.txnDate = this.entity.txnDate ? this.datepipe.transform(this.entity.txnDate, 'yyyy-MM-dd') : null;
          // this.entity.refDate = this.entity.refDate ? this.datepipe.transform(this.entity.refDate, 'yyyy-MM-dd') : null;
          this.entity.contraAudit.createdDt = this.entity.contraAudit.createdDt ?? this.datepipe.transform(this.entity.contraAudit.createdDt, 'yyyy-MM-dd')  
          this.entity.contraAudit.modifiedDt = this.entity.contraAudit.modifiedDt ?? this.datepipe.transform(this.entity.contraAudit.modifiedDt, 'yyyy-MM-dd') 
          this.entity.contraApprove.approvedDt = this.entity.contraApprove.approvedDt ?? this.datepipe.transform(this.entity.contraApprove.approvedDt, 'yyyy-MM-dd')  
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
  type(value: number) {
    return value === 1 ? 'Debit' : 'Credit';

    // if (this.entity.transType == 2) {
    //   this.viewing1 = 2;
    // } else
    //   this.viewing1 = 1;
  }
  newRecord() {
    this.entity = <ContraObj>{};
    this.entity.contraAudit = <contraAuditObj>{};
    this.entity.contraApprove = <contraApproveObj>{};
    this.entity.contraItems = <contraItemsObj[]>[];
    this.entity.amount = 0;
    //this.entity.transType = 2;
    this.entity.vchDate = new Date().toShortString();
    this.entity.sdt = this.provider.companyinfo.finyear.fdt ? this.provider.companyinfo.finyear.fdt.toShortString() : '';
    this.entity.edt =this.provider.companyinfo.finyear.tdt ? this.provider.companyinfo.finyear.tdt.toShortString() : '';
    this.entity.currdt = new Date().toShortString();
  }
  save() {
    this.spinner.show();

    if (!this.entity.vchId) {

      // this.entity.branchId = this.provider.companyinfo.company?.branchCode;
      this.entity.firmId = this.provider.companyinfo.company?.firmCode;
      this.entity.divId = this.provider.companyinfo.company.divId
      if (!this.entity.contraAudit.createdUser)
        this.entity.contraAudit.createdUser = this.provider.companyinfo.company.userinfo.username;
      else
        this.entity.contraAudit.modifiedUser = this.provider.companyinfo.company.userinfo.username;

      this.http.post('contra/post', this.master.cleanObject(this.entity, 2)).subscribe({
        next: (res: any) => {
          if (res.status_cd == 1) {

            this.entity.vchId = res.data.vchId;
            this.entity.vchNo = res.data.vchNo;
            this.entity.challanNo = res.data.challanNo;
            this.pastentity = Object.assign({}, this.entity);
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
      this.http.put('contra/put', this.master.cleanObject(this.entity, 2), { id: this.entity.vchId }).subscribe({
        next: (res: any) => {

          if (res.status_cd == 1) {
            this.entity.vchId = res.data.vchId;
            this.entity.vchNo = res.data.vchNo;
            this.entity.challanNo = res.data.challanNo;

            this.pastentity = Object.assign({}, this.entity);
            this.dialog.swal({ dialog: "success", title: "Success", message: "Record is Update sucessfully" });
            this.navactions.navaction("OK");
          }



          this.spinner.hide()
        }, error: (err: any) => {
          this.dialog.swal({ dialog: 'error', title: 'Error', message: err })
        }
      })
    }
    this.navactions.navaction('new');
  }
  getAccountDetl(obj) {
    this.rec.contraItems.accCodeNavigation = obj;
  }
  totalRecAmt() {
    var sumArray = this.entity.acc00601s.map(item => {
      return item.amount;
    });

    var sumValue = sumArray.reduce(function (pValue, cValue) {
      return Number(pValue) + Number(cValue)

    });

    this.entity.amount = sumValue;
  }

  AddDebited() {
    if (this.rowIndex == null) {
      this.entity.acc00601s.push(this.rec.contraItems);
    } else {

      this.entity.acc00601s[this.rowIndex] = this.rec.contraItems;
    }

    this.rec.contraItems = <contraItemsObj>{};
    this.totalRecAmt();
    this.rowIndex = null;
  }
  ContraEdit(s) {
    this.rowIndex = this.entity.acc00601s.indexOf(s);
    this.rec.contraItems = Object.assign({}, s);
  }
  ContraDelete(s) {
    var params = {
      dialog: 'confirm',
      title: "warning",
      message: "Do You Want Delete Row",
    }
    this.dialog.swal(params).then(data => {
      if (data == true) {
        this.param = this.entity.acc00601s.indexOf(s);
        this.iConfirmFn3();
        this.totalRecAmt();
      }
    })
  }
  iConfirmFn3() {
    if (this.param != undefined) {
      this.entity.acc00601s.splice(this.param, 1);
      var params = {
      }
      this.dialog.swal(params);
    }
  }
}
