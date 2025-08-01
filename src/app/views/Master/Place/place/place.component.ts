import { Component, CUSTOM_ELEMENTS_SCHEMA, HostListener } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogsComponent } from '../../../../assets/pg/dialogs/dialogs.component';
import { CommonModule, Location } from '@angular/common';
import { gridOptions, http, Master } from '../../../../assets/services/services';
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
  selector: 'app-place',
  templateUrl: './place.component.html',
  styleUrls: ['./place.component.scss'],
  imports: [FormsModule, CommonModule, ngselectComponent, NgSelectModule, DssInputComponent, MydirectiveModule, DssGridComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PlaceComponent {
  entity: any = {};
  reference: any = {};
  columns: any = [];
  pastEntity: any;
  frameworkComponents: any;


  list = [];
  natures;
  param: any;
  index: any;
  api: any;
  referance: any;
  defaultColDef: any;
  stateParams: any;
  innerWidth: any;
  mode: any;
  private gridApi: GridApi;
  constructor(private http: http,
    private spinner: NgxSpinnerService,
    private dialog: DialogsComponent,
    private location: Location,
    public gridOption: gridOptions,
    public master: Master,
    ) { }


  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
   
  }
  ngOnInit(): void {
    this.entity = {};
    this.referance = {};
    this.defaultColDef = {};
    this.reference.taluka = [];
    this.stateParams = this.location.getState();
    this.mode = this.stateParams.action;
    this.innerWidth = window.innerWidth;
  

    this.defaultColDef = {
      sortable: true,
      floatingFilter: true,
      resizable: true,
    };


    this.columns = [{
      field: 'cityName',
      headerName: 'Place',
      filter: "agTextColumnFilter",
      flex: 2
    },
    {
      field: 'taluka.talukaName',
      headerName: 'Taluka',
      filter: "agTextColumnFilter",
      flex: 2
    },
    {
      field: 'taluka.district.districtName',
      headerName: 'District',
      filter: "agTextColumnFilter",
      flex: 2
    },
    {
      field: 'taluka.district.stateCodeNavigation.stateName',
      headerName: 'State',
      filter: "agTextColumnFilter",
      flex: 2
    },
    {
      field: 'cityPin',
      headerName: 'Pin Code',
      filter: "agTextColumnFilter",
      flex: 1
    },

    {
      headerName: 'Action',
      cellRenderer: ActBtnComponent,
      filter: false,
      cellStyle: { textAlign: 'end' },
      headerClass: "ag-right-aligned-header",
      cellRendererParams: {
        onClick: this.onBtnClick1.bind(this),
      },
      flex: 2
    },
    ]
    this.Init();
  }
  Init() {

  }
  addNew() {
    this.entity = {};
    $("#place").modal('show');

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
    if (s) {
      this.entity = s;
      this.entity.taluka = s.taluka;
      
    }
    $("#place").modal('show');

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
      id: row.cityId
    }

    this.http.delete('Place/delete', params).subscribe((res: any) => {
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
    $("#place").modal('hide');

  }
  save() {
    this.spinner.show();
    if (!this.entity.cityId) {

      this.http.post('Place/insert', this.entity).subscribe({
        next: (res: any) => {
          if (res.status_cd == 1) {
            this.entity.cityId = res.data.cityId;
            this.gridApi.applyTransaction({ add: [this.entity] });
            this.dialog.swal({ dialog: "success", title: "Success", message: "Record is saved sucessfully" })
              .then((res: any) => {
                $("#place").modal('hide');
              })

          } else {
            this.dialog.swal({ dialog: "error", message: "Duplicate Place" });
          }


          this.spinner.hide()

        }, error: (err: any) => {
          this.spinner.hide()
          this.dialog.swal({ dialog: 'error', title: 'Error', message: "Duplicate Place" })
        }
      })
    }
    else {
      this.http.put('Place/update', this.entity, { id: this.entity.cityId }).subscribe({
        next: (res: any) => {
          if (res.status_cd == 1) {
            this.entity.cityId = res.data.cityId;
            this.gridApi.applyTransaction({ update: [this.entity] });
            this.pastEntity = Object.assign({}, this.entity);
            this.dialog.swal({ dialog: "success", title: "Success", message: "Record is Update sucessfully" });
          }
          $("#place").modal('hide');

          this.spinner.hide()
        }, error: (err: any) => {
          this.dialog.swal({ dialog: 'error', title: 'Error', message: err })
        }
      })
    }
  }

}

