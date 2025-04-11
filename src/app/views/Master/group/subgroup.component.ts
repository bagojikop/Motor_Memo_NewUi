import { Component, CUSTOM_ELEMENTS_SCHEMA, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogsComponent } from '../../../assets/pg/dialogs/dialogs.component';
import { MyProvider } from '../../../assets/services/provider';
import { CommonModule, DatePipe, Location } from '@angular/common';
import { gridOptions, http, Master } from '../../../assets/services/services';
import { ActBtnComponent } from '../../../assets/pg/btn-cell-renderer/btn-cell-renderer.component';
import { GridApi } from 'ag-grid-community';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ngselectComponent } from '../../../assets/pg/ngselect/ngselect.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { DssInputComponent } from '../../../assets/mydirective/dss-input/dss-input.component';
import { DssGridComponent } from '../../../assets/pg/dss-grid/dss-grid.component';
import { ArraySortPipe } from '../../../assets/pipes/inrcrdr.pipe';
declare const $: any;

@Component({
  selector: 'app-subgroup',
  templateUrl: './subgroup.component.html',
  styleUrls: ['./subgroup.component.scss'],
  imports: [FormsModule, CommonModule, ngselectComponent, NgSelectModule, DssInputComponent, DssGridComponent],
  providers: [DialogsComponent, Master, ArraySortPipe, DatePipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SubgroupComponent {
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
    private httpclient: HttpClient,
    private spinner: NgxSpinnerService,
    private provider: MyProvider,
    private dialog: DialogsComponent,
    private location: Location,
    public gridOption: gridOptions,
    public master: Master,
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
    this.reference.maingroup = [];
    this.stateParams = this.location.getState();
    this.mode = this.stateParams.action;
    this.innerWidth = window.innerWidth;

    this.defaultColDef = {
      sortable: true,
      floatingFilter: true,
      resizable: true,
    };


    this.columns = [{
      field: 'sgName',
      headerName: 'Group Name',
      filter: "agTextColumnFilter",
      minWidth: 200,
      flex: 6,
    },
    {
      field: 'grpCodeNavigation.grpName',
      headerName: 'Primary Group Name',
      filter: "agTextColumnFilter",
      minWidth: 200,
      flex: 6
    },

    {
      headerName: 'Action',
      cellRenderer: ActBtnComponent,
      filter: false,
      cellRendererParams: {
        onClick: this.onBtnClick1.bind(this),
      },
      minWidth: 100,
      flex: 1
    },
    ]
    this.Init();
  }
  Init() {

  }
  addNew() {
    this.entity = {};
    this.entity.srNo = 0;
    $("#group").modal('show');

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
    this.entity = s;
    this.entity.grpCodeNavigation = s.grpCodeNavigation;
    $("#group").modal('show');
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
      id: row.sgCode
    }

    this.http.delete('SubGroup/delete', params).subscribe((res: any) => {
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
    $("#group").modal('hide');

  }
  save() {
    this.spinner.show();
    if (!this.entity.sgCode) {

      this.http.post('SubGroup/insert', this.entity).subscribe({
        next: (res: any) => {
          if (res.status_cd == 1) {
            this.entity.sgCode = res.data.sgCode;
            this.gridApi.applyTransaction({ add: [this.entity] });
            this.dialog.swal({ dialog: "success", title: "Success", message: "Record is saved sucessfully" })
              .then((res: any) => {
                $("#group").modal('hide');
              })

          } else {
            this.dialog.swal({ dialog: "error", message: "Duplicate Group" });
          }


          this.spinner.hide()

        }, error: (err: any) => {
          this.spinner.hide()
          this.dialog.swal({ dialog: 'error', title: 'Error', message: "Duplicate  Group" })
        }
      })
    }
    else {
      this.http.put('SubGroup/update', this.entity, { id: this.entity.sgCode }).subscribe({
        next: (res: any) => {
          if (res.status_cd == 1) {
            this.entity.sgCode = res.data.sgCode;
            this.gridApi.applyTransaction({ update: [this.entity] });
            this.pastEntity = Object.assign({}, this.entity);
            this.dialog.swal({ dialog: "success", title: "Success", message: "Record is Update sucessfully" });
          }
          $("#group").modal('hide');

          this.spinner.hide()
        }, error: (err: any) => {
          this.dialog.swal({ dialog: 'error', title: 'Error', message: err })
        }
      })
    }
  }
}
