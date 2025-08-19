import { CommonModule, DatePipe, Location } from '@angular/common';
import { http, Master, NavbarActions } from '../../../../assets/services/services';
import { Component, ViewChild, inject, ChangeDetectorRef, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { MyProvider } from '../../../../assets/services/provider';
import { DialogsComponent } from '../../../../assets/pg/dialogs/dialogs.component';
import { ReportDictionory } from '../../../../../../assets/service/interfaces';
import { v4 as uuidv4 } from 'uuid'
import { FormsModule, NgForm } from '@angular/forms';
import { SubconsigneeObj, MotormemoAuditObj, MotormemoDetailsObj, Acc003sObj } from '../../../../assets/datatypests/motorchild';
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
import Swal from 'sweetalert2';

@Component({
  selector: 'app-motorchild',
  templateUrl: './motorchild.component.html',
  styleUrls: ['./motorchild.component.scss'],
  imports: [FormsModule, CommonModule, DTFormatDirective, finDateDirective, NumberOnlyDirective, PdfReaderComponent, CurrencyMaskDirective, ngselectComponent, NgSelectModule, DssInputComponent, MydirectiveModule, NgxPaginationModule, NavactionsComponent],
  providers: [DatePipe, DialogsComponent, PdfReaderComponent, Master, ArraySortPipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MotorchildComponent {
  @ViewChild("motorchild") motorchild: NgForm;
  entity: SubconsigneeObj;
  page: number = 1;
  pageSize: number = 15;
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
  canEdit: boolean = false;
  isReceiverClicked: boolean = true;
  isSenderClicked: boolean = true;
  SenderisClicked: boolean = true
  ReceiverisClicked: boolean = true

  private cd = inject(ChangeDetectorRef);

  constructor(
    public location: Location,
    public http: http,
    private datepipe: DatePipe,
    private dialog: DialogsComponent,
    private spinner: NgxSpinnerService,
    public provider: MyProvider,
    public navactions: NavbarActions,
    public master: Master
  ) {
    this.entity = <SubconsigneeObj>{};
    this.stateParams = this.location.getState();
    this.mode = this.stateParams.action;
    this.entity.vchId = this.stateParams.id;
  }
  cmod: any = {};
  exp: any = {};
  other: any = {};
  payment: any = {};
  recPayment: any = {}

  freightTypeList: any = [];
  ngOnInit(): void {

    setInterval(() => {
      this.windowrespo();
    }, 1000)

    this.entity = <SubconsigneeObj>{};
    this.entity.motormemoAudit = <MotormemoAuditObj>{};
    this.entity.motormemoDetails = <MotormemoDetailsObj>{};
    this.entity.acc003s = <Acc003sObj>{};
    this.entity.motormemoCommodities = []
    this.entity.totalcharges = 0;
    this.entity.motormemoExpenses = [];
    this.entity.motormemoOtherCharges = [];
    this.entity.motormemoPayments = [];
    this.entity.motormemoRecPayments = [];
    this.exp = { action: 0 };

    this.freightTypeList = [
      {
        "id": 0,
        "name": "Paid"
      },
      {
        "id": 1,
        "name": "To Pay"
      },
      {
        "id": 2,
        "name": "To Way Build"
      }
    ]


    let paramss: any = this.location.getState();
    this.navactions.navaction(paramss.action);
    this.entity.vchId = paramss.id;

    this.reference = []
    if (this.entity.vchId) {
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
    this.other = {}
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
        this.motormemoprint();
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

  motormemoprint() {
    this.myServiceUrl = "MetormemoReport";

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
  editgstTablerow(obj, index) {
    this.rowIndex = index;
    this.cmod = Object.assign({}, obj);
  }
  editExpTablerow(obj, index) {
    this.rowIndex = index;
    this.exp = Object.assign({}, obj);
  }
  getAccountDetl(obj) {
    this.payment.accCodeNavigation = obj;
  }

  getrecAccountDetl(obj) {
    this.recPayment.accCodeNavigation = obj;
  }

  AddAdvDetl() {
    if (this.payment.accCode && this.payment.amount) {
      if (this.rowIndex == null) {
        this.entity.motormemoPayments.push(this.payment);
        this.additinOfpaymnet()
        // this.calculateRemAmt()
      }
      else {
        this.entity.motormemoPayments[this.rowIndex] = this.payment;
        this.additinOfpaymnet()
        // this.calculateRemAmt()
      }
      this.rowIndex = null;
      this.payment = {}
    }
  }

  AddRecDetl() {
    if (this.recPayment.accCode && this.recPayment.amount) {
      if (this.rowIndex == null) {
        this.entity.motormemoRecPayments.push(this.recPayment);
        this.additinOfRecpaymnet()
        // this.calculateRemAmt()
      }
      else {
        this.entity.motormemoRecPayments[this.rowIndex] = this.recPayment;
        this.additinOfRecpaymnet()
        // this.calculateRemAmt()
      }
      this.rowIndex = null;
      this.recPayment = {}
    }
  }



  editAdvDetailrow(v, i) {
    this.rowIndex = i;
    //this.calculateRemAmt()
    this.payment = Object.assign({}, v);
  }

  editRecDetailrow(v, i) {
    this.rowIndex = i;
    //this.calculateRemAmt()
    this.recPayment = Object.assign({}, v);
  }


  deleteAdvDetail(i) {
    var params = {

      dialog: 'confirm',
      title: "warning",
      message: "Do you want to delete record"
    }
    this.dialog.swal(params).then(data => {
      if (data == true) {
        this.entity.motormemoPayments.splice(i, 1);

        this.additinOfpaymnet()
        // this.calculateRemAmt()
      }
    })
  }

  deleteRecDetail(i) {
    var params = {

      dialog: 'confirm',
      title: "warning",
      message: "Do you want to delete record"
    }
    this.dialog.swal(params).then(data => {
      if (data == true) {
        this.entity.motormemoRecPayments.splice(i, 1);

        this.additinOfRecpaymnet()
        // this.calculateRemAmt()
      }
    })
  }


  additinOfpaymnet() {
    const sumArray = this.entity.motormemoPayments.map(item => item.amount || 0);
    const sumValue = sumArray.reduce((p, c) => Number(p) + Number(c), 0);
    this.entity.senderTotalAmt = sumValue;

    if (this.entity.senderTotalAmt > this.entity.totaldebitadd) {
      Swal.fire({
        icon: 'warning',
        title: 'Warning',
        text: 'Please Check Total Sender Amount',
      });
    }
  }

  additinOfRecpaymnet() {
    const sumArray = this.entity.motormemoRecPayments.map(item => item.amount || 0);
    const sumValue = sumArray.reduce((p, c) => Number(p) + Number(c), 0);
    this.entity.recTotalAmt = sumValue;

    if (this.entity.recTotalAmt > this.entity.totaldebitadd) {
      Swal.fire({
        icon: 'warning',
        title: 'Warning',
        text: 'Please Check Total Receiver Amount.',
      });
    }
  }

  totalAmtCalc() {
    if ((this.entity.senderTotalAmt = this.entity.motormemoDetails.senderAmount) && (this.entity.recTotalAmt = this.entity.motormemoDetails.receiverAmount))
      this.entity.totalAmt = Number(this.entity.senderTotalAmt) + Number(this.entity.recTotalAmt);
  }

  deletegstTablerow(index) {

    var params = {

      dialog: 'confirm',
      title: "warning",
      message: "Do you want to delete record"
    }
    this.dialog.swal(params).then(data => {
      if (data == true) {
        this.entity.motormemoCommodities.splice(index, 1);
      }
    })
  }

  deleteExpTablerow(index) {
    var params = {

      dialog: 'confirm',
      title: "warning",
      message: "Do you want to delete record"
    }
    this.dialog.swal(params).then(data => {
      if (data == true) {
        this.entity.motormemoExpenses.splice(index, 1);
        this.calculateTotalCharges()
        this.totalRecAmt();
      }
    })
  }


  addgstTablerow() {
    if (this.cmod.commodity && this.cmod.uom && this.cmod.qty && this.cmod.chrgWeight && this.cmod.actWeight && this.cmod.rate && this.cmod.freight) {

      if (this.rowIndex == null) {
        this.entity.motormemoCommodities.push(this.cmod);
      }
      else {
        this.entity.motormemoCommodities[this.rowIndex] = this.cmod;
      }

      this.cmod = {};
      this.rowIndex = null;
      this.additinOfFreight()
      this.totalDebit()
      if (this.entity.motormemoDetails.receiverAmount > 0 && this.entity.motormemoDetails.senderAmount == 0) {
        this.disablePaymentFields = true;
        this.disableRecPaymentFields = false;
      } else if (this.entity.motormemoDetails.senderAmount > 0 && this.entity.motormemoDetails.receiverAmount == 0) {
        this.disableRecPaymentFields = true;
        this.disablePaymentFields = false;
      } else {
        this.disableRecPaymentFields = false;
        this.disablePaymentFields = false;
      }
    }
  }
  addExpTablerow() {
    if (this.rowIndex == null) {
      this.entity.motormemoExpenses.push(this.exp);
    }
    else {
      this.entity.motormemoExpenses[this.rowIndex] = this.exp;
    }
    this.exp = {};
    this.rowIndex = null;
    this.totalRecAmt();
    this.exp = { action: 0 };
  }

  onSelectExp(ev) {
    this.exp.sundries = {};

    this.exp.sundries.sundryName = ev.sundryName;
    this.exp.accCodeNavigation = ev.accCodeNavigation;
  }

  onSelectAcc(ev) {

    this.exp.accName = ev.accName;
    this.cd.detectChanges();
  }

  onSelectotherExpacc(ev) {
    this.other.sundries = {}

    this.other.sundries.sundryName = ev.sundryName;

    this.other.accCodeNavigation = ev.accCodeNavigation;


  }

  onSelecotheracc(ev) {

    this.other.accCodeNavigation.accName = ev.accName;
  }


  // callbackedit() {
  //   this.spinner.show();
  //   var url = "MotorMemo/edit"
  //   this.http.get(url, { id: this.entity.vchId }).subscribe({
  //     next: (res: any) => {
  //       if (res.status_cd == 1) {
  //         this.entity = res.data;

  //         if (this.entity.directPaid == true) {
  //           this.disablePaymentFields = true;

  //         }



  //         this.entity.motormemoAudit = this.entity.motormemoAudit || <MotormemoAuditObj>{};
  //         this.entity.acc003s = this.entity.acc003s || <Acc003sObj>{};
  //         this.entity.motormemoDetails = this.entity.motormemoDetails || <MotormemoDetailsObj>{};

  //         this.entity.motormemoAudit.createdDt = this.entity.motormemoAudit.createdDt ?? this.datepipe.transform(this.entity.motormemoAudit.createdDt, 'yyyy-MM-dd')
  //         this.entity.motormemoAudit.modifiedDt = this.entity.motormemoAudit.modifiedDt ?? this.datepipe.transform(this.entity.motormemoAudit.modifiedDt, 'yyyy-MM-dd');

  //         this.pastentity = Object.assign({}, this.entity);
  //       }
  //       this.spinner.hide();
  //       this.additinOfFreight();
  //       this.totalRecAmt();
  //       this.additinOftotalchages()


  //       this.isReceiverClicked = false;
  //       this.isSenderClicked = false;
  //       this.SenderisClicked = false
  //       this.ReceiverisClicked = false
  //     }, error: (err: any) => {
  //       this.spinner.hide();
  //       this.dialog.swal({ dialog: 'error', title: 'Error', message: err });
  //     }
  //   })
  // }

  isEditMode = false;

  callbackedit() {
    this.spinner.show();
    let url = "MotorMemo/edit";
    this.http.get(url, { id: this.entity.vchId }).subscribe({
      next: (res: any) => {
        if (res.status_cd == 1) {
          this.entity = res.data;
          this.isEditMode = true;   // mark edit mode ON

          if (this.entity.directPaid) {
            this.disablePaymentFields = true;
          }

          this.entity.motormemoAudit = this.entity.motormemoAudit || <MotormemoAuditObj>{};
          this.entity.acc003s = this.entity.acc003s || <Acc003sObj>{};
          this.entity.motormemoDetails = this.entity.motormemoDetails || <MotormemoDetailsObj>{};

          this.entity.motormemoAudit.createdDt = this.datepipe.transform(this.entity.motormemoAudit.createdDt, 'yyyy-MM-dd') ?? this.entity.motormemoAudit.createdDt;
          this.entity.motormemoAudit.modifiedDt = this.datepipe.transform(this.entity.motormemoAudit.modifiedDt, 'yyyy-MM-dd') ?? this.entity.motormemoAudit.modifiedDt;

          this.pastentity = Object.assign({}, this.entity);
        }
        this.spinner.hide();
        this.additinOfFreight();
        this.totalRecAmt();
        this.additinOftotalchages();
        this.isReceiverClicked = false;
        this.isSenderClicked = false;
        this.SenderisClicked = false;
        this.ReceiverisClicked = false;
      },
      error: (err: any) => {
        this.spinner.hide();
        this.dialog.swal({ dialog: 'error', title: 'Error', message: err });
      }
    })
  }
  data: any = {}
  save() {
    this.totalAmtCalc()
    this.additinOfRecpaymnet()
    this.additinOfpaymnet()

    if (this.entity.motormemoPayments?.length > 0
      && this.entity.totalAmt !== this.entity.totalFreight) {
      this.dialog.swal({ dialog: "confirm", title: "Warning", message: "Please Check Total Payment Amount" });
    } else {
      Object.keys(this.motorchild.form.controls).forEach(key => {
        const control = this.motorchild.form.controls[key];
        if (control.invalid) {
          console.log(`Invalid Field: ${key}`, control.errors);
        }
      });
      this.additinOfpaymnet()
      this.spinner.show();
      if (!this.entity.vchId) {
        if (!this.entity.motormemoAudit.createdUser)
          this.entity.motormemoAudit.createdUser = this.provider.companyinfo.userinfo.username;

        this.entity.firmId = this.provider.companyinfo.company?.firm.firmCode,
          this.entity.divId = this.provider.companyinfo.company.divId;

        this.http.post('MotorMemo/insert', this.master.cleanObject(this.entity, 2)).subscribe({
          next: (res: any) => {
            if (res.status_cd == 1) {
              this.additinOfpaymnet()
              this.onFreightOrDirectPaidChange()

              this.entity.vchId = res.data.vchId;

              if (!this.entity.motormemoAudit) {
                this.entity.motormemoAudit = <MotormemoAuditObj>{};
              }
              if (!this.entity.motormemoDetails) {
                this.entity.motormemoDetails = <MotormemoDetailsObj>{};
              }

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
        this.entity.firmId = this.provider.companyinfo.company?.firm.firmCode,
          this.entity.divId = this.provider.companyinfo.company.divId;
        this.entity.motormemoAudit.modifiedUser = this.provider.companyinfo.userinfo.username;

        this.http.put('MotorMemo/update', this.master.cleanObject(this.entity, 2), { id: this.entity.vchId }).subscribe({
          next: (res: any) => {
            this.spinner.hide()
            if (res.status_cd == 1) {
              this.onFreightOrDirectPaidChange()
              this.entity.vchId = res.data.vchId;
              if (!this.entity.motormemoAudit) {
                this.entity.motormemoAudit = <MotormemoAuditObj>{};
              }
              if (!this.entity.motormemoDetails) {
                this.entity.motormemoDetails = <MotormemoDetailsObj>{};
              }

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


  }

  account(index) {
    this.reference.subdealars.accName = index.accName;
  }

  close() {
    this.location.back();
  }
  newRecord() {
    this.pastentity = JSON.parse(JSON.stringify(this.entity))

    this.entity = <SubconsigneeObj>{};
    this.entity.motormemoAudit = <MotormemoAuditObj>{};
    this.entity.motormemoDetails = <MotormemoDetailsObj>{};
    this.entity.motormemoCommodities = [];
    this.entity.motormemoExpenses = [];
    this.entity.motormemoOtherCharges = [];
    this.entity.motormemoPayments = [];
    this.entity.motormemoRecPayments = [];
    this.entity.memoNo = 0;
    this.entity.freightType = 0;
    this.entity.totalcharges = 0;
    this.entity.directPaid = false;
    const today = new Date();
    const finYearEnd = new Date(this.provider.companyinfo.finyear.tdt);


    if (today >= finYearEnd) {
      this.entity.dt = finYearEnd.toISOString().split('T')[0];
    } else {
      this.entity.dt = today.toISOString().split('T')[0];
    }
  }

  edit() {
    this.navactions.navaction("view");
    this.callbackedit();
  }

  undo() {
    this.entity = this.pastentity;
    this.callbackedit();
  }

  getSelectOptionLabel(value: number): string {
    if (value == 0) {
      return 'Deduct';
    } else if (value == 1) {
      return 'Add';
    } else if (value == 2) {
      return 'Billed';
    } else {
      return 'Unknown';
    }
  }

  disablePaymentFields: boolean = false;
  disableRecPaymentFields: boolean = false;

  // onFreightOrDirectPaidChange() {
  //   if ((this.entity.freightType === 0 || this.entity.freightType === 1) && this.entity.directPaid) {
  //     if (this.entity.motormemoPayments && this.entity.motormemoPayments.length > 0) {
  //       var url = "";
  //       if (this.entity.motormemoDetails.senderAmount > 0 ) {
  //         url = "MotorMemo/DeletePaymentsByVchId";
  //         this.disableRecPaymentFields = true
  //       } else if (this.entity.motormemoDetails.receiverAmount > 0) {
  //         url = "MotorMemo/DeleteRecPayments";
  //       } else {
  //         this.disablePaymentFields = true;
  //         this.disableRecPaymentFields = true;
  //       }


  //       if ((this.entity.motormemoPayments.some(p => p.vchId === Number(this.entity.vchId))) || this.entity.motormemoRecePayments.some(p => p.vchId === Number(this.entity.vchId))) {
  //         this.http.delete(url, { vchId: this.entity.vchId }).subscribe({
  //           next: (res: any) => {
  //             if (res.status_cd === 1) {

  //               this.entity.motormemoPayments = [];
  //               this.additinOfpaymnet()
  //               this.additinOfRecpaymnet();

  //             } else {
  //               this.dialog.swal({ dialog: 'error', title: 'Error', message: res.errors?.exception?.Message || "Delete failed" });
  //             }
  //           },
  //           error: (err: any) => {
  //             this.dialog.swal({ dialog: 'error', title: 'Error', message: err });
  //           }
  //         });
  //       } else {
  //         this.entity.motormemoPayments = [];
  //         this.entity.motormemoRecePayments = [];
  //         this.additinOfpaymnet()
  //       }
  //     } else
  //       this.disablePaymentFields = true;
  //     this.disableRecPaymentFields = true;
  //   } else {

  //     this.disablePaymentFields = false;
  //     this.disableRecPaymentFields = true;
  //   }
  // }

  onFreightOrDirectPaidChange() {
    if ((this.entity.freightType === 0 || this.entity.freightType === 1) && this.entity.directPaid) {
      let senderUrl = "";
      let receiverUrl = "";

      if (this.entity.motormemoDetails.senderAmount > 0 && this.entity.motormemoDetails.receiverAmount === 0 && this.entity.motormemoPayments.length > 0) {
        senderUrl = "MotorMemo/DeletePaymentsByVchId";
        this.disableRecPaymentFields = true;
      }

      if (this.entity.motormemoDetails.receiverAmount > 0 && this.entity.motormemoDetails.senderAmount === 0 && this.entity.motormemoRecPayments.length > 0) {
        receiverUrl = "MotorMemo/DeleteRecPayments";
      }

      // case when both are > 0
      if (this.entity.motormemoDetails.senderAmount > 0 && this.entity.motormemoDetails.receiverAmount > 0 && this.entity.motormemoPayments.length > 0 && this.entity.motormemoRecPayments.length > 0) {
        senderUrl = "MotorMemo/DeletePaymentsByVchId";
        receiverUrl = "MotorMemo/DeleteRecPayments";
      }

      // execute both calls if needed
      if (senderUrl) {
        this.callDeleteApi(senderUrl);
      }
      if (receiverUrl) {
        this.callDeleteApi(receiverUrl);
      }

    } else {
      this.disablePaymentFields = true;
      this.disableRecPaymentFields = true;
    }

  }

  private callDeleteApi(url: string) {
    if ((this.entity.motormemoPayments.some(p => p.vchId === Number(this.entity.vchId)))
      || (this.entity.motormemoRecPayments.some(p => p.vchId === Number(this.entity.vchId)))) {

      this.http.delete(url, { vchId: this.entity.vchId }).subscribe({
        next: (res: any) => {
          if (res.status_cd === 1) {
            this.entity.motormemoPayments = [];
            this.entity.motormemoRecPayments = [];
            this.additinOfpaymnet();
            this.additinOfRecpaymnet();
          } else {
            this.dialog.swal({ dialog: 'error', title: 'Error', message: res.errors?.exception?.Message || "Delete failed" });
          }
        },
        error: (err: any) => {
          this.dialog.swal({ dialog: 'error', title: 'Error', message: err });
        }
      });
    } else {
      this.entity.motormemoPayments = [];
      this.entity.motormemoRecPayments = [];
      this.additinOfpaymnet();
      this.additinOfRecpaymnet();
    }
  }

  getVehicles() {
    if (!this.entity.vehicleNo || this.entity.vehicleNo.length < 4) {
      return;
    }

    $('#exampleModal').modal('show');

    var param = {
      PageNumber: 1,
      PageSize: 10,
      Keys: [{ key: 'vehicleNo', value: this.entity.vehicleNo || 0 }]
    }

    this.http.post('Vehicle/vehiclelist', param).subscribe({
      next: (res: any) => {
        if (res.status_cd == 1) {
          this.reference = res.data;

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

  onRowClick(v) {
    this.entity.vehicleNo = v.vehicleNo;
    this.entity.oweraccount = v.accCodeNavigation;
    $('#exampleModal').modal('hide');
  }

  totalRecAmt() {
    var sumArray = this.entity.motormemoExpenses.map(item => {
      return item.charges;
    });


    var sumValue = sumArray.length > 0 ? sumArray.reduce(function (pValue, cValue) {
      return Number(pValue) + Number(cValue);
    }, 0) : 0;

    this.entity.totalcharges = sumValue || 0;
    this.totalcreditamount()
  }

  calculateFreight() {
    const weight = this.cmod.chrgWeight || 0;
    const rate = this.cmod.rate || 0;
    this.cmod.freight = weight * rate;
  }

  additinOfFreight() {
    var sumArray = this.entity.motormemoCommodities
      .map(item => item.freight || 0);


    var sumValue = sumArray.reduce(function (pValue, cValue) {
      return Number(pValue) + Number(cValue)

    });
    this.entity.TotalFreight = sumValue;
    this.totalDebit()
  }


  updateTotalCharges(): void {

    if (this.exp.s_Id && this.exp.accCode && this.exp.charges) {

      const chargeValue = Number(this.exp.charges) || 0;

      if (this.exp.action == 1) {
        this.entity.totalcharges += chargeValue;
      } else if (this.exp.action == 0) {
        this.entity.totalcharges -= chargeValue;
      } else if (this.exp.action == 2) {
        this.entity.billAmt = (this.entity.billAmt || 0) + chargeValue;
      }

      if (this.rowIndex == null) {
        this.entity.motormemoExpenses.push({ ...this.exp });

      } else {
        this.entity.motormemoExpenses[this.rowIndex] = { ...this.exp };

      }

      this.exp = { action: 0 };
      this.rowIndex = null;
      this.totalcreditamount()
      this.totalAmt();
      this.calculateTotalCharges()

    }
  }

  totalCharges: number = 0;
  calculateTotalCharges() {
    this.totalCharges = this.entity.motormemoExpenses
      .filter(exp => exp.isChecked)
      .reduce((sum, exp) => sum + Number(exp.charges), 0);
    this.freightAmountsum()
    this.calculateUncheckedTotalCharges()
  }
  uncheckedTotalCharges: number = 0
  calculateUncheckedTotalCharges() {
    this.entity.advAmount = this.entity.motormemoExpenses
      .filter(exp => !exp.isChecked)
      .reduce((sum, exp) => sum + Number(exp.charges), 0);

  }

  freightAmountsum() {
    this.entity.totalFreight = this.entity.TotalFreight - this.totalCharges
  }

  totalAmt(): void {
    this.entity.totalcharges = this.entity.motormemoExpenses.reduce(
      (sum, item) => sum + (item.action == 1 ? Number(item.charges) : -Number(item.charges)),
      0
    );
  }
  Senderfuncion() {

    $('#SenderModal').modal('show');
    this.commanfunction();
  }

  receiverfuncion() {

    $('#Modal').modal('show');
    this.commanfunction();
  }

  totalCount: number = 0;

  commanfunction() {
    var param = {
      PageNumber: this.page || 1,
      PageSize: this.pageSize,
      Keys: []
    };

    this.reference = [];

    this.http.post('Vendor/getList', param).subscribe({
      next: (res: any) => {
        if (res.status_cd === 1) {
          this.reference = res.data;
          this.filteredSenders = this.reference
          if (res.pageDetails) {
            this.totalItems = res.pageDetails.totalItems;
            this.totalCount = res.pageDetails.totalCount;
          }
        } else {
          this.dialog.swal({ dialog: 'error', title: 'Error', message: res.errors.exception.Message });
        }
        this.spinner.hide();
      },
      error: (err: any) => {
        this.spinner.hide();
        this.dialog.swal({ dialog: 'error', title: 'Error', message: err.message });
      }
    });
  }

  onserchinput: string
  filteredSenders = [];



  onserchvender() {
    var param = {
      PageNumber: this.page || 1,
      PageSize: this.pageSize,
      Keys: [{
        key: 'name', value: this.onserchinput
      }]
    };

    this.reference = [];

    this.http.post('Vendor/getList', param).subscribe({
      next: (res: any) => {
        if (res.status_cd === 1) {
          this.reference = res.data;
          this.filteredSenders = this.reference
          if (res.pageDetails) {
            this.totalItems = res.pageDetails.totalItems;
            this.totalCount = res.pageDetails.totalCount;
          }
        } else {
          this.dialog.swal({ dialog: 'error', title: 'Error', message: res.errors.exception.Message });
        }
        this.spinner.hide();
      },
      error: (err: any) => {
        this.spinner.hide();
        this.dialog.swal({ dialog: 'error', title: 'Error', message: err.message });
      }
    });
  }

  receivclick(v) {
    this.entity.motormemoDetails.receiverName = v.name;
    this.entity.motormemoDetails.receiverMobileNo = v.mobileNo
    this.entity.motormemoDetails.receiverGstin = v.gstinNo
    this.entity.motormemoDetails.receiverAddress = v.address
    this.entity.motormemoDetails.receiverPin = v.pincode
    this.entity.receiverStateId = v.state
    this.entity.motormemoDetails.receiverMail = v.emailId
    this.entity.receiveraccout = v?.accCodeNavigation

    this.isReceiverClicked = false;
    this.ReceiverisClicked = false
    $('#Modal').modal('hide');
  }

  Senderclick(v) {
    this.entity.motormemoDetails.senderName = v.name
    this.entity.motormemoDetails.senderGstin = v.gstinNo
    this.entity.motormemoDetails.senderMobileNo = v.mobileNo
    this.entity.motormemoDetails.senderAddress1 = v.address
    this.entity.motormemoDetails.senderMail = v.emailId
    this.entity.senderStateId = v.state
    this.entity.motormemoDetails.senderPin = v.pincode
    this.entity.senderaccount = v?.accCodeNavigation


    this.isSenderClicked = false;
    this.SenderisClicked = false
    $('#SenderModal').modal('hide');
  };



  sendergstinfun() {

    this.http.get('Vendor/GstinbyInfo', {
      gstin: this.entity.motormemoDetails.senderGstin || "",
      mobileno: this.entity.motormemoDetails.senderMobileNo || "",
    }).subscribe({
      next: (res: any) => {
        if (res.status_cd == 1) {

          if (res.data) {
            this.SenderisClicked = false
            this.isSenderClicked = false;
            this.entity.motormemoDetails.senderGstin = res.data.gstinNo ||= {};
            this.entity.motormemoDetails.senderMobileNo = res.data.mobileNo
            this.entity.motormemoDetails.senderName = res.data.name
            this.entity.motormemoDetails.senderAddress1 = res.data.address
            this.entity.motormemoDetails.senderPin = res.data.pincode
            this.entity.senderStateId = res.data.state ||= {};
            this.entity.motormemoDetails.senderMail = res.data.emailId;
            this.entity.senderaccount = res.data?.accCodeNavigation
          } else {

            this.SenderisClicked = true
            this.isSenderClicked = true;


          }
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

  Recevergstin() {


    this.http.get('Vendor/GstinbyInfo', {
      gstin: this.entity.motormemoDetails.receiverGstin || "",
      mobileno: this.entity.motormemoDetails.receiverMobileNo || "",


    }).subscribe({
      next: (res: any) => {
        if (res.status_cd == 1) {
          if (res.data) {
            this.isReceiverClicked = false;
            this.ReceiverisClicked = false;
            this.entity.motormemoDetails.receiverGstin = res.data.gstinNo;
            this.entity.motormemoDetails.receiverMobileNo = res.data.mobileNo;
            this.entity.motormemoDetails.receiverName = res.data.name;
            this.entity.motormemoDetails.receiverAddress = res.data.address;
            this.entity.motormemoDetails.receiverPin = res.data.pincode;
            this.entity.receiverStateId = res.data.state;
            this.entity.motormemoDetails.receiverMail = res.data.emailId;
            this.entity.receiveraccout = res.data?.accCodeNavigation;
          } else {
            this.isReceiverClicked = true;
            this.ReceiverisClicked = true;


          }
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

  onPageChange(newPage?: number): void {
    if (newPage !== this.page) {
      //@ts-ignore
      this.page = newPage;
      this.commanfunction();
    }
  }

  SenderSavefun() {
    this.dialog.swal({
      dialog: 'confirm',
      title: 'Confirm Save',
      message: 'Do you want to save this record?',
    }).then((result: any) => {
      if (result) {
        const venderData = {
          name: this.entity.motormemoDetails.senderName,
          gstinNo: this.entity.motormemoDetails.senderGstin,
          mobileNo: this.entity.motormemoDetails.senderMobileNo,
          address: this.entity.motormemoDetails.senderAddress1,
          pincode: this.entity.motormemoDetails.senderPin,
          StateCode: this.entity.motormemoDetails.senderStateId,
          emailId: this.entity.motormemoDetails.senderMail,
          accCode: null,
          createdUser: this.provider.companyinfo.userinfo.username,
          createdDt: new Date().toISOString(),
        };

        this.http.post('Vendor/insert', venderData).subscribe({
          next: (res: any) => {
            if (res.status_cd == 1) {
              this.dialog.swal({ dialog: "success", title: "Success", message: "Record is saved successfully" });
              this.SenderisClicked = false
            }
          },
          error: (err: any) => {
            this.spinner.hide();
            this.dialog.swal({ dialog: 'error', title: 'Error', message: err.message });
          }
        });
      }
    });
  }



  ReceiverSavefun() {

    this.dialog.swal({
      dialog: 'confirm',
      title: 'Confirm Save',
      message: 'Do you want to save this record?',
    }).then((result: any) => {

      if (result) {
        const venderData = {
          name: this.entity.motormemoDetails.receiverName,
          gstinNo: this.entity.motormemoDetails.receiverGstin,
          mobileNo: this.entity.motormemoDetails.receiverMobileNo,
          address: this.entity.motormemoDetails.receiverAddress,
          pincode: this.entity.motormemoDetails.receiverPin,
          stateCode: this.entity.motormemoDetails.receiverStateId,
          emailId: this.entity.motormemoDetails.receiverMail,
          ewayNo: this.entity.motormemoDetails.ewayNo,
          createdUser: this.provider.companyinfo.userinfo.username,
          createdDt: new Date().toISOString(),
        };

        this.http.post('Vendor/insert', venderData).subscribe({
          next: (res: any) => {
            if (res.status_cd == 1) {

              this.dialog.swal({ dialog: "success", title: "Success", message: "Record is saved successfully" });
              this.ReceiverisClicked = false
            }
            this.spinner.hide();
          },
          error: (err: any) => {

            this.spinner.hide();
            this.dialog.swal({
              dialog: 'error',
              title: 'Error',
              message: err.message
            });
          }
        });
      }
    }).catch((error: any) => {
      console.error("Dialog error:", error);
    });
  }

  otherdataAdd() {
    if (this.other.otherchag && this.other.s_Id) {
      if (this.rowIndex == null) {
        this.entity.motormemoOtherCharges.push(this.other);
        this.additinOftotalchages()
      }
      else {
        this.entity.motormemoOtherCharges[this.rowIndex] = this.other;
        this.additinOftotalchages()
      }
      this.rowIndex = null;
      this.other = {}
    }
  }


  deleteOtherTablerow(index) {
    var params = {

      dialog: 'confirm',
      title: "warning",
      message: "Do you want to delete record"
    }
    this.dialog.swal(params).then(data => {
      if (data == true) {
        this.entity.motormemoOtherCharges.splice(index, 1);

        this.additinOftotalchages()
      }
    })
  }

  editOtherTablerow(obj, index) {
    this.rowIndex = index;
    this.other = Object.assign({}, obj);
    this.additinOftotalchages()
  }

  additinOftotalchages() {
    var sumArray = this.entity.motormemoOtherCharges.map(item => {
      return item.otherchag;
    });


    if (sumArray.length > 0) {
      var sumValue = sumArray.reduce(function (pValue, cValue) {
        return Number(pValue) + Number(cValue)

      });
    } else {
      sumValue = 0;
    }
    this.entity.totalothercharges = sumValue;
    this.totalDebit()
  }

  activeTab: string = 'sender'; // default tab

  setTab(tab: string) {
    this.activeTab = tab;

    if (this.entity.motormemoDetails.receiverAmount > 0 && this.entity.motormemoDetails.senderAmount > 0) {
      if (this.entity.directPaid == false) {
        this.disableRecPaymentFields = false;
        this.disablePaymentFields = false;
      }else{
        this.disableRecPaymentFields = true;
        this.disablePaymentFields = true;
      }
    }
  }

  // totalDebit() {
  //   this.entity.totaldebitadd = Number(this.entity.totalothercharges || 0) + Number(this.entity.TotalFreight);
  //   this.entity.motormemoDetails.senderAmount = this.entity.totaldebitadd;
  //   this.calculateAmounts()
  // }

  totalDebit() {
    this.entity.totaldebitadd = Number(this.entity.totalothercharges || 0) + Number(this.entity.TotalFreight);

    if (!this.isEditMode) {
      // only assign senderAmount in create/new mode
      this.entity.motormemoDetails.senderAmount = this.entity.totaldebitadd;
    }

    this.calculateAmounts();
  }

  calculateAmounts() {
    let total = this.entity.totaldebitadd || 0;


    if (this.entity.freightType == 0 || this.entity.freightType == 2) {

      this.entity.motormemoDetails.senderAmount = total;
      this.entity.motormemoDetails.receiverAmount = 0;
    } else if (this.entity.freightType == 1) {

      this.entity.motormemoDetails.receiverAmount = total;
      this.entity.motormemoDetails.senderAmount = 0;
    }
    if (this.entity.motormemoDetails.receiverAmount > 0 && this.entity.motormemoDetails.senderAmount == 0 && this.entity.directPaid == false) {
      this.disablePaymentFields = true;
      this.disableRecPaymentFields = false;
    } else if (this.entity.motormemoDetails.senderAmount > 0 && this.entity.motormemoDetails.receiverAmount == 0 && this.entity.directPaid == false) {
      this.disableRecPaymentFields = true;
      this.disablePaymentFields = false;
    }
    else if ((this.entity.freightType == 2 && this.entity.motormemoDetails.receiverAmount == 0 && this.entity.directPaid == true) || this.entity.directPaid == true) {
      this.disableRecPaymentFields = true;
      this.disablePaymentFields = true;
    }
    else if (this.entity.motormemoDetails.receiverAmount > 0 && this.entity.motormemoDetails.senderAmount > 0) {
      if (this.entity.directPaid == false) {
        this.disableRecPaymentFields = false;
        this.disablePaymentFields = false;
      }else{
        this.disableRecPaymentFields = true;
        this.disablePaymentFields = true;
      }

    }
  }
  OnchangeDebitAm() {
    this.entity.motormemoDetails.receiverAmount = (this.entity.totaldebitadd || 0) - this.entity.motormemoDetails.senderAmount
    if (this.entity.motormemoDetails.receiverAmount > 0 && this.entity.motormemoDetails.senderAmount == 0) {
      this.disablePaymentFields = true;
      this.disableRecPaymentFields = false;
    } else if (this.entity.motormemoDetails.senderAmount > 0 && this.entity.motormemoDetails.receiverAmount == 0) {
      this.disableRecPaymentFields = true;
      this.disablePaymentFields = false;
    }
    else if (this.entity.motormemoDetails.receiverAmount > 0 && this.entity.motormemoDetails.senderAmount > 0) {
      this.disableRecPaymentFields = false;
      this.disablePaymentFields = false;
    }
  }

  totalcreditamount() {
    setTimeout(() => {
      this.entity.leftAmount = 0;
      this.entity.leftAmount = (this.entity.totalFreight - this.entity.advAmount).round(2);
    }, 100);

  }
  debittoamt() {
    if (this.entity.motormemoDetails.receiverAmount == 0) {
      this.entity.motormemoDetails.senderAmount = this.entity.totaldebitadd;
    }

  }

  Vehiclenotab() {
    this.http.get('Vehicle/vehiclebyInfo', {
      vehicleno: this.entity.vehicleNo,
    }).subscribe({
      next: (res: any) => {
        if (res.status_cd == 1) {

          this.entity.vehicleNo = res.data.vehicleNo;
          this.entity.vehAccCode = res.data.accCodeNavigation;

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

  moveToNext(event: any, nextElement: HTMLButtonElement) {
    if (event) {
      setTimeout(() => nextElement?.focus(), 10);
    }
  }


  isDirectChecked: boolean = false;

  onCheckboxChange(event: any) {
    this.isDirectChecked = event.target.checked;

    if (this.isDirectChecked == true) {
      this.disablePaymentFields = true;
      this.exp = { action: 2 };
      this.entity.motormemoExpenses = this.entity.motormemoExpenses.filter(exp => Number(exp.action) !== 1 && Number(exp.action) !== 0);
    } else if (this.isDirectChecked == false) {
      this.disablePaymentFields = false;
      this.exp = { action: 0 };
    }
    this.calculateTotalCharges()
    this.totalRecAmt();



  }


}