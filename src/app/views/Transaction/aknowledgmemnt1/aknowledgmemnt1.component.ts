import { Component } from '@angular/core';
import { CommonModule, DatePipe, Location, DecimalPipe } from '@angular/common';
import { http, Master } from '../../../assets/services/services';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { MyProvider } from '../../../assets/services/provider';
import { DialogsComponent } from '../../../assets/pg/dialogs/dialogs.component';
import { ReportDictionory } from '../../../../../assets/service/interfaces';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { DssInputComponent } from '../../../assets/mydirective/dss-input/dss-input.component';
import { ngselectComponent } from '../../../assets/pg/ngselect/ngselect.component';
import { NavactionsComponent } from '../../../assets/pg/navactions/navactions.component';
import { CurrencyMaskDirective } from "../../../assets/mydirective/currencyMask/currency-mask.directive";
import { DTFormatDirective } from '../../../assets/mydirective/mydirective.directive';
import { ArraySortPipe } from '../../../assets/pipes/inrcrdr.pipe';
import { PdfReaderComponent } from '../../../assets/pdf-reader/pdf-reader.component';
import { PdfViewerComponent, PdfViewerModule } from 'ng2-pdf-viewer';
import { GridApi, ColDef } from 'ag-grid-community';
import { AgGridModule } from 'ag-grid-angular';
import { UiSwitchModule } from 'ngx-ui-switch';
import { ActBtnComponent } from '../../../assets/pg/btn-cell-renderer/btn-cell-renderer.component';

