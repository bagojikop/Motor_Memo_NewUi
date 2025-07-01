import { Component, HostListener,ViewChild } from '@angular/core';
import { CommonModule, DatePipe, Location,DecimalPipe } from '@angular/common';
import { http, Master, NavbarActions } from '../../../assets/services/services';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { MyProvider } from '../../../assets/services/provider';
import { DialogsComponent } from '../../../assets/pg/dialogs/dialogs.component';
import { ReportDictionory } from '../../../../../assets/service/interfaces';
import { v4 as uuidv4 } from 'uuid'
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { DssInputComponent } from '../../../assets/mydirective/dss-input/dss-input.component';
import { ngselectComponent } from '../../../assets/pg/ngselect/ngselect.component';
import { NavactionsComponent } from '../../../assets/pg/navactions/navactions.component';
import { CurrencyMaskDirective } from "../../../assets/mydirective/currencyMask/currency-mask.directive";
import { DTFormatDirective } from '../../../assets/mydirective/mydirective.directive';
import { ArraySortPipe } from '../../../assets/pipes/inrcrdr.pipe';
import {PdfReaderComponent} from '../../../assets/pdf-reader/pdf-reader.component';
import { PdfViewerComponent, PdfViewerModule } from 'ng2-pdf-viewer';
import { ColDef } from 'ag-grid-community';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
declare var bootstrap:any;
@Component({
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './chashbank-book.component.html',
  styleUrl: './chashbank-book.component.scss',
  imports: [FormsModule, CommonModule, DTFormatDirective,AgGridModule, PdfViewerModule, CurrencyMaskDirective,PdfReaderComponent, ngselectComponent, NgSelectModule, DssInputComponent,  NavactionsComponent], 
  providers: [DatePipe, DecimalPipe, DialogsComponent, PdfReaderComponent, Master, ArraySortPipe, PdfViewerComponent, PdfViewerModule]
})
export class ChashbankBookComponent {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  entity: any = {};
  reference:any={}
  columns: ColDef[]  = [];
  innerWidth: any;
  list: any = [];
  api: any;
  defaultColDef: ColDef = {};
  stateParams: any;
  mode: any;
  parameters: any[] = [];
  rptMode: boolean = false;
  myServiceUrl: string;
  myReportDictionory: ReportDictionory = <ReportDictionory>{};
  gridColumnApi: any;
 
