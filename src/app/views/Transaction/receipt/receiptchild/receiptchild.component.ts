import { CommonModule, DatePipe, Location } from '@angular/common';
import { http, Master, NavbarActions } from '../../../../assets/services/services';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { MyProvider } from '../../../../assets/services/provider';
import { DialogsComponent } from '../../../../assets/pg/dialogs/dialogs.component';
import { ReportDictionory } from '../../../../../../assets/service/interfaces';
import { v4 as uuidv4 } from 'uuid'
import { ReceiptObj, acc00300Obj, recApproveObj, acc00301Obj } from '../../../../assets/datatypests/receiptchild'
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { DssInputComponent } from '../../../../assets/mydirective/dss-input/dss-input.component';
import { MydirectiveModule } from '../../../../assets/mydirective/mydirective.module';
import { ngselectComponent } from '../../../../assets/pg/ngselect/ngselect.component';
import { NavactionsComponent } from '../../../../assets/pg/navactions/navactions.component';
import { CurrencyMaskDirective } from "../../../../assets/mydirective/currencyMask/currency-mask.directive";
import { DTFormatDirective } from '../../../../assets/mydirective/mydirective.directive';

declare var bootstrap: any;
declare var $: any;



@Component({
  selector: 'app-receiptchild',
  templateUrl: './receiptchild.component.html',
  styleUrls: ['./receiptchild.component.scss'],
  imports: [FormsModule, CommonModule, DTFormatDirective, CurrencyMaskDirective, ngselectComponent, NgSelectModule, DssInputComponent, MydirectiveModule, NavactionsComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ReceiptchildComponent {
  entity: ReceiptObj;
  isDoc: boolean;

  rowIndex: any;
  rowIndexReference: any;
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
  isGstValid: boolean = true;
  docInfo: any = {};
  imgbase64: string | ArrayBuffer;
  promises: any = [];
  list: any = {};
  finyear: any;
  warningMessage: any = null;

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
    public provider: MyProvider,
    public navactions: NavbarActions,
    public master: Master,) {

    this.entity = <ReceiptObj>{};
    this.stateparams = this.location.getState();
    this.mode = this.stateparams.action;
    this.isDoc = this.stateparams.isDoc;
    this.entity.vchId = this.stateparams.id;
  }
  ngOnInit(): void {

    setInterval(() => {
      this.windowrespo();
    }, 1000)

    this.entity = <ReceiptObj>{};

    this.entity.acc00300 = <acc00300Obj>{};
    this.entity.acc00301 = <acc00301Obj>{};

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
    this.docInfo = {
      typ: "Receipt",
      vch_id: this.entity.vchId,
      descr: this.doc.attachdescr,
      username: this.provider.companyinfo.userinfo.username,
      div_id: this.provider.companyinfo.company.divId
    }
  }

  yearsList: any = [];

  getLastTwoYrearList() {
    this.spinner.show();
    this.http.get("FinYears/geLastTworYear", { firmCode: this.provider.companyinfo.company?.firm.firmCode }).subscribe({
      next: res => {
        this.yearsList = res.data;
      }, error: err => {
        this.dialog.swal({ dialog: 'error', title: 'Error', message: err });
      }, complete: () => {
        this.spinner.hide();
      }
    })
  }

  docBtnEvent() {
    this.docInfo = {
      typ: "Receipt",
      vch_id: this.entity.vchId,
      descr: this.doc.attachdescr,
      username: this.provider.companyinfo.userinfo.username,
      div_id: this.provider.companyinfo.company.divId
    }
  }

  Init() {

  }

  windowrespo() {
    if (window.innerWidth <= 767) {
      this.status = true;



    } else {
      this.status = false;
    }
  }

  newRecord() {
    this.entity = <ReceiptObj>{};

    this.entity.acc00300 = <acc00300Obj>{};
    this.entity.acc00301 = <acc00301Obj>{};
    this.entity.motormemo = {};
    this.entity.divId = this.provider.companyinfo.company.divId
    this.entity.amount = 0;
    this.entity.txnType = 2;
    this.entity.against = 1;
    this.entity.vchDate = new Date().toISOString()
    this.entity.sdt = this.provider.companyinfo.finyear.fdt ? this.provider.companyinfo.finyear.fdt.toShortString() : '';
    this.entity.edt = this.provider.companyinfo.finyear.tdt ? this.provider.companyinfo.finyear.tdt.toShortString() : '';
    this.entity.currdt = new Date().toISOString()
  }
  callbackedit() {
    this.spinner.show();
    var url = "receipt/receipt"
    this.http.get(url, { id: this.entity.vchId }).subscribe({
      next: (res: any) => {
        if (res.status_cd == 1) {
          this.entity = res.data;
          this.entity.acc00301.accCodeNavigation = res.data.acc00301.accCodeNavigation;

          this.entity.recApprove = this.entity.recApprove || <recApproveObj>{};
          this.entity.acc00300 = this.entity.acc00300 || <acc00300Obj>{};

          this.entity.vchDate = this.entity.vchDate ?? this.datepipe.transform(this.entity.vchDate, 'yyyy-MM-dd')
          this.entity.txnDate = this.entity.txnDate ?? this.datepipe.transform(this.entity.txnDate, 'yyyy-MM-dd')
          this.entity.refDate = this.entity.refDate ?? this.datepipe.transform(this.entity.refDate, 'yyyy-MM-dd')
          this.entity.acc00300.createdDt = this.entity.acc00300.createdDt ?? this.datepipe.transform(this.entity.acc00300.createdDt, 'yyyy-MM-dd')
          this.entity.acc00300.modifiedDt = this.entity.acc00300.modifiedDt ?? this.datepipe.transform(this.entity.acc00300.modifiedDt, 'yyyy-MM-dd')
          this.pastentity = Object.assign({}, this.entity);
        }
        this.spinner.hide();
      }, error: (err: any) => {
        this.spinner.hide();
        this.dialog.swal({ dialog: 'error', title: 'Error', message: err });
      }
    })
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
        this.receiptprint();
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

  receiptprint() {
    this.myServiceUrl = "ReceiptReport";

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

  LRandyearisDisabled: boolean = false;

  edit() {
    this.docInfo = null;
    this.docInfo = {
      typ: "Receipt",
      vch_id: this.entity.vchId,
      descr: this.doc.attachdescr,
      username: this.provider.companyinfo.userinfo.username,
      div_id: this.provider.companyinfo.company.divId
    }
    this.LRandyearisDisabled = true;
    this.navactions.navaction("view");
    this.callbackedit();
  }
  save() {
    this.spinner.show();
    if (!this.entity.vchId) {
      this.entity.firmId = this.provider.companyinfo.company?.firmCode;
      this.entity.divId = this.provider.companyinfo.company.divId


      if (!this.entity.acc00300.createdUser) {
        this.entity.acc00300.createdUser = this.provider.companyinfo.company.username || '';
        this.entity.acc00300.createdDt = new Date().toISOString()
      } else {
        this.entity.acc00300.modifiedUser = this.provider.companyinfo.company.username || '';
        this.entity.acc00300.modifiedDt = new Date().toISOString()

      }

      this.http.post('receipt/insert', this.master.cleanObject(this.entity, 2)).subscribe({
        next: (res: any) => {
          if (res.status_cd == 1) {
            this.entity.vchId = res.data.vchId;
            this.entity.vchNo = res.data.vchNo;
            this.entity.challanNo = res.data.challanNo;

            this.dialog.swal({ dialog: "success", title: "Success", message: "Record is saved sucessfully" });
            this.navactions.navaction("OK");
            this.docInfo = null;
            this.docInfo = {
              typ: "Receipt",
              vch_id: this.entity.vchId,
              descr: this.doc.attachdescr,
              username: this.provider.companyinfo.userinfo.username,
              div_id: this.provider.companyinfo.company.divId
            }
          }

          this.spinner.hide();

        }, error: (err: any) => {
          this.spinner.hide();
          this.dialog.swal({ dialog: 'error', title: 'Error', message: err.message })
        }
      })
    }
    else {
      this.http.put('receipt/update', this.master.cleanObject(this.entity, 2), { id: this.entity.vchId }).subscribe({
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
    this.navactions.navaction('new');
  }
  undo() {
    this.entity = this.pastentity;
  }
  close() {
    this.location.back();
  }


  tdsAmt() {
    this.entity.acc00301.tdsAmt = Number(Number(this.entity.acc00301.amount) * Number(this.entity.acc00301.tdsRate) / 100).round(2)
    this.entity.acc00301.recAmt = Number(Number(this.entity.acc00301.amount) - Number(this.entity.acc00301.tdsAmt)).round(2);
  }

  LRingetaccount() {

    this.http.get('MotorMemo/LRgetdata', {
      firm_id: this.provider.companyinfo.company?.firm.firmCode,
      div_id: this.entity.divId, memoNo: this.entity.memoNo
    }).subscribe({
      next: (res: any) => {
        if (res.status_cd == 1) {
          this.entity.acc00301.lraccount = res.data.accCodeNavigation;
          this.entity.acc00301.amount = res.data.buildtotalamt;
          this.entity.lrId = res.data.vchId;

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
  getAccountDetl(obj) {
    // this.acc00301.accCodeNavigation = obj;
  }
}