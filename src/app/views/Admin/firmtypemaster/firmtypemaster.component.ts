import { Component, HostListener, NO_ERRORS_SCHEMA } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogsComponent } from '../../../assets/pg/dialogs/dialogs.component';
import { CommonModule, Location } from '@angular/common';
import { gridOptions, http } from '../../../assets/services/services';
import { ActBtnComponent } from '../../../assets/pg/btn-cell-renderer/btn-cell-renderer.component';
import { GridApi } from 'ag-grid-community';
import { HttpClient } from '@angular/common/http';
import { DssInputComponent } from '../../../assets/mydirective/dss-input/dss-input.component';
import { DssGridComponent } from '../../../assets/pg/dss-grid/dss-grid.component';
import { FormsModule } from '@angular/forms';

declare var $: any;
@Component({
  selector: 'app-firmtypemaster',
  templateUrl: './firmtypemaster.component.html',
  styleUrls: ['./firmtypemaster.component.scss'],
  imports: [DssGridComponent, FormsModule, CommonModule, DssInputComponent],
  providers: [http, HttpClient, DialogsComponent, ActBtnComponent, DssGridComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class FirmtypemasterComponent {
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
    private dialog: DialogsComponent,
    private location: Location,
    public gridOption: gridOptions,
    ) { }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
   
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



    this.columns = [{
      field: 'ftName',
      headerName: 'Firm Type',
      filter: "agTextColumnFilter",
      flex: 11
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
    
  }
 
  addNew() {
    this.entity = {};
    $("#firmtype").modal('show');
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
    $("#firmtype").modal('show');
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
      id: row.ftId
    }

    this.http.delete('FirmType/delete', params).subscribe((res: any) => {
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
  save() {
    this.spinner.show();
    if (!this.entity.ftId) {

      this.http.post('FirmType/insert', this.entity).subscribe({
        next: (res: any) => {
          if (res.status_cd == 1) {

            this.entity.ftId = res.data.ftId;
            this.gridApi.applyTransaction({ add: [this.entity] });
            this.dialog.swal({ dialog: "success", title: "Success", message: "Record is saved sucessfully" })
              .then((res: any) => {
                $("#firmtype").modal('hide');
              })

          } else {
            this.dialog.swal({ dialog: "error", message: res.errors.message });
          }


          this.spinner.hide()

        }, error: (err: any) => {
          this.spinner.hide()
          this.dialog.swal({ dialog: 'error', title: 'Error', message: err.message })
        }
      })
    }
    else {
      this.http.put('FirmType/update', this.entity, { id: this.entity.ftId }).subscribe({
        next: (res: any) => {
          if (res.status_cd == 1) {
            this.entity.ftId = res.data.ftId;
            this.gridApi.applyTransaction({ update: [this.entity] });
            this.pastEntity = Object.assign({}, this.entity);
            this.dialog.swal({ dialog: "success", title: "Success", message: "Record is Update sucessfully" });
          }
          $("#firmtype").modal('hide');

          this.spinner.hide()
        }, error: (err: any) => {
          this.dialog.swal({ dialog: 'error', title: 'Error', message: err })
        }
      })
    }
  }

}