declare var $: any;
@Component({
  selector: 'app-aknowledgmemnt1',
  templateUrl: './aknowledgmemnt1.component.html',
  styleUrl: './aknowledgmemnt1.component.scss',
  imports: [FormsModule, CommonModule, UiSwitchModule, DTFormatDirective, AgGridModule, PdfViewerModule, CurrencyMaskDirective, PdfReaderComponent, ngselectComponent, NgSelectModule, DssInputComponent, NavactionsComponent],
  providers: [DatePipe, DecimalPipe, DialogsComponent, PdfReaderComponent, Master, ArraySortPipe, PdfViewerComponent, PdfViewerModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Aknowledgmemnt1Component {
  entity: any = {};
  columns: ColDef[] = [];
  innerWidth: any;
  list: any = [];
  api: any;
  referance: any = {};
  defaultColDef: ColDef = {};
  stateParams: any;
  mode: any;
  rptMode: boolean = false;
  pdfSrc: string;
  myServiceUrl: string;
  myReportDictionory: ReportDictionory = <ReportDictionory>{};
  gridParams: any = {};
  gridColumnApi: any;
  rowIndex: any;
  exp: any = {};
  pastentity;
  motormemoExpenses: any = []
  motormemo2AdvDetl: any = {}
  private gridApi: GridApi;

  constructor(private http: http,
    private spinner: NgxSpinnerService,
    private provider: MyProvider,
    private dialog: DialogsComponent,
    private location: Location,
    private datepipe: DatePipe,
    public master: Master,
    private decimalpipe: DecimalPipe,
  ) { }

  ngOnInit(): void {
    this.entity = {};
    this.exp = {}
    this.entity.motormemoExpenses = []
    this.entity.motormemo2AdvDetails = []
    this.motormemo2AdvDetl = {}
    this.referance = {}
    this.defaultColDef = {
      sortable: true,
      floatingFilter: true,
      resizable: true,
    };
    this.stateParams = this.location.getState();
    this.mode = this.stateParams.action;
    this.innerWidth = window.innerWidth;
    this.columns = this.getColumnsForType0();
  }

  showgrid() {
    if (this.referance.aknowlType === "0") {
      this.columns = this.getColumnsForType0();
    } else {
      this.columns = this.getColumnsForType1();
    }
  }

  getColumnsForType0() {
    return [
      {
        field: 'memoNo',
        headerName: 'L.R.No',
        filter: "agTextColumnFilter",
        flex: 1,
        headerClass: "text-left",
      },
      {
        field: 'dt',
        headerName: 'Date',
        filter: "agTextColumnFilter",
        flex: 1,
        headerClass: "text-left",
        cellRenderer: (data) => {
          return this.datepipe.transform(data.value, 'dd-MM-yyyy')
        }
      },
      {
        field: 'from_Dstn',
        headerName: 'From',
        filter: "agTextColumnFilter",
        flex: 1.5,
        headerClass: "text-left",
      },
      {
        field: 'to_Dstn',
        headerName: 'To',
        filter: "agTextColumnFilter",
        flex: 1.5,
        headerClass: "text-left",
      },

      {
        field: 'weight',
        headerName: 'Weight',
        filter: "agTextColumnFilter",
        type: "rightAligned",
        flex: 1,
        minWidth: 100,
        cellStyle: { textAlign: 'end' },
        headerClass: "ag-right-aligned-header",
        cellRenderer: (data) => {
          return data.value ? this.decimalpipe.transform(data.value, '1.2-2') : '0.00';
        },
      },
      {
        field: 'totalFreight',
        headerName: 'Freight Amount',
        filter: "agTextColumnFilter",
        type: "rightAligned",
        flex: 1,
        minWidth: 100,
        cellStyle: { textAlign: 'end' },
        headerClass: "ag-right-aligned-header",
        cellRenderer: (data) => {
          return data.value ? this.decimalpipe.transform(data.value, '1.2-2') : '0.00';
        },
      },
      {
        field: 'advAmount',
        headerName: 'Adv Amount',
        filter: "agTextColumnFilter",
        type: "rightAligned",
        flex: 1,
        minWidth: 100,
        cellStyle: { textAlign: 'end' },
        headerClass: "ag-right-aligned-header",
        cellRenderer: (data) => {
          return data.value ? this.decimalpipe.transform(data.value, '1.2-2') : '0.00';
        },
      },
      {
        field: 'leftAmount',
        headerName: 'Left Amount',
        filter: "agTextColumnFilter",
        type: "rightAligned",
        flex: 1,
        minWidth: 100,
        cellStyle: { textAlign: 'end' },
        headerClass: "ag-right-aligned-header",
        cellRenderer: (data) => {
          return data.value ? this.decimalpipe.transform(data.value, '1.2-2') : '0.00';
        },
      },
      {
        headerName: 'Action',
        cellRenderer: ActBtnComponent,
        filter: false,
        cellRendererParams: {
          onClick: this.onBtnClick1.bind(this),
        },
        flex: 1
      },
    ];
  }

  getColumnsForType1() {
    return [
      {
        field: 'vchNo',
        headerName: 'L.R.No',
        filter: "agTextColumnFilter",
        flex: 1,
        headerClass: "text-left",
      },
      {
        field: 'vchDate',
        headerName: 'Date',
        filter: "agTextColumnFilter",
        flex: 1,
        headerClass: "text-left",
        cellRenderer: (data) => {
          return this.datepipe.transform(data.value, 'dd-MM-yyyy')
        }
      },
      {
        field: 'from_Dstn',
        headerName: 'From',
        filter: "agTextColumnFilter",
        flex: 1,
        headerClass: "text-left",
      },
      {
        field: 'to_Dstn',
        headerName: 'To',
        filter: "agTextColumnFilter",
        flex: 1,
        headerClass: "text-left",
      },
      {
        field: 'totalWet',
        headerName: 'Weight',
        filter: "agTextColumnFilter",
        type: "rightAligned",
        flex: 1,
        minWidth: 100,
        cellStyle: { textAlign: 'end' },
        headerClass: "ag-right-aligned-header",
        cellRenderer: (data) => {
          return data.value ? this.decimalpipe.transform(data.value, '1.2-2') : '0.00';
        },
      },
      {
        field: 'freightperWet',
        headerName: 'Freight/Weight',
        filter: "agTextColumnFilter",
        type: "rightAligned",
        flex: 1,
        minWidth: 100,
        cellStyle: { textAlign: 'end' },
        headerClass: "ag-right-aligned-header",
        cellRenderer: (data) => {
          return data.value ? this.decimalpipe.transform(data.value, '1.2-2') : '0.00';
        },
      },
      {
        field: 'freightTotal',
        headerName: 'Freight Amount',
        filter: "agTextColumnFilter",
        type: "rightAligned",
        flex: 1,
        minWidth: 100,
        cellStyle: { textAlign: 'end' },
        headerClass: "ag-right-aligned-header",
        cellRenderer: (data) => {
          return data.value ? this.decimalpipe.transform(data.value, '1.2-2') : '0.00';
        },
      },
      {
        field: 'totalAdv',
        headerName: 'Adv Amount',
        filter: "agTextColumnFilter",
        type: "rightAligned",
        flex: 1,
        minWidth: 100,
        cellStyle: { textAlign: 'end' },
        headerClass: "ag-right-aligned-header",
        cellRenderer: (data) => {
          return data.value ? this.decimalpipe.transform(data.value, '1.2-2') : '0.00';
        },
      },
      {
        field: 'remAmt',
        headerName: 'Left Amount',
        filter: "agTextColumnFilter",
        type: "rightAligned",
        flex: 1,
        minWidth: 100,
        cellStyle: { textAlign: 'end' },
        headerClass: "ag-right-aligned-header",
        cellRenderer: (data) => {
          return data.value ? this.decimalpipe.transform(data.value, '1.2-2') : '0.00';
        },
      },
      {
        headerName: 'Action',
        cellRenderer: ActBtnComponent,
        filter: false,
        cellRendererParams: {
          onClick: this.onBtnClick2.bind(this),
        },
        flex: 1
      },
    ];
  }

  updateTotalCharges(): void {
    if (this.referance.aknowlType === "0") {
      if (!this.entity.motormemoExpenses) {
        this.entity.motormemoExpenses = [];
      }
      this.exp.action = 1;
      if (this.rowIndex == null) {
        this.entity.motormemoExpenses.push(this.exp);
      }
      else {
        this.entity.motormemoExpenses[this.rowIndex] = this.exp;
      }
      this.exp = {};
      this.rowIndex = null;
      this.additintotlcharges();
    } else {
      if (!this.entity.motormemo2AdvDetails) {
        this.entity.motormemo2AdvDetails = [];
      }
      if (this.rowIndex == null) {
        this.entity.motormemo2AdvDetails.push(this.motormemo2AdvDetl);
      } else {
        this.entity.motormemo2AdvDetails[this.rowIndex] = this.motormemo2AdvDetl;
      }
      this.motormemo2AdvDetl = {};
      this.rowIndex = null;
      this.additintotlcharges();
    }
  }

  getAccountDetl(obj) {
    this.motormemo2AdvDetl.accCodeNavigation = obj;
  }

  totalAdvAmt: any = 0

  leftAmt() {
    if (this.referance.aknowlType === "0") {
      this.entity.leftAmount = this.entity.leftAmount - this.entity.totalcharges;
    } else {
      this.entity.remAmt = this.entity.remAmt - this.totalAdvAmt
    }
  }

  AdvAmount() {
    if (this.referance.aknowlType === "0") {
      this.entity.advAmount = this.entity.totalcharges + this.entity.advAmount
    } else {
      this.entity.totalAdv = this.totalAdvAmt + this.entity.totalAdv
    }
  }

  additintotlcharges() {
    if (this.referance.aknowlType === "0") {
      const sumArray = this.entity.motormemoExpenses.map(item => item.charges || 0);
      const sumValue = sumArray.reduce((p, c) => Number(p) + Number(c), 0);
      this.entity.totalcharges = sumValue;
    }
    else {
      const sumArray = this.entity.motormemo2AdvDetails.map(item => item.amount || 0);
      const sumValue = sumArray.reduce((p, c) => Number(p) + Number(c), 0);
      this.totalAdvAmt = sumValue;
    }
  }

  totalCharges: number = 0;
  calculateTotalCharges() {
    this.totalCharges = this.entity.motormemoExpenses
      .filter(exp => exp.isChecked)
      .reduce((sum, exp) => sum + Number(exp.charges), 0);

    this.calculateUncheckedTotalCharges()
  }

  uncheckedTotalCharges: number = 0
  calculateUncheckedTotalCharges() {
    this.entity.advAmount = this.entity.motormemoExpenses
      .filter(exp => !exp.isChecked)
      .reduce((sum, exp) => sum + Number(exp.charges), 0);

  }

  isAddButtonDisabled(): boolean {
    if (this.referance.aknowlType === "0") {
      if (!this.entity) {
        return true;
      }
      const totalCharges = +this.entity.totalcharges || 0;
      const leftAmount = +this.entity.leftAmount || 0;
      return totalCharges !== leftAmount;
    } else {
      if (!this.entity) {
        return true;
      }
      const totalCharges = +this.totalAdvAmt || 0;
      const leftAmount = +this.entity.remAmt || 0;
      return totalCharges !== leftAmount;
    }
  }

  editExpTablerow(obj, index) {
    if (this.referance.aknowlType === "0") {
      this.rowIndex = index;
      this.exp = Object.assign({}, obj);
      this.exp.charges = 0;
    } else {
      this.rowIndex = index;
      this.motormemo2AdvDetl = Object.assign({}, obj);
    }
  }

  deleteExpTablerow(index) {
    if (this.referance.aknowlType === "0") {
      var params = {
        dialog: 'confirm',
        title: "warning",
        message: "Do you want to delete record"
      }
      this.dialog.swal(params).then(data => {
        if (data == true) {
          this.entity.motormemoExpenses.splice(index, 1);
        }
      })
    } else {
      var params = {
        dialog: 'confirm',
        title: "warning",
        message: "Do you want to delete record"
      }
      this.dialog.swal(params).then(data => {
        if (data == true) {
          this.entity.motormemo2AdvDetails.splice(index, 1);
        }
      })
    }
  }

  onSelectExp(ev) {
    this.exp.sundries = {};
    this.exp.sundries.sundryName = ev.sundryName;
    this.exp.accCodeNavigation = ev.accCodeNavigation;
  }

  onSelectAcc(ev) {
    this.exp.accName = ev.accName;
  }

  onBtnClick1(e: any) {
    if (e.event.action === "edit") {
      this.edit(e.rowData);
    }
  }

  onBtnClick2(e: any) {
    if (e.event.action === "edit") {
      this.edit(e.rowData);
    }
  }


  edit(s: any) {
    if (this.referance.aknowlType === "0") {
      const param = { action: 'view', id: s.vchId };
      $('#exampleModal').modal('show');
      var url = "MotorMemo/PendingAmountedit"
      this.http.get(url, { id: s.vchId }).subscribe({
        next: (res: any) => {
          if (res.status_cd == 1) {
            this.entity = res.data;
            this.exp.charges = this.entity.leftAmount;
            this.entity.dt = this.datepipe.transform(this.entity.dt, 'yyyy-MM-dd')
            if (!this.entity.confDate) {
              this.entity.confDate = this.datepipe.transform(new Date(), 'yyyy-MM-dd');
            }
            this.pastentity = Object.assign({}, this.entity);
          }
          this.spinner.hide();
        }, error: (err: any) => {
          this.spinner.hide();
          this.dialog.swal({ dialog: 'error', title: 'Error', message: err });
        }
      })
    } else {
      const param = { action: 'view', id: s.vchId };
      $('#exampleModal2').modal('show');
      var url = "Motormemo2/PendingAmountedit"
      this.http.get(url, { id: s.vchId }).subscribe({
        next: (res: any) => {
          if (res.status_cd == 1) {
            this.entity = res.data;
            this.entity.vchDate = this.datepipe.transform(this.entity.vchDate, 'yyyy-MM-dd')
            if (!this.entity.confDate) {
              this.entity.confDate = this.datepipe.transform(new Date(), 'yyyy-MM-dd');
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
  }

  Listshow() {
    if (this.referance.aknowlType === "0") {
      var param = {
        firm_id: this.provider.companyinfo.company.firmCode,
        div_id: this.provider.companyinfo.company.divId,
        veh_no: this.entity.vehicleNo,
      }
      this.http.get('MotorMemo/PendingLorryRec', param).subscribe({
        next: (res: any) => {
          if (res.status_cd == 1) {
            if (res.data.length == 0) {
              this.dialog.swal({ dialog: 'Warning', title: "warning", message: "Record Not Found!" });
            } else {
              this.list = res.data || [];
            }
            this.entity.dt = this.datepipe.transform(this.entity.dt, 'yyyy-MM-dd')
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
    } else {
      var param = {
        firm_id: this.provider.companyinfo.company.firmCode,
        div_id: this.provider.companyinfo.company.divId,
        veh_no: this.entity.vehicleNo,
      }
      this.http.get('Motormemo2/PendingLorryRec', param).subscribe({
        next: (res: any) => {
          if (res.status_cd == 1) {
            if (res.data.length == 0) {
              this.dialog.swal({ dialog: 'Warning', title: "warning", message: "Record Not Found!" });
            } else {
              this.list = res.data || [];
            }
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
  }

  onGridReady(params) {
    this.api = params.api;
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  reference:any=[]
  getVehicles() {
      if (!this.entity.vehicleNo || this.entity.vehicleNo.length < 4) {
        return;
      }
  
      $('#vehiclemodal').modal('show');
  
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
    $('#vehiclemodal').modal('hide');
  }

  save() {
    if (this.referance.aknowlType === "0") {
      this.spinner.show();
      const charges = Number(this.entity.totalcharges);
      if (charges == this.entity.leftAmount) {
        this.leftAmt();
        this.AdvAmount();
        if (this.entity.vchId) {
          this.entity.firmId = this.provider.companyinfo.company?.firm.firmCode,
            this.entity.divId = this.provider.companyinfo.company.divId;
          this.entity.motormemoAudit.modifiedUser = this.provider.companyinfo.userinfo.username;

          this.http.put('MotorMemo/updatepayment', this.master.cleanObject(this.entity, 2), { id: this.entity.vchId }).subscribe({
            next: (res: any) => {
              this.spinner.hide()
              if (res.status_cd == 1) {
                this.entity.vchId = res.data.vchId;
                this.dialog.swal({ dialog: "success", title: "Success", message: "Record is Update sucessfully" });
                $('#exampleModal').modal('hide');
              } else {
                this.dialog.swal({ dialog: 'error', title: 'Error', message: res.errors.exception.InnerException.message })
              }

            }, error: (err: any) => {
              this.spinner.hide()
              this.dialog.swal({ dialog: 'error', title: 'Error', message: err.message })
            }
          })
        }

        else {
          this.dialog.swal({ dialog: 'error', title: 'Error', message: "Please Fill All The Required Fields.." })
        }
      } else {
        this.dialog.swal({ dialog: 'error', title: 'Error', message: 'Please check Charges Amount' });
        return;
      }
    } else {
      this.spinner.show();
      this.leftAmt();
      this.AdvAmount();
      if (this.entity.vchId) {

        this.entity.firmId = this.provider.companyinfo.company?.firm.firmCode,
          this.entity.divId = this.provider.companyinfo.company.divId;

        this.http.put('Motormemo2/updatepayment', this.master.cleanObject(this.entity, 2), { id: this.entity.vchId }).subscribe({
          next: (res: any) => {
            this.spinner.hide()
            if (res.status_cd == 1) {
              this.entity.vchId = res.data.vchId;

              this.dialog.swal({ dialog: "success", title: "Success", message: "Record is Update sucessfully" });
              $('#exampleModal').modal('hide');
            } else {
              this.dialog.swal({ dialog: 'error', title: 'Error', message: res.errors.exception.InnerException.message })
            }

          }, error: (err: any) => {
            this.spinner.hide()
            this.dialog.swal({ dialog: 'error', title: 'Error', message: err.message })
          }
        })
      }
      else {
        this.dialog.swal({ dialog: 'error', title: 'Error', message: "Please Fill All The Required Fields.." })
      }
    }
  }
}
