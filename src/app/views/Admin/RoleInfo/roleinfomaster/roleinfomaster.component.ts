import { Component,  NO_ERRORS_SCHEMA } from '@angular/core';
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
declare var $: any;


@Component({
  selector: 'app-roleinfomaster',
  templateUrl: './roleinfomaster.component.html',
  styleUrls: ['./roleinfomaster.component.scss'],
  imports: [DssGridComponent],
  providers: [http, HttpClient, DialogsComponent, ActBtnComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class RoleinfomasterComponent {
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
  gridOptions;
  mode: any;
  private gridApi: GridApi;
  constructor(private http: http,
    private dialog: DialogsComponent,
    private location: Location,
    public gridOption: gridOptions,
    private router: Router,) { }

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
      field: 'roleName',
      headerName: 'Designation',
      filter: "agTextColumnFilter",
      flex: 1
    },

    {
      headerName: 'Action',
      cellRenderer: ActBtnComponent,
      filter: false,
      cellRendererParams: {
        onClick: this.onBtnClick1.bind(this),
      },
      flex: 1,

    },
    ]
   
  }
  
  addNew() {
    var params = {
      action: 'new'
    }
    this.router.navigate(['/Roleinfochild'], { state: params });
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
      id: s.roleId
    };
    this.router.navigate(['/Roleinfochild'], { state: param });

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
      roleid: row.roleId
    }

    this.http.delete('RoleInfo/delete', params).subscribe((res: any) => {
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
