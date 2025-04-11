import { Component, NO_ERRORS_SCHEMA, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogsComponent } from '../../../../assets/pg/dialogs/dialogs.component';
import { MyProvider } from '../../../../assets/services/provider';
import { Location } from '@angular/common';
import { gridOptions, http } from '../../../../assets/services/services';
import { ActBtnComponent } from '../../../../assets/pg/btn-cell-renderer/btn-cell-renderer.component';
import { GridApi } from 'ag-grid-community';
import { debounceTime } from 'rxjs/operators';
import { fromEvent } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { DssGridComponent } from '../../../../assets/pg/dss-grid/dss-grid.component';

declare var $: any;

@Component({
  selector: 'app-sender-receiver',
  templateUrl: './sender-receiver.component.html',
  styleUrls: ['./sender-receiver.component.scss'],
  imports: [DssGridComponent],
  providers: [http, HttpClient, DialogsComponent, ActBtnComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class SenderReceiverComponent implements OnInit {
  entity: any = {};
  columns: any = [];
  innerWidth: any;
  frameworkComponents: any;
  list = [];
  natures: any;
  param: any;
  index: any;
  api: any;
  referance: any;
  defaultColDef: any;
  stateParams: any;

  mode: any;
  private gridApi: GridApi;

  constructor(
    private http: http,
    private spinner: NgxSpinnerService,
    private provider: MyProvider,
    private dialog: DialogsComponent,
    private location: Location,
    public gridOption: gridOptions,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.entity = {};
    this.referance = {};
    this.defaultColDef = {};
    this.stateParams = this.location.getState();
    this.mode = this.stateParams.action;
    this.innerWidth = window.innerWidth;

    // Debounce resize event and only call `sizeColumnsToFit` if `gridApi` is defined
    fromEvent(window, 'resize')
      .pipe(debounceTime(100))
      .subscribe(() => {
        if (this.gridApi) {
          // this.gridApi.sizeColumnsToFit();
        }
      });

    this.defaultColDef = {
      sortable: true,
      floatingFilter: true,
      resizable: true,
    };

    this.columns = [
      { field: 'name', headerName: 'Vendor Name', filter: "agTextColumnFilter", flex: 2 },
      { field: 'accCodeNavigation.accName', headerName: 'Account Name', filter: "agTextColumnFilter", flex: 3 },
      { field: 'address', headerName: 'Address', filter: "agTextColumnFilter", flex: 2 },
      { field: 'mobileNo', headerName: 'Mobile No', filter: "agTextColumnFilter", flex: 2 },
      // { field: 'sgCodeNavigation.sgName', headerName: 'State', filter: "agTextColumnFilter", flex: 2 },

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

    this.Init();
  }

  Init() {

  }

  addNew() {
    const params = { action: 'new' };
    this.router.navigate(['/venderChild'], { state: params });
  }

  onGridReady(params: any) {
    this.gridApi = params;
    if (this.gridApi) {
      // this.gridApi.sizeColumnsToFit();
      this.Init();
    }
  }

  onBtnClick1(e: any) {
    if (e.event.action === "edit") {
      this.edit(e.rowData);
    } else {
      this.Delete(e.rowData);
    }
  }

  edit(s: any) {
    const param = { action: 'view', id: s.id };
    this.router.navigate(['/venderChild'], { state: param });
  }


  Delete(s: any) {
    const params = {
      dialog: 'confirm',
      title: "warning",
      message: "Do You Want Delete Row",
    };
    this.dialog.swal(params).then(data => {
      if (data === true) {
        this.iConfirmFn(s);
      }
    });
  }

  iConfirmFn(row: any) {
    const params = { id: row.id };
    this.http.delete('Vendor/delete', params).subscribe((res: any) => {
      if (res.status_cd === 1) {
        this.gridApi.applyTransaction({ remove: [row] });
        const successParams = {
          dialog: 'success',
          title: "success",
          message: "Record Deleted Successfully",
        };
        this.dialog.swal(successParams);
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
}

