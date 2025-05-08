import { Component,AfterViewInit,} from '@angular/core';
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
import { GridApi,ColDef } from 'ag-grid-community';
import {  AgGridModule } from 'ag-grid-angular';
import { UiSwitchModule } from 'ngx-ui-switch';
import { Router } from '@angular/router';
import { SavedDataService } from './saved-data.service';
declare var bootstrap:any;

@Component({
  selector: 'app-balance-sheet',
  templateUrl: './balance-sheet.component.html',
  styleUrl: './balance-sheet.component.scss',
  imports: [FormsModule, CommonModule,UiSwitchModule, DTFormatDirective,AgGridModule, PdfViewerModule, CurrencyMaskDirective,PdfReaderComponent, ngselectComponent, NgSelectModule, DssInputComponent,  NavactionsComponent], 
  providers: [DatePipe, DecimalPipe, DialogsComponent, PdfReaderComponent, Master, ArraySortPipe, PdfViewerComponent, PdfViewerModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BalanceSheetComponent implements AfterViewInit{
  entity: any = {};
  columns: ColDef[] = [];
  innerWidth: any;
  list: any = [];
  api: any;
  referance: any = {};
  defaultColDef: ColDef = {};
  stateParams: any;
  mode: any;
  rptMode: boolean = false;
  pdfSrc: string;
  myServiceUrl: string;
  myReportDictionory: ReportDictionory = <ReportDictionory>{};
  gridParams: any = {};
  gridColumnApi: any;
  rowIndex: any = {};
  private gridApi: GridApi;

  constructor(private http: http,
    private spinner: NgxSpinnerService,
    private provider: MyProvider,
    private dialog: DialogsComponent,
    private location: Location,
    private datepipe: DatePipe,
    private router: Router,
    private decimalpipe: DecimalPipe,
    private savedDataService: SavedDataService
  ) { }

  ngAfterViewInit(): void {
    var x = this.datepipe.transform(new Date(), 'yyyy-MM-dd')?? '';
    const savedDate = this.savedDataService.getSavedDate();
    if (savedDate) {
      this.entity.edt = savedDate;
      this.savedDataService.clearSavedDate(); // Clear it after setting
      this.Listshow();
    } else {
     
      this.entity.edt = this.provider.companyinfo.finyear.tdt >= x ? x : this.provider.companyinfo.finyear.tdt;
     
    }
  }

  reporttype = [
    { id: "1", value: "Vertical" },
    { id: "2", value: "Hosrizontal" }
  ];


  ngOnInit(): void {
    this.entity = {};
    this.referance={}
    this.defaultColDef = {
      sortable: true,
      floatingFilter: true,
      resizable: true,
    };
    this.stateParams = this.location.getState();
    this.mode = this.stateParams.action;
    this.innerWidth = window.innerWidth;
  
    this.columns = [
      {
        field: 'sg_name',
        headerName: 'Account Description',
        filter: "agTextColumnFilter",
        flex: 3,
        minWidth: 200,
        headerClass: "text-left",
      },
      {
        field: 'credit',
        headerName: 'Capital & Liability',
        filter: "agTextColumnFilter",
        type: "rightAligned",
        flex: 1,
        minWidth: 100,
        cellStyle: { textAlign: 'end' },
        headerClass: "ag-right-aligned-header",
        cellRenderer: (data) => {
          return data.value ? this.decimalpipe.transform(data.value, '1.2-2') : '0.00';
        },
      },
      {
        field: 'debit',
        headerName: 'Assets',
        filter: "agTextColumnFilter",
        type: "rightAligned",
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
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    // this.gridApi.sizeColumnsToFit();
  }

  close() {
    this.location.back();
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
  printparam() {
    const bsOffcanvas = new bootstrap.Offcanvas('#offcanvasRight');
    bsOffcanvas.show();
    this.referance = Object.assign({}, this.entity);
    this.referance.reporttype = "1";
  }


  BalanceSheetprint() {

    this.myServiceUrl = "BalanceSheetReport";

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
          key: "edt", value: this.entity.edt,

        },
        {
          key: "reportType", value: this.referance.reporttype,
        },


      ]
    };
    this.rptMode = true;
  }

  Listshow() {

    var param = {
      firm_id: this.provider.companyinfo.company.firmCode,
      div_id: this.provider.companyinfo.company.divId,
      username: this.provider.companyinfo.company.userinfo.username,
      edt: this.entity.edt

    }
    this.http.get('BalanceSheet/getBalanceSheet', param).subscribe({
      next: (res: any) => {
        if (res.status_cd == 1) {
          this.list = res.data || [];
        } else {

          this.dialog.swal({ dialog: 'error', title: 'Error', message: res.errors.message });
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

    var params = {
      firm_id: this.provider.companyinfo.company.firmCode,
      branch_id: this.provider.companyinfo.company.branchCode,
      div_id: this.provider.companyinfo.company.divId,
      sg_code: index.data.sg_code,

    }

    this.savedDataService.setSavedDate(this.entity.edt);

    this.http.get('SubGroupList/SubGroupListItems', params).subscribe({
      next: (res: any) => {
        if (res.status_cd == 1) {
          this.list = res.data || [];
          index.data.account[0].sgCode = index.data.sg_code;
          index.data.account[0].sgName = index.data.sg_name;

          this.list.sgCode = index.data.account;
          this.router.navigate(['/grouplist'], { state: { list: this.list } });
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
}
