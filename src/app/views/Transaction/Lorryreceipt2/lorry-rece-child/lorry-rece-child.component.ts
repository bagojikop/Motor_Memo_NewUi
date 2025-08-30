import { CommonModule, DatePipe, Location } from '@angular/common';
import { http, Master, NavbarActions, transactionValid } from '../../../../assets/services/services';
import { Component, ViewChild, inject, ChangeDetectorRef, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { MyProvider } from '../../../../assets/services/provider';
import { DialogsComponent } from '../../../../assets/pg/dialogs/dialogs.component';
import { ReportDictionory } from '../../../../../../assets/service/interfaces';
import { v4 as uuidv4 } from 'uuid'
import { FormsModule, NgForm } from '@angular/forms';
declare var $: any;
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
  selector: 'app-lorry-rece-child',
  templateUrl: './lorry-rece-child.component.html',
  styleUrl: './lorry-rece-child.component.scss',
  imports: [FormsModule, CommonModule, DTFormatDirective, finDateDirective, NumberOnlyDirective, PdfReaderComponent, CurrencyMaskDirective, ngselectComponent, NgSelectModule, DssInputComponent, MydirectiveModule, NgxPaginationModule, NavactionsComponent],
  providers: [DatePipe, DialogsComponent, PdfReaderComponent, Master, ArraySortPipe, transactionValid],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LorryReceChildComponent {
  @ViewChild("lorry-receipt2") lrryRec2: NgForm;

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

  canEdit: boolean = false;

  isReceiverClicked: boolean = true;
  exp: any = {}
  isSenderClicked: boolean = true;
  SenderisClicked: boolean = true
  ReceiverisClicked: boolean = true
  parameters: any[] = [];
  motormemo2Childe: any[] = [];
  rptMode: boolean = false;
  pdfSrc: string;
  myServiceUrl: string;
  myReportDictionory: ReportDictionory = <ReportDictionory>{};
  motormemo2: any = {}
  motormemo2AdvDetl: any = {}
  pendingbilties = []
  private cd = inject(ChangeDetectorRef);

  constructor(
    public location: Location,
    public http: http,
    private dialog: DialogsComponent,
    private spinner: NgxSpinnerService,
    public provider: MyProvider,
    public navactions: NavbarActions,
    public master: Master,
  ) {
    this.entity = {};
    this.entity.motormemoBilties = []
    this.entity.motormemo2Audit = {}
    this.entity.motormemo2AdvDetails = []
    this.motormemo2AdvDetl = {}
    this.stateParams = this.location.getState();
    this.mode = this.stateParams.action;
    this.entity.vchId = this.stateParams.id;
    this.exp = {}
  }

  ngOnInit(): void {
    this.entity = {};
    this.entity.motormemoBilties = []
    this.entity.motormemo2Audit = {}
    this.pendingbilties = []
    this.entity.motormemo2AdvDetails = []
    this.motormemo2AdvDetl = {}
    this.motormemo2 = {}
    let paramss: any = this.location.getState();
    this.navactions.navaction(paramss.action);
    this.entity.vchId = paramss.id;
    this.exp = {}
    this.entity.motormemoVehExpenses = []
    if (this.entity.vchId) {
      this.navactions.fieldset = true;
      this.callbackedit();
    } else {
      this.navactions.fieldset = false;
      this.newRecord();
    }


  }


  hoveredRow?: any;

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
        this.motormemo2print()
        this.ngview = true;
        break;

      case 'close':
        this.close();
        break;
    }

  }

  onPageChange(newPage?: number): void {
    if (newPage !== this.page) {
      //@ts-ignore
      this.page = newPage;
      this.getbiltylist();
    }
  }


  motormemo2print() {
    this.myServiceUrl = "Motormemo2Report";

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

    $('#exampleModal').modal('hide');
  }

  Submit() {
    const selectedRows = this.list.filter(item => item.selected);

    if (!this.entity.motormemoBilties) {
      this.entity.motormemoBilties = [];
    }

    for (const row of selectedRows) {
      const alreadyExists = this.entity.motormemoBilties.some(r => r.biltyNo === row.biltyNo);
      if (!alreadyExists) {
        this.entity.motormemoBilties.push({ ...row });
      }
    }

    this.additinOfWeight();

    this.list.forEach(item => (item.selected = false));
    $('#detailsModal').modal('hide');
  }

  newRecord() {
    this.entity = {};
    this.entity.motormemoBilties = []
    this.motormemo2 = {}
    this.entity.motormemo2AdvDetails = []
    this.motormemo2AdvDetl = {}
    this.entity.motormemo2Audit = {}
    this.entity.motormemoVehExpenses = []
    const today = new Date();
    const finYearEnd = new Date(this.provider.companyinfo.finyear.tdt);
    this.exp = { action: 0, isInclFreight: false }

    if (today >= finYearEnd) {
      this.entity.vchDate = finYearEnd.toISOString().split('T')[0];
    } else {
      this.entity.vchDate = today.toISOString().split('T')[0];
    }
  }

  onSelectVehExp(ev) {
    this.exp.sundries = {};

    this.exp.sundries.sundryName = ev.sundryName;
    this.exp.accCodeNavigation = ev.accCodeNavigation;
  }

  onSelectVehAcc(ev) {
    this.exp.accName = ev.accName;
    this.cd.detectChanges();
  }

  edit() {
    this.navactions.navaction("view");
    this.callbackedit();
  }

  calculateAmounts() {
    this.entity.totalFreight = this.entity.totalWeight * this.entity.frtPerWeight;
  }

  calculateRemAmt() {
    this.entity.vehLeftAmount = this.entity.totalFreight - this.entity.vehAdvAmount;
  }
  getAccountDetl(obj) {
    this.motormemo2AdvDetl.accCodeNavigation = obj;
  }

  AddAdvDetl() {
    if (this.motormemo2AdvDetl.accCode && this.motormemo2AdvDetl.amount) {
      if (this.rowIndex == null) {
        this.entity.motormemo2AdvDetails.push(this.motormemo2AdvDetl);
        this.additinOfAdv()
        this.calculateRemAmt()
      }
      else {
        this.entity.motormemo2AdvDetails[this.rowIndex] = this.motormemo2AdvDetl;
        this.additinOfAdv()
        this.calculateRemAmt()
      }
      this.rowIndex = null;
      this.motormemo2AdvDetl = {}
    }
  }

  editAdvDetailrow(v, i) {
    this.rowIndex = i;
    this.calculateRemAmt()
    this.motormemo2AdvDetl = Object.assign({}, v);

  }


  callbackedit() {
    this.spinner.show();
    var url = "Motormemo2/edit"
    this.http.get(url, { id: this.entity.vchId }).subscribe({
      next: (res: any) => {
        if (res.status_cd == 1) {
          this.entity = res.data;
          this.pastentity = Object.assign({}, this.entity);

        }
        this.spinner.hide();
        this.additinOfWeight();
        this.additinOfAdv()
        this.calculateRemAmt()
      }, error: (err: any) => {
        this.spinner.hide();
        this.dialog.swal({ dialog: 'error', title: 'Error', message: err });
      }
    })
  }


  deletechildtablerow(i) {
    var params = {

      dialog: 'confirm',
      title: "warning",
      message: "Do you want to delete record"
    }
    this.dialog.swal(params).then(data => {
      if (data == true) {
        this.entity.motormemo2Childe.splice(i, 1);

        this.additinOfWeight();
      }
    })
  }



  deleteAdvDetail(i) {
    var params = {

      dialog: 'confirm',
      title: "warning",
      message: "Do you want to delete record"
    }
    this.dialog.swal(params).then(data => {
      if (data == true) {
        this.entity.motormemo2AdvDetails.splice(i, 1);

        this.additinOfAdv()
        this.calculateRemAmt()
      }
    })
  }



  save() {
    if (this.entity.totalAdvAmt > this.entity.totalFreightAmt) {
      Swal.fire({
        icon: 'warning',
        title: 'Warning',
        text: 'Total Advance amount is greater than Freight Total. Please check the values.',
      });
    }
    else {
      this.spinner.show();
      if (!this.entity.vchId) {

        this.entity.firmId = this.provider.companyinfo.company?.firm.firmCode,
          this.entity.divId = this.provider.companyinfo.company.divId;
        this.entity.motormemo2Audit.createdUser = this.provider.companyinfo.userinfo.username;


        this.http.post('Motormemo/insert', this.entity).subscribe({
          next: (res: any) => {
            if (res.status_cd == 1) {

              this.entity.vchId = res.data.vchId;

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
        this.entity.motormemo2Audit.modifiedUser = this.provider.companyinfo.userinfo.username;
        this.http.put('Motormemo2/update', this.master.cleanObject(this.entity, 2), { id: this.entity.vchId }).subscribe({
          next: (res: any) => {
            this.spinner.hide()
            if (res.status_cd == 1) {
              this.entity.vchId = res.data.vchId;
              this.additinOfWeight()
              this.additinOfAdv()
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


  additinOfWeight() {
    const sumArray = (this.entity.motormemoBilties || [])
      .map(item => item.weight || 0);

    const sumValue = sumArray.reduce((pValue, cValue) =>
      Number(pValue) + Number(cValue), 0); // initial value = 0

    this.entity.totalWeight = sumValue;
  }


  additinOfAdv() {
    const sumArray = this.entity.motormemo2AdvDetails.map(item => item.amount || 0);
    const sumValue = sumArray.reduce((p, c) => Number(p) + Number(c), 0);
    this.entity.totalAdvAmt = sumValue;

    if (this.entity.totalAdvAmt > this.entity.totalFreightAmt) {
      Swal.fire({
        icon: 'warning',
        title: 'Warning',
        text: 'Total Advance amount is greater than Freight Total. Please check the values.',
      });
    }
  }

  undo() {
    this.entity = this.pastentity;
    this.callbackedit();
  }

  close() {
    this.location.back();
  }

  selectedRow: any;
  openDetailsModal(row: any) {
    this.selectedRow = row;
    $('#detailsModal').modal('show');
  }

  totalCount: number = 0;
  list: any = []



calcVehCharges() {
  const totalCharges = this.entity.motormemoVehExpenses
    .filter(exp => exp.isInclFreight && exp.action != 2)
    .reduce((sum, exp) => sum + Number(exp.charges), 0);

  this.entity.vehAdvAmount = this.entity.motormemoVehExpenses
    .filter(exp => !exp.isInclFreight && exp.action != 2)
    .reduce((sum, exp) => sum + Number(exp.charges || 0) * (exp.action == 0 ? 1 : -1), 0);
  this.entity.vehBilledAmt = this.entity.motormemoVehExpenses
    .filter(exp => exp.action == 2)
    .reduce((sum, exp) => sum + Number(exp.charges), 0);
  this.entity.vehTotalFreight = this.entity.totalFreight - (totalCharges || 0) - (this.entity.vehBilledAmt || 0)
  this.entity.totalcharges = totalCharges + this.entity.vehAdvAmount + this.entity.vehBilledAmt;

  this.setLeftAmt();
}


setLeftAmt() {
  setTimeout(() => {

    this.entity.vehLeftAmount = (this.entity.vehTotalFreight - this.entity.vehAdvAmount).round(2);
  }, 100);
}


editExpTablerow(obj, index) {
    this.rowIndex = index;
    this.exp = Object.assign({}, obj);
  }
deleteExpTablerow(index) {
    var params = {

      dialog: 'confirm',
      title: "warning",
      message: "Do you want to delete record"
    }
    this.dialog.swal(params).then(data => {
      if (data == true) {
        this.entity.motormemoVehExpenses.splice(index, 1);
        this.calcVehCharges()
        this.setLeftAmt();
      }
    })
  }
getSelectOptionLabel(value: number): string {
    if (value == 0) {
      return 'Deduct';
    } else if (value == 1) {
      return 'Add';
    
    } else {
      return 'Unknown';
    }
  }
updateTotalVehCharges(){
  if (this.exp.s_Id && this.exp.accCode && this.exp.charges) {

    if (this.rowIndex == null) {
      this.entity.motormemoVehExpenses.push({ ...this.exp });
    } else {
      this.entity.motormemoVehExpenses[this.rowIndex] = { ...this.exp };
    }
    this.exp = { action: 0 };
    this.rowIndex = null;
    this.calcVehCharges()
  }
}
getbiltylist() {
  $('#Modal').modal('show');
  {
    var param = {
      firmCode: this.provider.companyinfo.company?.firmCode,
      div_id: this.provider.companyinfo.company.divId
    }
    this.loading = true;
    this.http.get('Bilty/pendinglists', param).subscribe({
      next: (res: any) => {
        if (res.status_cd === 1) {

          this.list = res.data
          this.loading = false;
        } else {
          this.loading = false;
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
}


}