  constructor(
    public location: Location,
    public http: http,
    private datepipe: DatePipe,
    private dialog: DialogsComponent,
    private spinner: NgxSpinnerService,
    public provider: MyProvider,
    private decimalpipe: DecimalPipe,
    public navactions: NavbarActions,
    public master: Master,) {
      this.entity = {};
    }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
  }
  
  ngOnInit(): void {
    this.entity = {};
    this.reference={};
    this.defaultColDef = {};
    this.stateParams = this.location.getState();
    this.mode = this.stateParams.action;
    this.innerWidth = window.innerWidth;
   
    this.defaultColDef = {
      sortable: true,
      floatingFilter: true,
      resizable: true,

    };
    this.columns = [{
      field: 'vch_date',
      headerName: 'Date',
      filter: "agTextColumnFilter",
      cellRenderer: (data) => {
        return this.datepipe.transform(data.value,'dd-MM-yyyy');
      },
      maxWidth: 200,
          flex: 1,
          cellClass: 'text-right',
    },
    {
      field: 'vch_type_name',
      headerName: 'Type',
      filter: "agTextColumnFilter",
      maxWidth: 200,
      flex: 1,
      cellClass: 'text-right',
    },
    {
      field: 'challan_no',
      headerName: 'Voucher No',
      filter: "agTextColumnFilter",
      maxWidth: 400,
      flex: 2,
      cellClass: 'text-right',
    },
    {
      field: 'refName',
      headerName: 'Account',
      filter: "agTextColumnFilter",
      maxWidth: 900,
          flex: 2,
          cellClass: 'text-right',
    },
    
    {
      field: 'dramt',
      headerName: 'Debit',
      filter: "agTextColumnFilter",
      maxWidth: 300,
          flex: 1,
          cellStyle: { textAlign: 'end' },
          headerClass: "ag-right-aligned-header",
      aggFunc: "sum",
      editable: true,
      valueParser: "Number(newValue)",
      type: "rightAligned",
      cellRenderer: (data) => {
       return data.value ? this.decimalpipe.transform(data.value, '1.2-2') : '0.00 ';    //moment(data.value).format('DD/MM/YYYY')
     },
    },
    {
      field: 'cramt',
      headerName: 'Credit',
      filter: "agTextColumnFilter",
      maxWidth: 300,
      flex: 1,
      cellStyle: { textAlign: 'end' },
      headerClass: "ag-right-aligned-header",
      aggFunc: "sum",
      editable: true,
      valueParser: "Number(newValue)",
      type: "rightAligned",
      cellRenderer: (data) => {
       return data.value ? this.decimalpipe.transform(data.value, '1.2-2') : '0.00 ';    //moment(data.value).format('DD/MM/YYYY')
     },
    },
  
    ]
   
    setTimeout(() => {
      this.generatePinnedBottomData();
    }, 100);
  

    var x = this.datepipe.transform(new Date(), 'yyyy-MM-dd')?? '';
    this.entity.edt = this.provider.companyinfo.finyear.tdt >= x ? x : this.provider.companyinfo.finyear.tdt;
  }
  getAccObj(event){
    this.reference.accCodeobj=event;
  }
  
  close(){
    this.location.back();
  }
  onGridReady(params){
    this.api = params.api;
    this.gridColumnApi = params.columnApi;
  }
  cashbankprint(){
    this.myServiceUrl = "CashBookReport";
  
    this.myReportDictionory = {
      
      reportCacheId: uuidv4(),
      reportParams: [
        {
          key: "firm_id", value: this.provider.companyinfo.company?.firmCode,

        },
        {
          key: "div_id", value: this.provider.companyinfo.company?.divId,

        },
        {
          key: "acc_code", value: this.reference.accCode,
        },
        {
          key: "sdt", value: this.reference.sdt,

        },
        {
          key: "edt", value: this.reference.edt,

        },
      ]
    };
    this.rptMode = true;
  }

  Listshow(){
    var param = {
      firm_id:  this.provider.companyinfo.company?.firmCode,
      div_id: this.provider.companyinfo.company.divId,
      acc_code: this.entity.accCode,
      sdt:this.provider.companyinfo.finyear.fdt,
      edt: this.entity.edt
    }
    this.http.get('CashBankBook/getcashbankbookItems', param).subscribe({
      next: (res: any) => {
        if (res.status_cd==1) {
          this.list = res.data;
        } else {
          this.dialog.swal({ dialog: 'error', title: 'Error', message: res.errors.exception.Message });
        }
        setTimeout(() => {
          this.generatePinnedBottomData();
        }, 1000); 
        this.spinner.hide();
      },
      error: (err: any) => {
        this.spinner.hide();
        this.dialog.swal({ dialog: 'error', title: 'Error', message: err.message });
      }
    })
  }
  printparam(){
    const bsOffcanvas = new bootstrap.Offcanvas('#offcanvasRight');
    bsOffcanvas.show();
    this.reference.edt=this.entity.edt;
    this.reference.accCodeobj=this.entity.accCode;
    this.reference.sdt=this.provider.companyinfo.finyear.fdt;
  }
  generatePinnedBottomData(){
    let result = {
      'dramt': 0,
      'cramt': 0,
      
      'creditDisplay': '',
      'debitDisplay': '',
       'totalDisplay': 'Total: dramt 0.00,cramt 0.00,balance:0' 
    };
  
    const columnsWithAggregation = ['dramt', 'cramt'];
    const filteredRows = this.api.getRenderedNodes().map(node => node.data);
    columnsWithAggregation.forEach(element => {
      filteredRows.forEach((rowData: any) => {
        const value = Number(rowData[element]) || 0;
        result[element] += value;
      });
     
    });
  
   result['totalDisplay'] = `Total: dramt ${result['dramt'].toFixed(2)},cramt ${result['cramt'].toFixed(2)}`;
    this.api.setPinnedBottomRowData([result]);
  }
}
