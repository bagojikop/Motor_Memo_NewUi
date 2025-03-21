import { Component, CUSTOM_ELEMENTS_SCHEMA, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogsComponent } from '../../../assets/pg/dialogs/dialogs.component';
import { MyProvider } from '../../../assets/services/provider';
import { CommonModule, Location } from '@angular/common';
import { gridOptions, http } from '../../../assets/services/services';
import { ActBtnComponent } from '../../../assets/pg/btn-cell-renderer/btn-cell-renderer.component';
import { GridApi } from 'ag-grid-community';
import { FormsModule } from '@angular/forms';
import { ngselectComponent } from '../../../assets/pg/ngselect/ngselect.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { DssInputComponent } from '../../../assets/mydirective/dss-input/dss-input.component';
import { MydirectiveModule } from '../../../assets/mydirective/mydirective.module';
import { MasternavComponent } from '../../../assets/pg/masternav/masternav.component';
import { DssGridComponent } from '../../../assets/pg/dss-grid/dss-grid.component';
import { NavactionsComponent } from '../../../assets/pg/navactions/navactions.component';
import { UppercaseDirective,NumberOnlyDirective } from '../../../assets/mydirective/mydirective.directive';
declare var $: any;

@Component({
  selector: 'app-tdsmaster',
  templateUrl: './tdsmaster.component.html',
  styleUrls: ['./tdsmaster.component.scss'],
  imports: [FormsModule, CommonModule,NumberOnlyDirective, ngselectComponent, NgSelectModule, DssInputComponent, MydirectiveModule, DssGridComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class TdsmasterComponent {
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
      field: 'tdsName',
      headerName: 'Name ',
      filter: "agTextColumnFilter",
      flex: 3
    },
    {
      field: 'accCodeNavigation.accName',
      headerName: 'Account',
      filter: "agTextColumnFilter",
      flex: 3
    },
    // {
    //   field: '',
    //   headerName: 'Rate',
    //   filter: "agTextColumnFilter",
    //   flex: 2
    // },
    // {
    //   field: 'mgCodeNavigation.mgName',
    //   headerName: 'Surcharge',
    //   filter: "agTextColumnFilter",
    //   flex: 1
    // },
    {
      field: 'tds',
      headerName: 'Tds',
      filter: "agTextColumnFilter",
      flex: 1
    },
    {
      field: 'eCess',
      headerName: 'Edu.cess',
      filter: "agTextColumnFilter",
      flex: 1
    },
    {
      field: 'sfCess',
      headerName: 'S.F.cess',
      filter: "agTextColumnFilter",
      flex: 1
    },
    {
      field: 'heCess',
      headerName: 'Hi Cess',
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
      flex: 1
    },
    ]
    //this.Init();
  }
  Init() {
    //   this.spinner.show();
    //   this.http.get("tds/getList").subscribe(res => {
    //     this.spinner.hide();
    //     if (res.status_cd == 1) {
    //       this.list = res.data;
    //       this.gridApi.setRowData(this.list);
    //     } else {
    //       // Swal.fire({
    //       //   icon: 'error',
    //       //   text: res.errors.message
    //       // })
    //     }
    //   }, err => {
    //     this.spinner.hide();
    //     // Swal.fire({
    //     //   icon: 'error',
    //     //   text: err.message
    //     // })
    //   })

  }
  addNew() {
    this.entity = {};
    this.entity.srNo = 0
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
    this.entity.mgCodeNavigation = s.mgCodeNavigation;
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
      id: row.vchId
    }

    this.http.delete('Tds/delete', params).subscribe((res: any) => {
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

  accCodeNavigation: any;
  getAccount($event) {
    this.accCodeNavigation = $event;
  }

  close() {
    this.entity = {};
    $("#group").modal('hide');

  }
  save() {
    this.spinner.show();
    if (!this.entity.vchId) {

      this.http.post('Tds/insert', this.entity).subscribe({
        next: (res: any) => {
          if (res.status_cd == 1) {
            this.entity = res.data;
            this.entity.accCodeNavigation = this.accCodeNavigation;
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
          this.dialog.swal({ dialog: 'error', title: 'Error', message: "Duplicate Primary Group" })
        }
      })
    }
    else {
      this.http.put('Tds/update', this.entity, { id: this.entity.vchId }).subscribe({
        next: (res: any) => {
          if (res.status_cd == 1) {
            this.entity.vchId = res.data.vchId;
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

// this.gridApi.setRowData(this.list);