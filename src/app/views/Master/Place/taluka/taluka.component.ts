import { Component, CUSTOM_ELEMENTS_SCHEMA, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogsComponent } from '../../../../assets/pg/dialogs/dialogs.component';
import { MyProvider } from '../../../../assets/services/provider';
import { CommonModule, Location } from '@angular/common';
import { gridOptions, http } from '../../../../assets/services/services';
import { ActBtnComponent } from '../../../../assets/pg/btn-cell-renderer/btn-cell-renderer.component';
import { GridApi } from 'ag-grid-community';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { DssInputComponent } from '../../../../assets/mydirective/dss-input/dss-input.component';
import { MydirectiveModule } from '../../../../assets/mydirective/mydirective.module';
import { DssGridComponent } from '../../../../assets/pg/dss-grid/dss-grid.component';
import { ngselectComponent } from '../../../../assets/pg/ngselect/ngselect.component';

declare var $: any;
@Component({
  selector: 'app-taluka',
  templateUrl: './taluka.component.html',
  styleUrls: ['./taluka.component.scss'],
  imports: [FormsModule, CommonModule, ngselectComponent, NgSelectModule, DssInputComponent, MydirectiveModule, DssGridComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class TalukaComponent {
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
    this.reference.districts = [];
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


    this.columns = [{
      field: 'talukaName',
      headerName: 'Taluka Name ',
      filter: "agTextColumnFilter",
      flex: 4
    },
    {
      field: 'district.districtName',
      headerName: 'District',
      filter: "agTextColumnFilter",
      flex: 4
    },
    {
      field: 'district.stateCodeNavigation.stateName',
      headerName: 'State',
      filter: "agTextColumnFilter",
      flex: 4
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
    this.entity = {};
    $("#taluka").modal('show');

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
    this.entity.district = s.district;
    this.entity.district.stateCodeNavigation = s.district?.stateCodeNavigation;
    $("#taluka").modal('show');

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
      id: row.talukaId
    }

    this.http.delete('Taluka/delete', params).subscribe((res: any) => {
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
    $("#taluka").modal('hide');

  }
  save() {
    this.spinner.show();
    if (!this.entity.talukaId) {

      this.http.post('Taluka/insert', this.entity).subscribe({
        next: (res: any) => {
          if (res.status_cd == 1) {
            this.entity.talukaId = res.data.talukaId;
            this.gridApi.applyTransaction({ add: [this.entity] });

            this.dialog.swal({ dialog: "success", title: "Success", message: "Record is saved sucessfully" })
              .then((res: any) => {
                $("#taluka").modal('hide');
              })

          } else {
            this.dialog.swal({ dialog: "error", message: "Duplicate Taluka" });
          }


          this.spinner.hide()

        }, error: (err: any) => {
          this.spinner.hide()
          this.dialog.swal({ dialog: 'error', title: 'Error', message: "Duplicate Taluka" })
        }
      })
    }
    else {
      this.http.put('Taluka/update', this.entity, { id: this.entity.talukaId }).subscribe({
        next: (res: any) => {
          if (res.status_cd == 1) {
            this.entity.talukaId = res.data.talukaId;
            this.gridApi.applyTransaction({ update: [this.entity] });
            this.pastEntity = Object.assign({}, this.entity);
            this.dialog.swal({ dialog: "success", title: "Success", message: "Record is Update sucessfully" });
          }
          $("#taluka").modal('hide');

          this.spinner.hide()
        }, error: (err: any) => {
          this.dialog.swal({ dialog: 'error', title: 'Error', message: err })
        }
      })
    }
  }

  currentPage = 1;
  talukaParams() {
    var param = { pageNumber: this.currentPage, keys: [], pageSize: 10 }
    return param;
  }
}