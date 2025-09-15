import { Component,AfterViewInit,} from '@angular/core';
import { CommonModule, DatePipe, Location,DecimalPipe } from '@angular/common';
import { http, Master} from '../../../assets/services/services';
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
import { GridApi,ColDef } from 'ag-grid-community';
import {  AgGridModule } from 'ag-grid-angular';
import { UiSwitchModule } from 'ngx-ui-switch';
import { Router } from '@angular/router';
import { SavedDataService } from './saved-data.service';
declare var bootstrap:any;

@Component({
  selector: 'app-profit-loss',
  templateUrl: './profit-loss.component.html',
  styleUrl: './profit-loss.component.scss',
  imports: [FormsModule, CommonModule,UiSwitchModule, DTFormatDirective,AgGridModule, PdfViewerModule, CurrencyMaskDirective,PdfReaderComponent, ngselectComponent, NgSelectModule, DssInputComponent,  NavactionsComponent], 
  providers: [DatePipe, DecimalPipe, DialogsComponent, PdfReaderComponent, Master, ArraySortPipe, PdfViewerComponent, PdfViewerModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProfitLossComponent implements AfterViewInit{
  entity: any = {};
  columns: ColDef[] = [];
  innerWidth: any;
  list: any = [];
  api: any;
  referance: any = {};
  defaultColDef: ColDef = {};
  stateParams: any;
  mode: any;
  rowIndex: any = {};
  reference: any = {};
  rptMode: boolean = false;
  myServiceUrl: string;
  myReportDictionory: ReportDictionory = <ReportDictionory>{};
  gridColumnApi: any;

  private gridApi: GridApi;

  constructor(private http: http,
    private spinner: NgxSpinnerService,
    private provider: MyProvider,
    private dialog: DialogsComponent,
    private location: Location,
    private datepipe: DatePipe,
    private decimalpipe: DecimalPipe,
    private router: Router,
    private savedDataService: SavedDataService
  ) { }

  ngAfterViewInit(): void {
    this.entity.to=this.datepipe.transform(this.provider.companyinfo.finyear.tdt,'yyyy-MM-dd')
    const x = this.datepipe.transform(new Date(), 'yyyy-MM-dd')?? '';
    this.entity.edt = this.entity.to >= x ? x : this.entity.to;

  }

  ReportType = [
    { id: "1", value: "Vertical" },
    { id: "2", value: "Hosrizontal" }
  ];

  ngOnInit(): void {

    if (this.savedDataService.getNavigatedFromCellClick()) {
      const savedDate = this.savedDataService.getSavedDate();
      if (savedDate) {
        this.entity.edt = savedDate;
        this.savedDataService.setNavigatedFromCellClick(false)
      
        this.Listshow();
      }
    }
    else {
      this.entity = {};
      this.reference.groups = [];
      this.entity.sdt = this.datepipe.transform(this.provider.companyinfo.finyear.fdt,'yyyy-MM-dd');
      this.stateParams = this.location.getState();
      this.mode = this.stateParams.action;
      this.innerWidth = window.innerWidth;

    }

    this.defaultColDef = {
      sortable: true,
      floatingFilter: true,
      resizable: true,
    };

    this.columns = [
      {
        field: 'sg_name',
        headerName: 'Account Description',
        filter: "agTextColumnFilter",
        flex: 3,
        minWidth: 200,
        headerClass: 'text-left',
      },
      {
        field: 'debit',
        headerName: 'Expenses',
        filter: "agTextColumnFilter",
        flex: 1,
        minWidth: 100,
        cellStyle: { textAlign: 'end' },
        headerClass: "ag-right-aligned-header",
        cellRenderer: (data) => {
          return data.value ? this.decimalpipe.transform(data.value, '1.2-2') : '0.00';
        },
      },
      {
        field: 'credit',
        headerName: 'Income',
        filter: "agTextColumnFilter",
        flex: 1,
        minWidth: 100,
        cellStyle: { textAlign: 'end' },
        headerClass: "ag-right-aligned-header",
        cellRenderer: (data) => {
          return data.value ? this.decimalpipe.transform(data.value, '1.2-2') : '0.00';
        },
      },
    ];

    setTimeout(() => {
      this.generatePinnedBottomData();
    }, 100);
  }

  onGridReady(params) {

    this.api = params.api;
    this.gridColumnApi = params.columnApi;
  }

  close() {
    this.provider.companyinfo.finyear.edt = null;
    this.location.back();
  }



  profitLossprint() {


    this.myServiceUrl = "ProfitLossReport";

    this.myReportDictionory = {
      reportCacheId: uuidv4(),
      reportParams: [
        {
          key: "edt", value: this.entity.edt,

        },
        {
          key: "reporttype", value: this.entity.reporttype,

        },



      ]
    };
    this.rptMode = true;
  }

  printparam() {

    const bsOffcanvas = new bootstrap.Offcanvas('#offcanvasRight');
    bsOffcanvas.show();
    this.entity.reporttype = "1";

  }

  generatePinnedBottomData() {
    let result = {
      'debit': 0,
      'credit': 0,
      'creditDisplay': '',
      'debitDisplay': '',
      'totalDisplay': 'Total: Cramt 0.00, Dramt 0.00'
    };

    const columnsWithAggregation = ['debit', 'credit'];
    const filteredRows = this.api.getRenderedNodes().map(node => node.data);

    columnsWithAggregation.forEach(element => {
      filteredRows.forEach((rowData: any) => {
        const value = Number(rowData[element]) || 0;
        result[element] += value;
      });

    });

    result['totalDisplay'] = `Total: Dramt ${result['debit'].toFixed(2)}, Cramt ${result['credit'].toFixed(2)}`;
    this.api.setPinnedBottomRowData([result]);
  }

  Listshow() {

    var param = {
      edt: this.provider.companyinfo.finyear.edt || this.entity.edt
    }
    this.provider.companyinfo.finyear.edt = this.entity.edt;
    this.http.get('ProfitLoss/get', param).subscribe({
      next: (res: any) => {
        console.log('Response:', res);

        if (res.status_cd == 1) {
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
  onCellClicked(index) {
    if (index.column.colId === 'sg_name') {
      this.rowIndex = index.rowIndex;
      var param = {
        firm_id: this.provider.companyinfo.company.firmCode,
        div_id: this.provider.companyinfo.company.divId,
        accountitem: index.data
      }
      this.savedDataService.setSavedDate(this.entity.edt);
      this.savedDataService.setNavigatedFromCellClick(true);

      this.router.navigate(['/profit-loss-child'], { state: param });
    }
  }

}
