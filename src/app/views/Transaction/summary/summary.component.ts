import { Component, HostListener, NO_ERRORS_SCHEMA } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogsComponent } from '../../../../app/assets/pg/dialogs/dialogs.component';
import { MyProvider } from '../../../../app/assets/services/provider';
import { CommonModule, Location } from '@angular/common';
import { gridOptions, http } from '../../../../app/assets/services/services';
import { ActBtnComponent } from '../../../../app/assets/pg/btn-cell-renderer/btn-cell-renderer.component';
import { GridApi } from 'ag-grid-community';
import { HttpClient } from '@angular/common/http';
import { DssGridComponent } from '../../../assets/pg/dss-grid/dss-grid.component';
import { ngselectComponent } from '../../../assets/pg/ngselect/ngselect.component';
import { FormControl, FormsModule } from '@angular/forms';
import { DssInputComponent } from '../../../assets/mydirective/dss-input/dss-input.component';
declare var $: any;
@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
  imports: [DssGridComponent, FormsModule, CommonModule, ngselectComponent, DssInputComponent],
  providers: [http, HttpClient, DialogsComponent, ActBtnComponent, FormControl],
  schemas: [NO_ERRORS_SCHEMA]
})
export class SummaryComponent {
  entity: any = {};
  columns: any = [];
  reference: any = {};
  frameworkComponents: any;
  list = [];
  natures;
  param: any;
  index: any;
  api: any;
  value: string;
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
      field: 'sundryName',
      headerName: 'Sundry',
      filter: "agTextColumnFilter",
      flex: 4
    },
   
    {
      field: 'operation',
      headerName: 'Operation',
      filter: "agTextColumnFilter",
      flex: 3,
      cellRenderer: (params) => {
        return params.value === 0 ? 'Deduct' : 'Add';
      }
    },

    {
      headerName: 'Action',
      cellRenderer: ActBtnComponent,
      filter: false,
      cellRendererParams: {
        onClick: this.onBtnClick1.bind(this),
      },
      flex: 2
    },
    ]
  
  }
 
  addNew() {
    this.entity = {};
    $("#district").modal('show');
  }

  onCellClicked(index) {

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


  apiParams() {
    var x = {
      PageNumber: 1,
      PageSize: 10,
      Keys: []
    }

    return x;
  }
  edit(s) {
    this.entity = s;
    this.entity.accCodeNavigation = s.accCodeNavigation;
    $("#district").modal('show');
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
      id: row.sId
    }

    this.http.delete('Sundry/delete', params).subscribe((res: any) => {
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
    $("#district").modal('hide');

  }
  save() {
    this.spinner.show();
    if (!this.entity.sId) {

      this.http.post('Sundry/Create', this.entity).subscribe({
        next: (res: any) => {
          if (res.status_cd == 1) {

            this.entity.sId = res.data.sId;
            this.gridApi.applyTransaction({ add: [this.entity] });
            this.dialog.swal({ dialog: "success", title: "Success", message: "Record is saved sucessfully" })
              .then((res: any) => {
                $("#district").modal('hide');
              })

          } else {
            this.dialog.swal({ dialog: "error", message: "Duplicate Sundry" });
          }


          this.spinner.hide()

        }, error: (err: any) => {
          this.spinner.hide()
          this.dialog.swal({ dialog: 'error', title: 'Error', message: "Duplicate Sundry" })
        }
      })
    }
    else {
      this.http.put('Sundry/Edit', this.entity, { id: this.entity.sId }).subscribe({
        next: (res: any) => {
          if (res.status_cd == 1) {
            this.entity.sId = res.data.sId;
            this.gridApi.applyTransaction({ update: [this.entity] });
            this.pastEntity = Object.assign({}, this.entity);
            this.dialog.swal({ dialog: "success", title: "Success", message: "Record is Update sucessfully" });
          }
          $("#district").modal('hide');

          this.spinner.hide()
        }, error: (err: any) => {
          this.dialog.swal({ dialog: 'error', title: 'Error', message: err })
        }
      })
    }
  }
  onOperationChange(value: string) {
    console.log('Selected Operation:', value);
  }

}
