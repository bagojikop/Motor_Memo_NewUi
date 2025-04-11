import { Component, HostListener, NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogsComponent } from '../../../../assets/pg/dialogs/dialogs.component';
import { MyProvider } from '../../../../assets/services/provider';
import { CommonModule, Location } from '@angular/common';
import { gridOptions, http } from '../../../../assets/services/services';
import { ActBtnComponent } from '../../../../assets/pg/btn-cell-renderer/btn-cell-renderer.component';
import { GridApi } from 'ag-grid-community';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { DssGridComponent } from '../../../../assets/pg/dss-grid/dss-grid.component';
declare var $: any;
@Component({
  selector: 'app-declarationmaster',
  templateUrl: './declarationmaster.component.html',
  styleUrls: ['./declarationmaster.component.scss'],
  imports: [DssGridComponent, FormsModule, CommonModule],
  providers: [http, HttpClient, DialogsComponent, ActBtnComponent, DssGridComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class DeclarationmasterComponent {
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
    // setTimeout(() => {
    //   this.gridApi.sizeColumnsToFit();
    // }, 1000);


    this.defaultColDef = {
      sortable: true,
      floatingFilter: true,
      resizable: true,

    };

    this.columns = [

      {
        field: 'accCodeNavigation.accName',
        headerName: 'Account',
        filter: "agTextColumnFilter",
        flex: 2
      },
      {
        field: 'noOfVehicles',
        headerName: 'No of Vehicles',
        filter: "agTextColumnFilter",
        flex: 2
      },
      {
        field: 'fromDt',
        headerName: 'From Date',
        filter: "agTextColumnFilter",
        flex: 1
      },
      {
        field: 'ishuf',
        headerName: 'HUF',
        flex: 1
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
  }
  Init() {

  }
  addNew() {
    var params = {
      action: 'new'
    }
    this.router.navigate(['Declarationchild'], { state: params });
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

  edit(s: any) {
    const param = { action: 'view', id: s.declrId };
    this.router.navigate(['Declarationchild'], { state: param });
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
      id: row.declrId
    }

    this.http.delete('Declaration/delete', params).subscribe((res: any) => {
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
  close() {
    this.entity = {};
    $("#firmtype").modal('hide');

  }


}
