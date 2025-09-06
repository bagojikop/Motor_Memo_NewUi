import { Component, HostListener, NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { DialogsComponent } from '../../../../assets/pg/dialogs/dialogs.component';
import { MyProvider } from '../../../../assets/services/provider';
import { DatePipe, DecimalPipe, Location } from '@angular/common';
import { gridOptions, http } from '../../../../assets/services/services';
import { ActBtnComponent } from '../../../../assets/pg/btn-cell-renderer/btn-cell-renderer.component';
import { GridApi } from 'ag-grid-community';
import { HttpClient } from '@angular/common/http';
import { DssGridComponent } from '../../../../assets/pg/dss-grid/dss-grid.component';
declare var $: any;
import "../../../../../app/assets/services/datePrototype";

@Component({
  selector: 'app-journalmaster',
  templateUrl: './journalmaster.component.html',
  styleUrls: ['./journalmaster.component.scss'],
  imports: [DssGridComponent],
  providers: [http, HttpClient, DialogsComponent, ActBtnComponent, DatePipe, DecimalPipe],
  schemas: [NO_ERRORS_SCHEMA]
})
export class JournalmasterComponent {
  entity: any = {};
  columns: any = [];
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
  innerWidth: any;
  private gridApi: GridApi;
  gridParams: any = {};
  constructor(private http: http,
    private provider: MyProvider,
    private dialog: DialogsComponent,
    private location: Location,
    private router: Router,
    private decimalpipe: DecimalPipe,
    public gridOption: gridOptions,
    private datepipe: DatePipe,) { }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
 

  }
  ngOnInit(): void {
    this.entity = {};
    this.referance = {};
    this.defaultColDef = {};
    this.stateParams = this.location.getState();
    this.mode = this.stateParams.action;
    this.innerWidth = window.innerWidth;
  
    this.defaultColDef = {
      sortable: true,
      floatingFilter: true,
      resizable: true,

    };



    this.columns = [{
      field: 'vchDate',
      headerName: 'Date',
      filter: "agTextColumnFilter",
      flex: 2,
      cellRenderer: (data) => {
        return this.datepipe.transform(data.value, 'dd-MM-yyyy')
      }
    },
    {
      field: 'challanNo',
      headerName: 'Challan No',
      filter: "agTextColumnFilter",
      flex: 3
    },
    {
      field: 'accName',
      headerName: 'Account',
      filter: "agTextColumnFilter",
      flex: 5
    },
    {
      field: 'amount',
      headerName: 'Amount',
      filter: "agTextColumnFilter",
      flex: 2,
      type: "rightAligned",
      cellRenderer: (data) => {
        return data.value ? this.decimalpipe.transform(data.value, '1.2-2') : '';    
      }
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
    ]
    this.Init();
    this.gridParams = { 
      isApproval: "false",
    }
  }
  Init() {

  }
  addNew() {
    var params = {
      action: 'new',
      isDoc: true
    }
    this.router.navigate(['Journalchild'], { state: params });
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
      id: s.vchId,
      isDoc: true
    };
    this.router.navigate(['Journalchild'], { state: param });

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
    this.http.delete('journal/delete', params).subscribe((res: any) => {
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
