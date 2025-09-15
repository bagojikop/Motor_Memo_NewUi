import { Component} from '@angular/core';
import { CommonModule, DatePipe, Location,DecimalPipe } from '@angular/common';
import { http, Master } from '../../../assets/services/services';
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
import { AgGridModule } from 'ag-grid-angular';
import { UiSwitchModule } from 'ngx-ui-switch';
declare var bootstrap:any;

@Component({
  selector: 'app-trial-balance',
  templateUrl: './trial-balance.component.html',
  styleUrl: './trial-balance.component.scss',
  imports: [FormsModule, CommonModule,UiSwitchModule, DTFormatDirective,AgGridModule, PdfViewerModule, CurrencyMaskDirective,PdfReaderComponent, ngselectComponent, NgSelectModule, DssInputComponent,  NavactionsComponent], 
  providers: [DatePipe, DecimalPipe, DialogsComponent, PdfReaderComponent, Master, ArraySortPipe, PdfViewerComponent, PdfViewerModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TrialBalanceComponent {
  entity: any = {};
  columns: ColDef[] = [];
  innerWidth: any;
  list: any = [];
  api: any;
  referance: any = {};
  defaultColDef: ColDef = {};
  stateParams: any;
  mode: any;
  reference: any = {};
  rptMode: boolean = false;
  myServiceUrl: string;
  myReportDictionory: ReportDictionory = <ReportDictionory>{};
  gridColumnApi: any;

  constructor(private http: http,
    private spinner: NgxSpinnerService,
    private provider: MyProvider,
    private dialog: DialogsComponent,
    private location: Location,
    private datepipe: DatePipe,
    private decimalpipe: DecimalPipe,
   
  ) { }

  reportshowOptions = [
    { id: "1", value: "Summary" },
    { id: "2", value: "Detailed" }
  ];

  ngOnInit(): void {
    this.entity = {};
    this.entity.sdt = this.datepipe.transform(this.provider.companyinfo.finyear.fdt,'yyyy-MM-dd');
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
      field: 'group',
      headerName: 'Group Name',
      headerClass: "text-left",
      filter: "agTextColumnFilter",
      flex: 6,
      minWidth: 150,
    },
    {
      field: 'debit',
      headerName: 'Debit',
      aggFunc: "sum",
      filter: "agTextColumnFilter",
      cellStyle: { textAlign: 'end' },
      headerClass: "ag-right-aligned-header",
      flex: 3,
      minWidth: 100,

      cellRenderer: (data) => {
        const formattedValue = data.value ? this.decimalpipe.transform(data.value, '1.2-2') : '0.00';
        return formattedValue + ' Dr'
      },
    },
    {
      field: 'credit',
      headerName: 'Credit',
      aggFunc: "sum",
      filter: "agTextColumnFilter",
      cellStyle: { textAlign: 'end' },
      headerClass: "ag-right-aligned-header",
      minWidth: 100,
      flex: 3, cellRenderer: (data) => {
        const formattedValue = data.value ? this.decimalpipe.transform(data.value, '1.2-2') : '0.00';
        return formattedValue + ' Cr'
      },
    },

    ]
    setTimeout(() => {
      this.generatePinnedBottomData();
    }, 100);

    this.entity.to = this.datepipe.transform(this.provider.companyinfo.finyear.tdt,'yyyy-MM-dd')
    var x = this.datepipe.transform(new Date(), 'yyyy-MM-dd')?? '';
    this.entity.edt = this.entity.to >= x ? x : this.entity.to;
  }


  generatePinnedBottomData() {
    let result = {
      'credit': 0,
      'debit': 0,
      'creditDisplay': '',
      'debitDisplay': '',
      'totalDisplay': 'Total: Cramt 0.00, Dramt 0.00'
    };

    const columnsWithAggregation = ['credit', 'debit'];
    const filteredRows = this.api.getRenderedNodes().map(node => node.data);
    columnsWithAggregation.forEach(element => {
      filteredRows.forEach((rowData: any) => {
        const value = Number(rowData[element]) || 0;
        result[element] += value;
      });

    });

    result['totalDisplay'] = `Total: Cramt ${result['credit'].toFixed(2)}, Dramt ${result['debit'].toFixed(2)}`;
    this.api.setPinnedBottomRowData([result]);
  }

  onGridReady(params) {

    this.api = params.api;
    this.gridColumnApi = params.columnApi;
  }

  close() {
    this.location.back();
  }
  TrialBalprint() {
    this.myServiceUrl = "TrialBalanceReport";

    this.myReportDictionory = {
      reportCacheId: uuidv4(),
      reportParams: [
        
        {
          key: "sdt", value: this.referance.sdt,

        },
        {
          key: "edt", value: this.referance.edt,

        },

        {
          key: "reportOption", value: this.referance.reportOption,
        },

      ]
    };
    this.rptMode = true;
  }

  printparam() {
    const bsOffcanvas = new bootstrap.Offcanvas('#offcanvasRight');
    bsOffcanvas.show();
    this.referance = Object.assign({}, this.entity);
    this.referance.reportOption = "1";
  }

  Listshow() {
    var param = {
     
      edt: this.entity.edt
      
    }
    this.http.get('TrialBalance', param).subscribe({
      next: (res: any) => {
        if (res.status_cd == 1) {
          this.list = res.data || [];
        } else {
          this.dialog.swal({ dialog: 'error', title: 'Error', message: res.errors.exception.Message });
        }
        setTimeout(() => {
          this.generatePinnedBottomData();
        }, 1000);
        this.spinner.hide();
      }, error: (err: any) => {
        this.spinner.hide();
        this.dialog.swal({ dialog: 'error', title: 'Error', message: err.message });
      }
    })
  }
}
