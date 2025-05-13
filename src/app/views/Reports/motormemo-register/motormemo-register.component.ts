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
  selector: 'app-motormemo-register',
  templateUrl: './motormemo-register.component.html',
  styleUrl: './motormemo-register.component.scss',
   imports: [FormsModule, CommonModule,UiSwitchModule, DTFormatDirective,AgGridModule, PdfViewerModule, CurrencyMaskDirective,PdfReaderComponent, ngselectComponent, NgSelectModule, DssInputComponent,  NavactionsComponent], 
  providers: [DatePipe, DecimalPipe, DialogsComponent, PdfReaderComponent, Master, ArraySortPipe, PdfViewerComponent, PdfViewerModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MotormemoRegisterComponent {
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
   ngOnInit(): void {
    this.entity = {};
    this.entity.sdt = this.provider.companyinfo.finyear.fdt;
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
      field: 'dt',
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
      field: 'lrno',
      headerName: 'L.R.No.',
      aggFunc: "sum",
      filter: "agTextColumnFilter",
      cellStyle: { textAlign: 'end' },
      headerClass: "ag-right-aligned-header",
      flex: 1,
      minWidth: 100,
      
    },{
      field: 'from',
      headerName: 'From',
      headerClass: "text-left",
      filter: "agTextColumnFilter",
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'to',
      headerName: 'To',
      headerClass: "text-left",
      filter: "agTextColumnFilter",
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'vehicle_no',
      headerName: 'Vehicle No',
      headerClass: "text-left",
      filter: "agTextColumnFilter",
      flex: 1,
      minWidth: 150,
      
    },
    {
      field: 'sundryName',
      headerName: 'Sundry Name',
      headerClass: "text-left",
      filter: "agTextColumnFilter",
      flex: 1,
      minWidth: 150,
    },
  
      {
      field: 'freight',
      headerName: 'Freight',
      aggFunc: "sum",
      filter: "agTextColumnFilter",
      cellStyle: { textAlign: 'end' },
      headerClass: "ag-right-aligned-header",
      minWidth: 100,
       cellRenderer: (data) => {
          return data.value ? this.decimalpipe.transform(data.value, '1.2-2') : '0.00';
        },
    },
    {
      field: 'charges',
      headerName: 'Expensess',
      aggFunc: "sum",
      filter: "agTextColumnFilter",
      cellStyle: { textAlign: 'end' },
      headerClass: "ag-right-aligned-header",
      minWidth: 100,
     cellRenderer: (data) => {
          return data.value ? this.decimalpipe.transform(data.value, '1.2-2') : '0.00';
        },
    },
    
      {
      field: 'leftAmount',
      headerName: 'Left Amount',
      aggFunc: "sum",
      filter: "agTextColumnFilter",
      cellStyle: { textAlign: 'end' },
      headerClass: "ag-right-aligned-header",
      minWidth: 100,
       cellRenderer: (data) => {
          return data.value ? this.decimalpipe.transform(data.value, '1.2-2') : '0.00';
        },
    },

    ]
    setTimeout(() => {
      this.generatePinnedBottomData();
    }, 100);

    var x = this.datepipe.transform(new Date(), 'yyyy-MM-dd')?? '';
    this.entity.edt = this.provider.companyinfo.finyear.tdt >= x ? x : this.provider.companyinfo.finyear.tdt;
  }
  generatePinnedBottomData() {
    let result = {
      'otherchag': 0,
      'charges': 0,
      'freight':0,
      'leftAmount':0,
      'creditDisplay': '',
      'debitDisplay': '',
      'totalDisplay': 'Total: otherchag 0.00, charges 0.00,freight 0.00,leftAmount 0.00'
    };

    const columnsWithAggregation = ['otherchag', 'charges','freight','leftAmount'];
    const filteredRows = this.api.getRenderedNodes().map(node => node.data);
    columnsWithAggregation.forEach(element => {
      filteredRows.forEach((rowData: any) => {
        const value = Number(rowData[element]) || 0;
        result[element] += value;
      });

    });

    result['totalDisplay'] = `Total: otherchag ${result['otherchag'].toFixed(2)}, charges ${result['charges'].toFixed(2)},freight ${result['freight'].toFixed(2)},leftAmount ${result['leftAmount'].toFixed(2)}`;
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
    this.myServiceUrl = "MotorMemoRegReport";

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
          key: "sdt", value: this.entity.sdt,

        },
        {
          key: "edt", value: this.entity.edt,

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
      firm_id: this.provider.companyinfo.company.firmCode,
      div_id: this.provider.companyinfo.company.divId,
      sdt:this.entity.sdt,
      edt: this.entity.edt
    }
    this.http.get('MotormemoReg/getmotormemoitem', param).subscribe({
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
