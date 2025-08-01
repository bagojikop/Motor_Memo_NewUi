import { CommonModule, DatePipe, Location } from '@angular/common';
import { http, Master, NavbarActions, ngselectpagination } from '../../../../assets/services/services';
import { Component, ViewChild, inject, ChangeDetectorRef, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { MyProvider } from '../../../../assets/services/provider';
import { DialogsComponent } from '../../../../assets/pg/dialogs/dialogs.component';
import { ReportDictionory } from '../../../../../../assets/service/interfaces';
import { v4 as uuidv4 } from 'uuid'
import { FormsModule, NgForm } from '@angular/forms';
declare var $: any;
import "../../../../../app/assets/services/datePrototype";
import { NgSelectModule } from '@ng-select/ng-select';
import { DssInputComponent } from '../../../../assets/mydirective/dss-input/dss-input.component';
import { MydirectiveModule } from '../../../../assets/mydirective/mydirective.module';
import { ngselectComponent } from '../../../../assets/pg/ngselect/ngselect.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { NavactionsComponent } from '../../../../assets/pg/navactions/navactions.component';
import { CurrencyMaskDirective } from '../../../../assets/mydirective/currencyMask/currency-mask.directive';
import { NumberOnlyDirective, DTFormatDirective } from '../../../../assets/mydirective/mydirective.directive';
import { finDateDirective } from '../../../../assets/mydirective/findate/findate.directive';
import { ArraySortPipe } from '../../../../assets/pipes/inrcrdr.pipe';
import { PdfReaderComponent } from '../../../../assets/pdf-reader/pdf-reader.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-transport-invochild',
  templateUrl: './transport-invochild.component.html',
  styleUrl: './transport-invochild.component.scss',
  imports: [FormsModule, CommonModule, DTFormatDirective, finDateDirective, NumberOnlyDirective, PdfReaderComponent, CurrencyMaskDirective, ngselectComponent, NgSelectModule, DssInputComponent, MydirectiveModule, NgxPaginationModule, NavactionsComponent],
  providers: [DatePipe, DialogsComponent, PdfReaderComponent, Master, ArraySortPipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TransportInvochildComponent {
  @ViewChild("biltychild") biltychild: NgForm;
  entity: any = {};
  page: number = 1;
  pageSize: number = 2;
  totalItems: number = 0;
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
  selectedVehicle: string = '';
  Orderlist: any;
  bilty: any = {}
  canEdit: boolean = false;

  isReceiverClicked: boolean = true;

  isSenderClicked: boolean = true;
  SenderisClicked: boolean = true
  ReceiverisClicked: boolean = true
  parameters: any[] = [];
  rptMode: boolean = false;
  pdfSrc: string;
  myServiceUrl: string;
  myReportDictionory: ReportDictionory = <ReportDictionory>{};
  rcmList: any[] = [];
  constructor(
    public location: Location,
    public httpp: http,
    private datepipe: DatePipe,
    private http: HttpClient,
    private dialog: DialogsComponent,
    private spinner: NgxSpinnerService,
    public provider: MyProvider,
    public ngselect: ngselectpagination,
    public navactions: NavbarActions,
    public master: Master
  ) {
    this.entity = {};
    this.entity.tms01101s = []
    this.stateParams = this.location.getState();
    this.mode = this.stateParams.action;
    this.entity.vchId = this.stateParams.id;
  }

  ngOnInit(): void {
    this.http.get<any[]>('assets/json/gstundergta.json').subscribe(data => {
      // Only include those where rcm = true
      this.rcmList = data;
    });

    this.entity.fromDt = this.datepipe.transform(this.provider.companyinfo.finyear.fdt, 'yyyy-MM-dd') ?? '';

    var x = this.datepipe.transform(new Date(), 'yyyy-MM-dd') ?? '';
    this.entity.toDt = this.provider.companyinfo.finyear.tdt >= x ? x : this.provider.companyinfo.finyear.tdt;

    this.entity.vchDt = this.provider.companyinfo.finyear.tdt >= x ? x : this.provider.companyinfo.finyear.tdt;

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
        this.Invoiceprint();
        this.ngview = true;
        break;

      case 'close':
        this.close();
        break;
    }

  }


  getstatefromAcc() {
    this.httpp.get('state/ListFromAcc', { accCode: this.entity.accCode }).subscribe({
      next: (res: any) => {
        if (res.status_cd == 1) {
          //  this.state = res.data;
          this.entity.stateCode = res.data.stateCode || null;
          this.entity.stateName = res.data.stateName || '';
          this.loading = false;
          this.statecoderelation()
          this.onRcmChange(this.selectedTransType);
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
  gstType: 'INTRA' | 'INTER' = 'INTRA';
  statecoderelation() {
    if (this.provider?.companyinfo?.company?.firm?.firmStateCode === this.entity?.stateCode) {
      this.gstType = 'INTRA'; // Same state → SGST & CGST
    } else {
      this.gstType = 'INTER'; // Different state → IGST
    }
  }

  selectedTransType: number = 0; // add this property at the class level

  onRcmChange(selectedTransType: number): void {
    this.selectedTransType = selectedTransType;

    const selected = this.rcmList.find(item => item.transType === Number(selectedTransType));
    console.log("Selected RCM:", selected);

    if (selected) {
      if (this.gstType === 'INTRA') {
        this.entity.sgstRate = selected.sRate;
        this.entity.cgstRate = selected.cRate;
        this.entity.igstRate = 0;
      } else {
        this.entity.sgstRate = 0;
        this.entity.cgstRate = 0;
        this.entity.igstRate = selected.iRate;
      }

      this.entity.sac = selected.sac;
    }

    this.gstamt();
  }

  igstAmont: number = 0
  gstamt() {
    // Reset all amounts
    this.entity.sgstAmt = 0;
    this.entity.cgstAmt = 0;
    this.entity.igstAmt = 0;
    this.entity.sgstRound = 0;
    this.entity.cgstRound = 0;
    this.entity.igstRound = 0;
    this.entity.roundOff = 0;
    let totalAmt = 0;

    if (this.selectedTransType.toString() === "1") {
      this.entity.sgstRound = (this.entity.grossAmt * this.entity.sgstRate) / 100;
      this.entity.cgstRound = (this.entity.grossAmt * this.entity.cgstRate) / 100;

      this.entity.sgstAmt = Math.round(this.entity.sgstRound);
      this.entity.cgstAmt = Math.round(this.entity.cgstRound);

      totalAmt = this.entity.grossAmt; // Only gross, no GST
    } else {
      if (this.gstType === 'INTRA') {
        this.entity.sgstRound = (this.entity.grossAmt * this.entity.sgstRate) / 100;
        this.entity.cgstRound = (this.entity.grossAmt * this.entity.cgstRate) / 100;

        this.entity.sgstAmt = Math.round(this.entity.sgstRound);
        this.entity.cgstAmt = Math.round(this.entity.cgstRound);

        totalAmt = this.entity.grossAmt + this.entity.sgstAmt + this.entity.cgstAmt;
      } else if (this.gstType === 'INTER') {
        this.entity.igstRound = (this.entity.grossAmt * this.entity.igstRate) / 100;

        this.entity.igstAmt = Math.round(this.entity.igstRound);
        totalAmt = this.entity.grossAmt + this.entity.igstAmt;
      }

    }

    const roundedNetAmt = Math.round(totalAmt);
    this.entity.roundOff = Number((roundedNetAmt - totalAmt).toFixed(2));
    this.entity.netAmt = roundedNetAmt;
    this.entity.totalAmt = totalAmt;
  }

  additinOfFreight() {
    var sumArray = this.entity.tms01101s
      .map(item => item.billAmt || 0);

    var sumValue = sumArray.reduce(function (pValue, cValue) {
      return Number(pValue) + Number(cValue)

    });
    this.entity.grossAmt = sumValue;
    this.gstamt()
  }

  Listshow() {
    //   const selectedTransType = this.entity.transType; // or any other correct property
    // this.onRcmChange(selectedTransType);
    var param = {
      firm_id: this.provider.companyinfo.company.firmCode,
      div_id: this.provider.companyinfo.company.divId,
      accCode: this.entity.accCode,
      fdt: this.entity.fromDt,
      tdt: this.entity.toDt
    }
    this.httpp.get('MotorMemo/PendingBilled', param).subscribe({
      next: (res: any) => {
        if (res.status_cd == 1) {
          if (res.data.length == 0) {
            this.dialog.swal({ dialog: 'Warning', title: "warning", message: "Record Not Found!" });
          }
          else {
            this.entity.tms01101s = res.data || [];
          }

          this.additinOfFreight();

        } else {

          this.dialog.swal({ dialog: 'error', title: 'Error', message: res.errors.message });
        }

        this.spinner.hide();
      },
      error: (err: any) => {
        this.spinner.hide();
        this.dialog.swal({ dialog: 'error', title: 'Error', message: err.message });
      }
    })
  }

  callbackedit() {
    this.spinner.show();
    var url = "TransportInvoice/edit"
    this.httpp.get(url, { id: this.entity.vchId }).subscribe({
      next: (res: any) => {
        if (res.status_cd == 1) {
          this.entity = res.data;
          if (this.entity.vchDt) {
            this.entity.vchDt = this.datepipe.transform(this.entity.vchDt, 'yyyy-MM-dd');
          }
          if (this.entity.fromDt) {
            this.entity.fromDt = this.datepipe.transform(this.entity.fromDt, 'yyyy-MM-dd');
          }
          if (this.entity.toDt) {
            this.entity.toDt = this.datepipe.transform(this.entity.toDt, 'yyyy-MM-dd');
          }

          this.pastentity = Object.assign({}, this.entity);
        }
        this.spinner.hide();

      }, error: (err: any) => {
        this.spinner.hide();
        this.dialog.swal({ dialog: 'error', title: 'Error', message: err });
      }
    })
  }

  deletegstTablerow(i) {

    var params = {

      dialog: 'confirm',
      title: "warning",
      message: "Do you want to delete record"
    }
    this.dialog.swal(params).then(data => {
      if (data == true) {
        this.entity.tms01101s.splice(i, 1);

        this.additinOfFreight()

      }
    })

  }


  newRecord() {
    this.entity = {};
    this.entity.tms01101s = []
    this.entity.fromDt = this.datepipe.transform(this.provider.companyinfo.finyear.fdt, 'yyyy-MM-dd') ?? '';
    const today = new Date();
    const finYearEnd = new Date(this.provider.companyinfo.finyear.tdt);
    if (today >= finYearEnd) {
      this.entity.vchDt = finYearEnd.toISOString().split('T')[0];
      this.entity.toDt = finYearEnd.toISOString().split('T')[0];
    } else {
      this.entity.vchDt = today.toISOString().split('T')[0];
      this.entity.toDt = today.toISOString().split('T')[0];
    }
  }


  edit() {
    this.navactions.navaction("view");
    this.callbackedit();
  }


  save() {
    if (!this.entity.vchId) {
      this.entity.firmId = this.provider.companyinfo.company?.firmCode;
      this.entity.divId = this.provider.companyinfo.company.divId
      // if (!this.entity.contraAudit.createdUser)
      //   this.entity.contraAudit.createdUser = this.provider.companyinfo.userinfo.username;
      // else
      //   this.entity.contraAudit.modifiedUser = this.provider.companyinfo.userinfo.username;

      this.httpp.post('TransportInvoice/insert', this.master.cleanObject(this.entity, 2)).subscribe({
        next: (res: any) => {
          if (res.status_cd == 1) {

            this.entity.vchId = res.data.vchId;
            this.entity.vchNo = res.data.vchNo;
            this.entity.billNo = res.data.billNo;
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
      this.httpp.put('TransportInvoice/update', this.master.cleanObject(this.entity, 2), { id: this.entity.vchId }).subscribe({
        next: (res: any) => {

          if (res.status_cd == 1) {
            this.entity.vchId = res.data.vchId;
            this.entity.vchNo = res.data.vchNo;
            this.entity.billNo = res.data.billNo;

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
  undo() {
    this.entity = this.pastentity;
    this.callbackedit();
  }
  Invoiceprint() {
    this.myServiceUrl = "TransInvoiceReport";

    this.myReportDictionory = {
      reportCacheId: uuidv4(),
      reportParams: [
        {
          key: "vch_id", value: this.entity.vchId,
        },
        {
          key: "firm_id", value: this.provider.companyinfo.company?.firmCode,
        },
      ]
    };
    this.rptMode = true;
  }
  close() {
    this.location.back();
  }
}
