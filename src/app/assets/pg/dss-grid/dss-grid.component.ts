import { Component, Input, Output, EventEmitter, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { http } from '../../services/services';
import { DialogsComponent } from '../dialogs/dialogs.component';
import { GridApi } from 'ag-grid-community';
import { ActBtnComponent, selectComponent } from '../../../assets/pg/btn-cell-renderer/btn-cell-renderer.component';
import { MyProvider } from '../../services/provider';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';

@Component({
  selector: 'dss-grid',
  standalone: true,
  imports: [FormsModule, AgGridModule, CommonModule],
  templateUrl: './dss-grid.component.html',
  styleUrls: ['./dss-grid.component.scss'],
  providers: [AgGridAngular],
  schemas: [CUSTOM_ELEMENTS_SCHEMA,]
})
export class DssGridComponent implements OnInit {
  @Output() onCellClick = new EventEmitter();
  @Output() onRowClick = new EventEmitter();
  @Output() action = new EventEmitter();
  @Input() style: any;
  @Input() columns = [];
  @Input() gridOptions = {};
  @Input() class;
  @Input() url;
  @Input() defaultColDef = {};
  @Input() params;
  @Output() gridApi = new EventEmitter();
  @Input() pageSize;
  api: any
  list: any[] = [];

  currentPage = 1;

  totalPages = 0;
  columnApi: any;

  constructor(private spinner: NgxSpinnerService, private services: MyProvider, public http: http, public dialog: DialogsComponent) { }

  ngOnInit(): void { }

  Init(newPage, filters?) {
    this.spinner.show();
    this.currentPage = newPage;
    var param = { pageNumber: this.currentPage, keys: filters, pageSize: this.pageSize || 10 }

    // if(this.params){

    //   this.http.put(this.url, param,this.params).subscribe({
    //     next: (res: any) => {
    //       if (res.status_cd == 1) {
    //         this.list = res.data;
    //         if (res.pageDetails)
    //           this.totalPages = res.pageDetails.totalPages;
    //       } else {
    //         this.dialog.swal({ dialog: 'error', title: 'Error', message: res.errors.exception.Message });
    //       }
    //       this.spinner.hide();
    //     }, error: (err: any) => {
    //       this.spinner.hide();
    //       this.dialog.swal({ dialog: 'error', title: 'Error', message: err.message });
    //     }
    //   })
    // }else{
    this.http.post(this.url, param,this.params).subscribe({
      next: (res: any) => {
        if (res.status_cd == 1) {
          this.list = res.data;
          if (res.pageDetails)
            this.totalPages = res.pageDetails.totalPages;
        } else {
          this.dialog.swal({ dialog: 'error', title: 'Error', message: res.errors.message || res.errors.exception.Message });
        }
        this.spinner.hide();
      }, error: (err: any) => {
        this.spinner.hide();
        this.dialog.swal({ dialog: 'error', title: 'Error', message: err.message });
      }
    })
    // }

  }

  getPagesArray(): number[] {
    const pagesArray = [];
    for (let page = 1; page <= this.totalPages; page++) {
      //@ts-ignore
      pagesArray.push(page);
    }
    return pagesArray;
  }


  movenext() {
    this.currentPage += 1
    this.Init(this.currentPage);
  }

  moveback() {
    this.currentPage -= 1

    this.Init(this.currentPage);
  }


  onGridReady(params) {
    if (params.api) {
      // params.api.sizeColumnsToFit(); // Ensure `sizeColumnsToFit` is called only when `api` is defined
      this.api = params.api;
      this.columnApi = params.columnApi;
      this.gridApi.emit(params.api);
      this.Init(this.currentPage);
    } else {
      console.warn("Grid API is not yet available.");
    }
  }


  onCellClicked($event) {


    this.onCellClick.emit($event);
  }


  onRowClicked($event) {
    this.onRowClick.emit($event);
  }

  onFilterChanged(): void {
    if (this.api && this.columnApi) {
      const allColumns = this.columnApi.getAllColumns();
      const filterData = [];

      allColumns.forEach(column => {
        const filterInstance = this.api!.getFilterInstance(column);
        if (filterInstance) {
          const filterModel = filterInstance.getModel();
          if (filterModel) {
            const key = column.getColDef().field;
            const value = filterModel.filter;
            //@ts-ignore
            filterData.push({ key, value });
          }
        }
      });
      this.currentPage = 1;
      this.Init(this.currentPage, filterData)
      //onsole.log('Filter Data:', filterData);
    }
  }


}
