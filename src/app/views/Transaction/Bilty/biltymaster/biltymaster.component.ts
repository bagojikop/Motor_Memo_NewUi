import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { DialogsComponent } from '../../../../assets/pg/dialogs/dialogs.component';
import { MyProvider } from '../../../../assets/services/provider';
import { Location } from '@angular/common';
import { gridOptions, http } from '../../../../assets/services/services';
import { ActBtnComponent } from '../../../../assets/pg/btn-cell-renderer/btn-cell-renderer.component';
import { GridApi } from 'ag-grid-community';
import { debounceTime } from 'rxjs/operators';
import { fromEvent } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { DssGridComponent } from '../../../../assets/pg/dss-grid/dss-grid.component';

@Component({
  selector: 'app-biltymaster',
  templateUrl: './biltymaster.component.html',
  styleUrl: './biltymaster.component.scss',
  imports: [DssGridComponent],
  providers: [http, HttpClient, DialogsComponent, ActBtnComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class BiltymasterComponent {
entity: any = {};
  columns: any = [];
  innerWidth: any;
  frameworkComponents: any;
  list = [];
  natures: any;
  param: any;
  index: any;
  api: any;
  referance: any;
  defaultColDef: any;
  stateParams: any;
  gridParams: any = {};
  mode: any;
  private gridApi: GridApi;

  constructor(
    private http: http,
    private provider: MyProvider,
    private dialog: DialogsComponent,
    private location: Location,
    public gridOption: gridOptions,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.entity = {};
    this.referance = {};
    this.defaultColDef = {};
    this.stateParams = this.location.getState();
    this.mode = this.stateParams.action;
    this.innerWidth = window.innerWidth;
   this.gridParams = { 
      firm_id: this.provider.companyinfo.company?.firmCode,
      div_id: this.provider.companyinfo.company.divId, 
     
    }
    
    fromEvent(window, 'resize')
      .pipe(debounceTime(100))
      .subscribe(() => {
        if (this.gridApi) {
          
        }
      });

    this.defaultColDef = {
      sortable: true,
      floatingFilter: true,
      resizable: true,
    };

    this.columns = [
      { field: 'biltyNo', headerName: 'LR Number', filter: "agTextColumnFilter", flex: 1 },
      { field: 'from_Dstn', headerName: 'Form', filter: "agTextColumnFilter", flex: 1 },
      { field: 'to_Dstn', headerName: 'To', filter: "agTextColumnFilter", flex: 1 },
      { field: 'biltyDetails.senderName', headerName: 'Sender Name', filter: "agTextColumnFilter", flex: 1 },
      { field: 'biltyDetails.receiverName', headerName: 'Reciver Name', filter: "agTextColumnFilter", flex: 1 },
      {
        headerName: 'Action',
        cellRenderer: ActBtnComponent,
        filter: false,
        cellRendererParams: {
          onClick: this.onBtnClick1.bind(this),
        },
        flex: 1
      },
      
    ];
  }

    addNew() {
    const params = { action: 'new' };
    this.router.navigate(['biltychild'], { state: params });
  }

  onGridReady(params: any) {
    this.gridApi = params;
   
  }
   onBtnClick1(e: any) {
    if (e.event.action === "edit") {
      this.edit(e.rowData);
    } else {
      this.Delete(e.rowData);
    }
  }

  edit(s: any) {
    const param = { action: 'view', id: s.vchId };
    this.router.navigate(['biltychild'], { state: param });
  }

  Delete(s: any) {
    const params = {
      dialog: 'confirm',
      title: "warning",
      message: "Do You Want Delete Row",
    };
    this.dialog.swal(params).then(data => {
      if (data === true) {
        this.iConfirmFn(s);
      }
    });
  }

  iConfirmFn(row: any) {
    const params = { id: row.vchId };
    this.http.delete('Bilty/delete', params).subscribe((res: any) => {
      if (res.status_cd === 1) {
        this.gridApi.applyTransaction({ remove: [row] });
        const params = {
          dialog: 'success',
          title: "success",
          message: "Record Deleted Successfully",
        };
        this.dialog.swal(params);
        
      } else {
        const error = res.error?.message || "An Error has occurred while deleting the record!";
        const errorParams = {
          dialog: 'error',
          title: "Error",
          message: error,
        };
        this.dialog.swal(errorParams);
      }
    });
  }
}
