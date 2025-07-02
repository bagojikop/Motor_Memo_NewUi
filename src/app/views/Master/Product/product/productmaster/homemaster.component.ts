import { Component, HostListener, NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { DialogsComponent } from '../../../../../assets/pg/dialogs/dialogs.component';
import { DecimalPipe, Location } from '@angular/common';
import { gridOptions, http, share_data } from '../../../../../assets/services/services';
import { ActBtnComponent } from '../../../../../assets/pg/btn-cell-renderer/btn-cell-renderer.component';
import { GridApi } from 'ag-grid-community'; 
import { HttpClient } from '@angular/common/http';
import { DssGridComponent } from '../../../../../assets/pg/dss-grid/dss-grid.component';
declare var $: any;
@Component({
  selector: 'app-homemaster',
  templateUrl: './homemaster.component.html',
  styleUrls: ['./homemaster.component.scss'],
  imports: [DssGridComponent],
  providers: [http, HttpClient, DialogsComponent, ActBtnComponent, share_data, DecimalPipe],
  schemas: [NO_ERRORS_SCHEMA]
})
export class HomemasterComponent {
  entity: any = {};
  columns: any = [];
  frameworkComponents: any;
  list: any = [];
  natures;
  param: any;
  gridParams: any = {};
  index: any;
  api: any;
  referance: any;
  defaultColDef: any;
  stateParams: any;
  product: boolean;
  mode: any;
  innerWidth: any;
  private gridApi: GridApi;
  constructor(private http: http,
    private dialog: DialogsComponent,
    private location: Location,
    public router: Router,
    public gridOption: gridOptions,
   ) { }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.innerWidth = window.innerWidth;
    if (this.gridApi) {  
    }

  }
  ngOnInit(): void {
    this.entity = {};
    this.referance = {};
    this.defaultColDef = {};
    this.referance.mfgr = [];
    this.referance.products = [];
    this.referance.technical = [];
    this.list = [];
    this.entity.iType = 1;
    this.stateParams = this.location.getState();
    this.mode = this.stateParams.action;
    this.innerWidth = window.innerWidth;
   
    if (!this.stateParams.mode) {
      this.product = false;
    
    } else {
      this.product = true;
    }

    this.defaultColDef = {
      sortable: true,
      floatingFilter: true,
      resizable: true,
    };

    this.columns = [
      {
        field: 'iName',
        headerName: 'Name',
        filter: "agTextColumnFilter",
        flex: 3
      },
    
      {
        field: 'iUnitNavigation.unitName',
        headerName: 'Unit',
        filter: "agTextColumnFilter",
        flex: 2
      },

      {
        field: 'iHsn',
        headerName: 'HSN Code',
        filter: "agTextColumnFilter",
        flex: 2
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
    var params = {
      action: 'new'
    }
    this.router.navigate(['/Productchild'], { state: params });
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
      id: s.iId
    };
    this.router.navigate(['/Productchild'], { state: param });
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
      id: row.iId
    }
    this.http.delete('ProductInfo/delete', params).subscribe((res: any) => {
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
  
  gdParams() {
    this.gridParams = {
      IMfgr: this.entity.iMfgr || '',
      SubCatId: this.entity.subCatName || '',
      ITech: this.entity.iTech || '',
      iType: this.entity.iType || '',
    }
  }
}
