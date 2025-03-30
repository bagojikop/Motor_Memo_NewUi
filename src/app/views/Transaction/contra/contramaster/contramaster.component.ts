import { Component, HostListener, NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogsComponent } from '../../../../assets/pg/dialogs/dialogs.component';
import { MyProvider } from '../../../../assets/services/provider';
import { DatePipe, DecimalPipe, Location } from '@angular/common';
import { gridOptions, http } from '../../../../assets/services/services';
import { ActBtnComponent } from '../../../../assets/pg/btn-cell-renderer/btn-cell-renderer.component';
import { GridApi } from 'ag-grid-community';
import { HttpClient } from '@angular/common/http';
import { DssGridComponent } from '../../../../assets/pg/dss-grid/dss-grid.component';
declare var $: any;

@Component({
  selector: 'app-contramaster',
  templateUrl: './contramaster.component.html',
  styleUrls: ['./contramaster.component.scss'],
  imports: [DssGridComponent],
  providers: [http, HttpClient, DialogsComponent, ActBtnComponent, DecimalPipe, DatePipe],
  schemas: [NO_ERRORS_SCHEMA]
})
export class ContramasterComponent {
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
    private spinner: NgxSpinnerService,
    public provider: MyProvider,
    private dialog: DialogsComponent,
    private location: Location,
    private router: Router,
    private decimalpipe: DecimalPipe,
    public gridOption: gridOptions,
    private datepipe: DatePipe,) { }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
    // this.gridApi.sizeColumnsToFit();

  }
  ngOnInit(): void {
    this.entity = {};
    this.referance = {};
    this.defaultColDef = {};
    this.stateParams = this.location.getState();
    this.mode = this.stateParams.action;
    this.innerWidth = window.innerWidth;
    // setTimeout(() => {
    //   this.gridApi.sizeColumnsToFit();
    // }, 1000);

    // this.frameworkComponents = {
    //   buttonRenderer: ActBtnComponent,
    // }
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
        return data.value ? this.decimalpipe.transform(data.value, '1.2-2') : '';    //moment(data.value).format('DD/MM/YYYY')
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
      firm_id: this.provider.companyinfo.company?.firmCode,
      div_id: this.provider.companyinfo.company.divId,
      // username: this.provider.companyinfo.userinfo.username,
      // from_date: "01-04-2022",
      // to_date: "31-03-2023",
      isApproval: "false",
    }

  }
  Init() {
    // this.spinner.show();
    // this.entity.branch_id=this.provider.companyinfo.company?.branchCode;
    //   this.entity.firm_id=this.provider.companyinfo.company?.firmCode;
    //   this.entity.div_id=this.provider.companyinfo.company.divId

    // this.entity.username=this.provider.companyinfo.userinfo.username;
    // this.entity.from_date="01-04-2022";
    // this.entity.to_date="31-03-2023";

    // this.entity.isApproval="false";
    //   this.http.get('contra/contras',this.entity).subscribe({
    //     next: (res: any) => {
    //       if (res.status_cd == 1) {

    //         this.list = res.data;
    //         this.spinner.hide();
    //       } else {
    //         this.dialog.swal({ dialog: 'error', title: 'Error', message: res.errors.exception.Message })
    //       }

    //       this.spinner.hide();
    //     }, error: (err: any) => {

    //       this.spinner.hide();
    //       this.dialog.swal({ dialog: 'error', title: 'Error', message: err.message });
    //     }
    //   })
  }
  addNew() {
    var params = {
      action: 'new'
    }
    this.router.navigate(['Contrachild'], { state: params });
  }
  onGridReady(params) {
    // params.api.sizeColumnsToFit();
    this.gridApi = params;
  }
  onBtnClick1(e) {
    if (e.event.action == "edit") {
      this.edit(e.rowData);
    } else {
      this.Delete(e.rowData);
    }

  }
  onCellClicked(params) {

  }
  edit(s) {
    var param = {
      action: 'view',
      id: s.vchId
    };
    this.router.navigate(['Contrachild'], { state: param });

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
    this.http.delete('contra/delete', params).subscribe((res: any) => {
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
