import { AfterViewInit, ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, HostListener } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogsComponent } from '../../../../assets/pg/dialogs/dialogs.component';
import { CommonModule, Location } from '@angular/common';
import { gridOptions, http } from '../../../../assets/services/services';
import { ActBtnComponent } from '../../../../assets/pg/btn-cell-renderer/btn-cell-renderer.component';
import { GridApi } from 'ag-grid-community'; 
import { FormsModule } from '@angular/forms'; 
import { DssInputComponent } from '../../../../assets/mydirective/dss-input/dss-input.component';
import { MydirectiveModule } from '../../../../assets/mydirective/mydirective.module';
import { DssGridComponent } from '../../../../assets/pg/dss-grid/dss-grid.component'; 
import { NumberOnlyDirective } from '../../../../assets/mydirective/mydirective.directive';
declare var $: any;
@Component({
  selector: 'app-unitmaster',
  templateUrl: './unitmaster.component.html',
  styleUrls: ['./unitmaster.component.scss'],
  imports: [FormsModule, CommonModule, DssInputComponent,NumberOnlyDirective, MydirectiveModule, DssGridComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class UnitmasterComponent implements AfterViewInit {
  entity: any = {};
  columns: any = [];
  pastEntity: any;
  frameworkComponents: any;
  list: any = [];
  natures;
  param: any;
  index: number;
  api: any;
  referance: any;
  defaultColDef: any;
  stateParams: any;
  innerWidth: any;
  mode: any;
  isUpdate = false;


  private gridApi: GridApi;
  constructor(private http: http,
    private spinner: NgxSpinnerService,
    private dialog: DialogsComponent,
    public gridOption: gridOptions,
    private location: Location,
     private cd: ChangeDetectorRef) { }

  ngAfterViewInit(): void {
    this.Init()
    this.cd.detectChanges();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
  

  }
  ngOnInit(): void {
    this.entity = {};
    this.referance = {};
    this.defaultColDef = {};
    this.stateParams = this.location.getState();
    this.mode = this.stateParams.action;
    this.innerWidth = window.innerWidth;
   


    this.defaultColDef = {
      sortable: true,
      floatingFilter: true,
      resizable: true,
    };


    this.columns = [
      {
        field: 'unitCode',
        headerName: 'Unit Code',
        filter: "agTextColumnFilter",
        minWidth: 80,
        flex: 1
      },
      {
        field: 'unitName',
        headerName: 'Unit Name ',
        filter: "agTextColumnFilter",
        minWidth: 100,
        flex: 1
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
    this.spinner.show();
    this.http.get('Unit/list').subscribe({
      next: (res: any) => {
        if (res.status_cd == 1) {
          this.list = res.data;
        } else {
          this.dialog.swal({ dialog: 'error', title: 'Error', message: res.errors.exception.Message });
        }
        this.spinner.hide();
      }, error: (err: any) => {
        this.spinner.hide();
        this.dialog.swal({ dialog: 'error', title: 'Error', message: err.message });
      }
    })
  }
  addNew() {
    this.entity = {};
    $("#unit").modal('show');
  }
  onGridReady(params) {

    this.gridApi = params;
  }
  status: string;
  rowIndex: number;
  onBtnClick1(e) {
    if (e.event.action == "edit") {
      this.rowIndex = e.rowIndex;

      this.edit(e.rowData);


    } else {
      this.Delete(e.rowData);
    }

    this.status = e.event.action
  }

  edit(s) {
    this.entity = s;
    $("#unit").modal('show');
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
      id: row.unitCode
    }

    this.http.delete('Unit/delete', params).subscribe((res: any) => {
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

  save() {
    this.spinner.show();
    if(this.entity.unitCode){
    this.http.put('unit/update', this.entity, {unitCode:this.entity.unitCode}).subscribe({
      next: (res: any) => {
        if (res.status_cd == 1) {
          this.entity = res.data;

          if(res.data.unitCode==this.entity.unitCode){
          this.gridApi.applyTransaction({ update: [this.entity] });
          }else{
            this.gridApi.applyTransaction({ add: [this.entity] });
          }
          // if (this.rowIndex != null) {

          //   this.list[this.rowIndex] = this.entity;

          //   const rowNode: any = this.gridApi.getDisplayedRowAtIndex(this.rowIndex);

          //   rowNode.setData(this.list[this.rowIndex]);

          // } else {

          //   this.gridApi.applyTransaction({ add: [this.entity] });
          // }

          this.gridApi.refreshCells({ force: true });
          this.pastEntity = Object.assign({}, this.entity);
          this.dialog.swal({ dialog: "success", title: "Success", message: "Record is update sucessfully" })
            .then((res: any) => {
              $("#unit").modal('hide');
            })
        } else {
          this.dialog.swal({ dialog: "error", message: res.errors.message });
        }
        this.spinner.hide()
      }, error: (err: any) => {
        this.dialog.swal({ dialog: 'error', title: 'Error', message: err })
      }
    })
  }
  }

  close() {
    this.entity = {};
    $("#unit").modal('hide');
  }
}
