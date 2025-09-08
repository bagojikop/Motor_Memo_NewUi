import { CommonModule, DatePipe, Location } from '@angular/common';
import { http, imgResize, Master, NavbarActions } from '../../../../assets/services/services';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { MyProvider } from '../../../../assets/services/provider';
import { DialogsComponent } from '../../../../assets/pg/dialogs/dialogs.component';
import { ReportDictionory } from '../../../../../../assets/service/interfaces';
import { JournalObj, acc00500Obj, acc00501sObj, jrnApproveObj, accCodeNavigationObj } from '../../../../assets/datatypests/Journalchild'
import { v4 as uuidv4 } from 'uuid'
import "../../../../../app/assets/services/datePrototype"
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { DssInputComponent } from '../../../../assets/mydirective/dss-input/dss-input.component';
import { MydirectiveModule } from '../../../../assets/mydirective/mydirective.module';
import { ngselectComponent } from '../../../../assets/pg/ngselect/ngselect.component';
import { NavactionsComponent } from '../../../../assets/pg/navactions/navactions.component';
import { CurrencyMaskDirective } from '../../../../assets/mydirective/currencyMask/currency-mask.directive';
import { DTFormatDirective } from '../../../../assets/mydirective/mydirective.directive';

@Component({
  selector: 'app-journalchild',
  templateUrl: './journalchild.component.html',
  styleUrls: ['./journalchild.component.scss'],
  imports: [FormsModule, CommonModule, DTFormatDirective, CurrencyMaskDirective, ngselectComponent, NgSelectModule, DssInputComponent, MydirectiveModule, NavactionsComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class JournalchildComponent {
  entity: JournalObj;
  isDoc: boolean;
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
  docInfo: any = {};
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
    private provider: MyProvider,
    public navactions: NavbarActions,
    public imgResize: imgResize,
    public master: Master) {

    this.entity = <JournalObj>{};
    this.stateparams = this.location.getState();
    this.mode = this.stateparams.action;
    this.isDoc = this.stateparams.isDoc;
    this.entity.vchId = this.stateparams.id;
  }
  ngOnInit(): void {

    setInterval(() => {
      this.windowrespo();
    }, 1000)

    this.entity = <JournalObj>{};
    this.entity.acc00500 = <acc00500Obj>{};
    this.entity.jrnApprove = <jrnApproveObj>{};
    this.rec.jrnItems = <acc00501sObj>{};
    this.rec.jrnItems.accCodeNavigation = <accCodeNavigationObj>{};

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

    this.docInfo = {
      typ: "Journal",
      vch_id: this.entity.vchId,
      descr: this.doc.attachdescr,
      username: this.provider.companyinfo.userinfo.username,
     
    }
   
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
        this.jrnprint();
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
  jrnprint() {
    this.myServiceUrl = "JrnReport";

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
    this.docInfo = null;
    this.docInfo = {
      typ: "Journal",
      vch_id: this.entity.vchId,
      descr: this.doc.attachdescr,
      username: this.provider.companyinfo.userinfo.username,
      
    }
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
    var url = "journal/journal"
    this.http.get(url, { id: this.entity.vchId }).subscribe({
      next: (res: any) => {
        if (res.status_cd == 1) {
          this.entity = res.data;
          this.entity.jrnApprove = this.entity.jrnApprove || <jrnApproveObj>{};
          this.entity.acc00500 = this.entity.acc00500 || <acc00500Obj>{};
          this.entity.vchDate = this.entity.vchDate ?? this.datepipe.transform(this.entity.vchDate, 'yyyy-MM-dd')

          this.entity.acc00500.createdDt = this.entity.acc00500.createdDt ?? this.datepipe.transform(this.entity.acc00500.createdDt, 'yyyy-MM-dd')
          this.entity.acc00500.modifiedDt = this.entity.acc00500.modifiedDt ?? this.datepipe.transform(this.entity.acc00500.modifiedDt, 'yyyy-MM-dd')
          this.entity.jrnApprove.approvedDt = this.entity.jrnApprove.approvedDt ?? this.datepipe.transform(this.entity.jrnApprove.approvedDt, 'yyyy-MM-dd')
          this.pastentity = Object.assign({}, this.entity);
        }
        this.spinner.hide();
      }, error: (err: any) => {
        this.spinner.hide();
        this.dialog.swal({ dialog: 'error', title: 'Error', message: err });
      }
    })
  }

  type(value: number) {
    return value === 1 ? 'Debit' : 'Credit';
  }

  newRecord() {
    this.entity = <JournalObj>{};
    this.entity.acc00500 = <acc00500Obj>{};
    this.entity.jrnApprove = <jrnApproveObj>{};
    this.entity.acc00501s = <acc00501sObj[]>[];
    this.entity.amount = 0;

    this.entity.against = 1;
   const today = new Date();
    const finYearEnd = new Date(this.provider.companyinfo.finyear.tdt);

    
    if (today >= finYearEnd) {
      this.entity.vchDate = finYearEnd.toISOString().split('T')[0];
    } else {
      this.entity.vchDate = today.toISOString().split('T')[0];
    }
    this.entity.sdt = this.provider.companyinfo.finyear.fdt ? this.provider.companyinfo.finyear.fdt.toShortString() : '';
    this.entity.edt = this.provider.companyinfo.finyear.tdt ? this.provider.companyinfo.finyear.tdt.toShortString() : '';
    this.entity.currdt = new Date().toShortString();
  }

  save() {
    this.spinner.show();
    if (!this.entity.vchId) {
     
      if (!this.entity.acc00500.createdUser)
        this.entity.acc00500.createdUser = this.provider.companyinfo.userinfo.username;
      else
        this.entity.acc00500.modifiedUser = this.provider.companyinfo.userinfo.username;

      this.http.post('journal/insert', this.master.cleanObject(this.entity, 2)).subscribe({
        next: (res: any) => {
          if (res.status_cd == 1) {

            this.entity.vchId = res.data.vchId;
            this.entity.vchNo = res.data.vchNo;
            this.entity.challanNo = res.data.challanNo;
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
      this.http.put('journal/update', this.master.cleanObject(this.entity, 2), { id: this.entity.vchId }).subscribe({
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

  getAccountDetl(obj) {
    this.rec.jrnItems.accCodeNavigation = obj;
  }

  totalRecAmt() {
    var sumArray = this.entity.acc00501s.map(item => {
      return item.amount;
    });

    var sumValue = sumArray.reduce(function (pValue, cValue) {
      return Number(pValue) + Number(cValue)

    });

    this.entity.amount = sumValue;
  }

  AddDebited() {
    if (this.rowIndex == null) {
      this.entity.acc00501s.push(this.rec.jrnItems);
    } else {

      this.entity.acc00501s[this.rowIndex] = this.rec.jrnItems;
    }

    this.rec.jrnItems = <acc00501sObj>{};
    this.totalRecAmt();
    this.rowIndex = null;
  }

  journalEdit(s) {
    this.rowIndex = this.entity.acc00501s.indexOf(s);
    this.rec.jrnItems = Object.assign({}, s);
  }

  journalDelete(s) {
    var params = {
      dialog: 'confirm',
      title: "warning",
      message: "Do You Want Delete Row",
    }
    this.dialog.swal(params).then(data => {
      if (data == true) {
        this.param = this.entity.acc00501s.indexOf(s);
        this.iConfirmFn3();
        this.totalRecAmt();
      }
    })
  }
  
  iConfirmFn3() {
    if (this.param != undefined) {
      this.entity.acc00501s.splice(this.param, 1);
      var params = {
      }
      this.dialog.swal(params);
    }
  }



}
