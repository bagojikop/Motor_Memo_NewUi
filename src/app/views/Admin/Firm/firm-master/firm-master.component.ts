import { Component, HostListener, NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogsComponent } from '../../../../assets/pg/dialogs/dialogs.component';
import { MyProvider } from '../../../../assets/services/provider';
import { Location } from '@angular/common';
import { gridOptions, http } from '../../../../assets/services/services';
import { ActBtnComponent } from '../../../../assets/pg/btn-cell-renderer/btn-cell-renderer.component';
import { GridApi } from 'ag-grid-community';
import { HttpClient } from '@angular/common/http';
import { DssGridComponent } from '../../../../assets/pg/dss-grid/dss-grid.component';

@Component({
  selector: 'app-firm-master',
  templateUrl: './firm-master.component.html',
  styleUrls: ['./firm-master.component.scss'],
  imports: [DssGridComponent],
  providers: [http, HttpClient, DialogsComponent, ActBtnComponent, DssGridComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class FirmMasterComponent {
  entity: any = {};
  columns: any = [];
  innerWidth: any;
  frameworkComponents: any;
  list = [];
  natures;
  param: any;
  index: any;
  api: any;
  referance: any;
  defaultColDef: any;
  stateParams: any;

  mode: any;
  private gridApi: GridApi;
  constructor(private http: http,
    private spinner: NgxSpinnerService,
    private provider: MyProvider,
    private dialog: DialogsComponent,
    private location: Location,
    public gridOption: gridOptions,
    private router: Router,) { }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
    this.gridApi.sizeColumnsToFit();

  }
  ngOnInit(): void {
    this.entity = {};
    this.referance = {};
    this.defaultColDef = {};
    this.stateParams = this.location.getState();
    this.mode = this.stateParams.action;
    this.innerWidth = window.innerWidth;
    setTimeout(() => {
      this.gridApi.sizeColumnsToFit();
    }, 1000);

    this.defaultColDef = {
      sortable: true,
      floatingFilter: true,
      resizable: true,

    };

    this.columns = [{
      field: 'firmCode',
      headerName: 'Code',
      filter: "agTextColumnFilter",
      maxWidth: 300,
      flex: 2,
      cellClass: 'text-left',
      headerClass: 'text-left',
    },
    {
      field: 'firmName',
      headerName: 'Trade Name',
      filter: "agTextColumnFilter",
      maxWidth: 900,
      flex: 2,
      cellClass: 'text-left',
      headerClass: 'text-left',
    },
    {
      field: 'firmAlias',
      headerName: 'Alias',
      filter: "agTextColumnFilter",
      maxWidth: 400,
      flex: 2,
      cellClass: 'text-left',
      headerClass: 'text-left',
    },
    {
      field: 'mst00603.stateName',
      headerName: 'State',
      filter: "agTextColumnFilter",
      maxWidth: 400,
      flex: 2,
      cellClass: 'text-left',
      headerClass: 'text-left',
    },
    {
      field: 'firmPlace',
      headerName: 'Place',
      filter: "agTextColumnFilter",
      maxWidth: 400,
      flex: 2,
      cellClass: 'text-left',
      headerClass: 'text-left',
    },

    {
      headerName: 'Action',

      cellRenderer: ActBtnComponent,
      filter: false,
      cellRendererParams: {
        onClick: this.onBtnClick1.bind(this),
      },
      maxWidth: 300,
      flex: 2,
      cellClass: 'text-left',
      headerClass: 'text-left',

    },
    ]
    this.Init();
  }
  Init() {

  }
  addNew() {
    var params = {
      action: 'new'
    }
    this.router.navigate(['/FirmChild'], { state: params });
  }
  onGridReady(params) {

    this.gridApi = params;
  }
  onBtnClick1(e) {
    if (e.event.action == "edit") {
      this.edit(e.rowData);
    } else {
      this.Delete(e.rowData);
    }

  }
  edit(s) {
    var param = {
      action: 'view',
      id: s.firmCode
    };
    this.router.navigate(['/FirmChild'], { state: param });
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
      firm_code: row.firmCode
    }

    this.http.delete('Firm/delete', params).subscribe((res: any) => {
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
}
