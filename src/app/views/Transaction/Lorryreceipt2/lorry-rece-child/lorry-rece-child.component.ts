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

@Component({
  selector: 'app-lorry-rece-child',
  templateUrl: './lorry-rece-child.component.html',
  styleUrl: './lorry-rece-child.component.scss',
  imports: [FormsModule, CommonModule, DTFormatDirective, finDateDirective, NumberOnlyDirective, PdfReaderComponent, CurrencyMaskDirective, ngselectComponent, NgSelectModule, DssInputComponent, MydirectiveModule, NgxPaginationModule, NavactionsComponent],
  providers: [DatePipe, DialogsComponent, PdfReaderComponent, Master, ArraySortPipe],
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
   pendingbilties = []
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
    this.entity = {};
    this.entity.motormemo2Childe = []
    this.entity.motormemo2Audit ={}
    this.stateParams = this.location.getState();
    this.mode = this.stateParams.action;
    this.entity.vchId = this.stateParams.id;
  }
 
  ngOnInit(): void {
    this.entity = {};
    this.entity.motormemo2Childe = []
    this.entity.motormemo2Audit ={}
    this.pendingbilties = []
    this.motormemo2 = {}
    let paramss: any = this.location.getState();
    this.navactions.navaction(paramss.action);
    this.entity.vchId = paramss.id;
    this.entity.vchDate = new Date().toShortString()
   
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
  receivclick(i) { }

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

  Submit() {
  const selectedRows = this.list.filter(item => item.selected);

  if (!this.entity.motormemo2Childe) {
    this.entity.motormemo2Childe = [];
  }

  for (const row of selectedRows) {
    const alreadyExists = this.entity.motormemo2Childe.some(r => r.biltyNo === row.biltyNo);
    if (!alreadyExists) {
      this.entity.motormemo2Childe.push({ ...row});
    }
  }

  this.additinOfWeight();

  this.list.forEach(item => (item.selected = false));
  $('#detailsModal').modal('hide');
}

  newRecord() {
    this.entity = {};
    this.entity.motormemo2Childe = []
    this.motormemo2 = {}
    this.entity.motormemo2Audit ={}
    this.entity.vchDate = new Date().toShortString()
  }

  edit() { 
    this.navactions.navaction("view");
    this.callbackedit();
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
      
      }, error: (err: any) => {
        this.spinner.hide();
        this.dialog.swal({ dialog: 'error', title: 'Error', message: err });
      }
    })
  }
deletegstTablerow(v, i) {
  const params = {
    dialog: 'confirm',
    title: "warning",
    message: "Do You Want Delete Row",
  };

  this.dialog.swal(params).then(data => {
    if (data === true) {
      this.iConfirmFn(v, i);
    }
  });
}

iConfirmFn(v, i) {
  const params = { id: v.detlId };
  this.http.delete('Motormemo2/deletechild', params).subscribe((res: any) => {
    if (res.status_cd === 1) {
      // ✅ Remove the row from the table immediately
      this.entity.motormemo2Childe.splice(i, 1);

      this.additinOfWeight();

      // ✅ Show success message
      const params = {
        dialog: 'success',
        title: "success",
        message: "Record Deleted Successfully",
      };
      this.dialog.swal(params);

    } else {
      const error = res.error?.message || "An Error has occurred while deleting the record!";
      const errorParams = {
        dialog: 'error',
        title: "Error",
        message: error,
      };
      this.dialog.swal(errorParams);
    }
  });
}

// Optional: Method to recalculate total weight
updateTotalWeight() {
  this.entity.totalWet = this.entity.motormemo2Childe
    .map(item => item.weight || 0)
    .reduce((sum, val) => sum + Number(val), 0);
}



  save() {
  
    this.spinner.show();
    if (!this.entity.vchId) {
      this.entity.firmId = this.provider.companyinfo.company?.firm.firmCode,
        this.entity.divId = this.provider.companyinfo.company.divId;
        this.entity.motormemo2Audit.createdUser = this.provider.companyinfo.userinfo.username;

      // this.motormemo2=this.entity;
      this.http.post('Motormemo2/insert', this.entity).subscribe({
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


  additinOfWeight() {
    var sumArray = this.entity.motormemo2Childe
      .map(item => item.weight || 0);


    var sumValue = sumArray.reduce(function (pValue, cValue) {
      return Number(pValue) + Number(cValue)

    });
    this.entity.totalWet = sumValue;

  }

  undo() { }
  
  close() { 
    this.location.back();
  }
  // onserchvender(){}
  selectedRow: any;
  openDetailsModal(row: any) {
    this.selectedRow = row;
    $('#detailsModal').modal('show');
  }
  onserchinput() { }
  totalCount: number = 0;

  list: any = []
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
