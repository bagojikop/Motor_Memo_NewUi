import { Component, CUSTOM_ELEMENTS_SCHEMA, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogsComponent } from '../../../assets/pg/dialogs/dialogs.component';
import { MyProvider } from '../../../assets/services/provider';
import { Location, DecimalPipe, CommonModule, DatePipe, } from '@angular/common';
import { gridOptions, http, Master } from '../../../assets/services/services';
import { ActBtnComponent } from '../../../assets/pg/btn-cell-renderer/btn-cell-renderer.component';
import { GridApi } from 'ag-grid-community';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { DssInputComponent } from '../../../assets/mydirective/dss-input/dss-input.component';
import { MydirectiveModule } from '../../../assets/mydirective/mydirective.module';
import { DssGridComponent } from '../../../assets/pg/dss-grid/dss-grid.component';
import { MasternavComponent } from '../../../assets/pg/masternav/masternav.component';
import { ngselectComponent } from '../../../assets/pg/ngselect/ngselect.component';
import { ArraySortPipe } from '../../../assets/pipes/inrcrdr.pipe';
declare var $: any;
import {CurrencyMaskDirective} from "../../../assets/mydirective/currencyMask/currency-mask.directive"; 

@Component({
  selector: 'app-opningbalance',
  templateUrl: './opningbalance.component.html',
  styleUrls: ['./opningbalance.component.scss'],
  imports: [FormsModule, CommonModule,CurrencyMaskDirective, ngselectComponent, NgSelectModule, DssGridComponent],
  providers: [DialogsComponent, Master, ArraySortPipe, DatePipe, DecimalPipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class OpningbalanceComponent {
  entity: any = {};
  columns: any = [];
  reference: any = {};
  frameworkComponents: any;
  list = [];
  natures;
  param: any;
  index: any;
  api: any;
  referance: any;
  defaultColDef: any;
  stateParams: any;
  pastEntity: any;
  mode: any;
  innerWidth: any;
  gridParams: any = {};
  private gridApi: GridApi;

  constructor(private http: http,
    private spinner: NgxSpinnerService,
    private provider: MyProvider,
    private dialog: DialogsComponent,
    private location: Location,
    public gridOption: gridOptions,
    private decimalpipe: DecimalPipe,
    private router: Router,) { }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
    // this.gridApi.sizeColumnsToFit();
  }

  ngOnInit(): void {
    this.entity = {};
    this.referance = {};
    this.defaultColDef = {};
    this.reference.states = [];
    this.stateParams = this.location.getState();
    this.mode = this.stateParams.action;
    this.innerWidth = window.innerWidth;


    this.defaultColDef = {
      sortable: true,
      floatingFilter: true,
      resizable: true,
    };

    this.columns = [
      {
        field: 'accCodeNavigation.accName',
        headerName: 'Account Name ',
        filter: "agTextColumnFilter",
        minWidth: 200,
        flex: 2,
        cellClass: 'text-left',
      },
      {
        field: 'crbal',
        headerName: 'Credit Amount',
        filter: "agNumberColumnFilter",
        valueParser: params => Number(params.crbal),
        cellRenderer: (data) => {
          return data.value ? this.decimalpipe.transform(data.value, '1.2-2') : '';
        },
        minWidth: 100,
        flex: 1,
        cellStyle: { textAlign: 'end' },
        headerClass: "ag-right-aligned-header",

      },
      {
        field: 'drbal',
        headerName: 'Debit Amount',
        filter: "agNumberColumnFilter",
        flex: 1,
        valueParser: params => Number(params.drbal),
        cellRenderer: (data) => {
          return data.value ? this.decimalpipe.transform(data.value, '1.2-2') : '';
        },
        cellStyle: { textAlign: 'end' },
        headerClass: "ag-right-aligned-header",
        minWidth: 100

      },

      {
        headerName: 'Action',
        cellRenderer: ActBtnComponent,
        filter: false,
        cellRendererParams: {
          onClick: this.onBtnClick1.bind(this),
        },
        minWidth: 100,
        flex: 2,
        cellStyle: { textAlign: 'end' },
        headerClass: "ag-right-aligned-header"

      },
    ]


    this.gridParams = {
      branch_id: this.provider.companyinfo.company?.branchCode,
      firm_id: this.provider.companyinfo.company?.firmCode,
      div_id: this.provider.companyinfo.company.divId,

    }
  }
  onBtnClick1(e) {
    if (e.event.action == "edit") {
      this.edit(e.rowData);
    } else {
      this.Delete(e.rowData);
    }

  }
  selectaccName(item) {
    this.entity.accCodeNavigation = item;
  }

  disableCredit(): boolean {
    return this.entity.drbal && this.entity.drbal > 0;
  }

  disableDebit(): boolean {
    return this.entity.crbal && this.entity.crbal > 0;
  }

  save() {
    if (this.entity.crbal || this.entity.drbal > 0) {
      this.spinner.show();

      if (!this.entity.vchId) {

        this.entity.branchId = this.provider.companyinfo.company?.branchCode;
        this.entity.firmId = this.provider.companyinfo.company?.firmCode;
        this.entity.divId = this.provider.companyinfo.company.divId

        this.http.post('AccOpbl/insert', this.entity).subscribe({
          next: (res: any) => {
            if (res.status_cd == 1) {


              this.entity.vchId = res.data.vchId;
              // this.entity.drbal=Number(this.entity.drbal);
              // this.entity.crbal=Number(this.entity.crbal);
              this.gridApi.applyTransaction({ add: [this.entity] });
              this.dialog.swal({ dialog: "success", title: "Success", message: "Record is saved sucessfully" })
                .then((res: any) => {
                  $("#accOpeningBal").modal('hide');
                })

            } else {
              this.dialog.swal({ dialog: "error", message: "Duplicate Account Name" });
            }


            this.spinner.hide()

          }, error: (err: any) => {
            this.spinner.hide()
            this.dialog.swal({ dialog: 'error', title: 'Error', message: "Duplicate Account Name" })
          }
        })
      }
      else {
        this.http.put('AccOpbl/update', this.entity, { id: this.entity.vchId }).subscribe({
          next: (res: any) => {
            if (res.status_cd == 1) {
              this.entity.vchId = res.data.vchId;
              this.gridApi.applyTransaction({ update: [this.entity] });
              this.pastEntity = Object.assign({}, this.entity);
              this.dialog.swal({ dialog: "success", title: "Success", message: "Record is Update sucessfully" });
            }
            $("#accOpeningBal").modal('hide');

            this.spinner.hide()
          }, error: (err: any) => {
            this.dialog.swal({ dialog: 'error', title: 'Error', message: err })
          }
        })
      }

    } else {
      this.dialog.swal({ dialog: 'error', title: 'Error', message: "Fill Debit or Credit Value" })
    }
  }
  edit(s) {
    this.entity = s;
    this.entity.accCodeNavigation = s.accCodeNavigation;
    $("#accOpeningBal").modal('show');

  }


  Delete(s) {
    var params = {
      dialog: 'confirm',
      title: "warning",
      message: "Do You Want Delete Row",

    }

    this.dialog.swal(params).then(data => {
      if (data == true) {
        this.iConfirmFn(s);
      }
    })
  }


  iConfirmFn(row) {
    var params = {
      id: row.vchId
    }

    this.http.delete('AccOpbl/delete', params).subscribe((res: any) => {
      if (res.status_cd == 1) {

        this.gridApi.applyTransaction({ remove: [row] });

        var params = {
          dialog: 'success',
          title: "success",
          message: "Record Deleted Sucessfully",

        }
        this.dialog.swal(params);
      }
      else {
        var error = "An Error has occured while deleting record!";

        if (res.error)
          if (res.error.message)
            error = res.error.message;
        var params = {
          dialog: 'error',
          title: "Error",
          message: error
        }
        this.dialog.swal(params);
      }

    });
  }



  onGridReady(params) {

    this.gridApi = params;
  }

  addNew() {
    this.entity = {};
    this.entity.drbal = 0;
    this.entity.crbal = 0;
    $("#accOpeningBal").modal('show');

  }



  close() {
    this.entity = {};
    $("#accOpeningBal").modal('hide');

  }


}