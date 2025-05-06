import { Component, HostListener, NO_ERRORS_SCHEMA,ViewChild } from '@angular/core';
import { CommonModule, DatePipe, Location,DecimalPipe } from '@angular/common';
import { http, Master, NavbarActions } from '../../../assets/services/services';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { MyProvider } from '../../../assets/services/provider';
import { DialogsComponent } from '../../../assets/pg/dialogs/dialogs.component';
import { ReportDictionory } from '../../../../../assets/service/interfaces';
import { v4 as uuidv4 } from 'uuid'
import { ReceiptObj, acc00300Obj, recApproveObj, acc00301Obj } from '../../../assets/datatypests/receiptchild'
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { DssInputComponent } from '../../../assets/mydirective/dss-input/dss-input.component';
import { MydirectiveModule } from '../../../assets/mydirective/mydirective.module';
import { ngselectComponent } from '../../../assets/pg/ngselect/ngselect.component';
import { NavactionsComponent } from '../../../assets/pg/navactions/navactions.component';
import { CurrencyMaskDirective } from "../../../assets/mydirective/currencyMask/currency-mask.directive";
import { DTFormatDirective } from '../../../assets/mydirective/mydirective.directive';
import { ArraySortPipe } from '../../../assets/pipes/inrcrdr.pipe';
import { ActBtnComponent } from '../../../assets/pg/btn-cell-renderer/btn-cell-renderer.component';
import {PdfReaderComponent} from '../../../assets/pdf-reader/pdf-reader.component';
import { PdfViewerComponent, PdfViewerModule } from 'ng2-pdf-viewer';
import { GridApi,ColDef } from 'ag-grid-community';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import { UiSwitchModule } from 'ngx-ui-switch';
declare var bootstrap:any;
@Component({
  selector: 'app-ledger',
  templateUrl: './ledger.component.html',
  styleUrl: './ledger.component.scss',
  imports: [FormsModule, CommonModule,UiSwitchModule, DTFormatDirective,AgGridModule, PdfViewerModule, CurrencyMaskDirective,PdfReaderComponent, ngselectComponent, NgSelectModule, DssInputComponent,  NavactionsComponent], 
  providers: [DatePipe, DecimalPipe, DialogsComponent, PdfReaderComponent, Master, ArraySortPipe, PdfViewerComponent, PdfViewerModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LedgerComponent {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  entity: any = {};
  referance:any={}
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
  private gridApi: GridApi;
  gridResult: any = {};
  runningTotal=0
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
      // this.gridApi.sizeColumnsToFit();
  
    }

    YesNo = [
      { id: "1", value: "No" },
      { id: "2", value: "Yes" }
    ];

    ngOnInit(): void {
        this.entity = {};
        this.referance.groups = [];
        this.entity.sdt = this.provider.companyinfo.finyear.fdt;
        this.defaultColDef = {};
        this.stateParams = this.location.getState();
        this.mode = this.stateParams.action;
        this.innerWidth = window.innerWidth;
        this.defaultColDef = {
          sortable: true,
          floatingFilter: true,
          resizable: true,
       
        }

        this.columns = [
          {
            field: 'vch_date',
            headerName: 'Date',
            filter: "agTextColumnFilter",
            cellRenderer: (data) => {
              return this.datepipe.transform(data.value, 'dd-MM-yyyy');
            },
            width: 80,
            flex:1,
            headerClass: "text-left",
          },
          {
            field: 'vch_type_name',
            headerName: 'Type',
            filter: "agTextColumnFilter",
            width: 80,
            flex:1,
            headerClass: "text-left",
          },
          {
            field: 'challan_no',
            headerName: 'Challan No',
            filter: "agTextColumnFilter",
            width: 80,
            flex:1,
            headerClass: "text-left",
          },
          {
            field: 'refName',
            headerName: 'Description',
            filter: "agTextColumnFilter",
            width: 200,
            flex:2,
            headerClass: "text-left",
          },
          {
            field: 'dramt',
            headerName: 'Debit',
            filter: "agTextColumnFilter",
            width: 80,
            flex:1,
            aggFunc: "sum",
            editable: true,
            valueParser: "Number(newValue)",
            cellStyle: { textAlign: 'end' },
            headerClass: "ag-right-aligned-header",
            cellRenderer: (data) => {
              return data.value ? this.decimalpipe.transform(data.value, '1.2-2') : '0.00 ';
            },
          },
          {
            field: 'cramt',
            headerName: 'Credit',
            filter: "agTextColumnFilter",
            width: 80,
            flex:1,
            aggFunc: "sum",
            editable: true,
            valueParser: "Number(newValue)",
            cellStyle: { textAlign: 'end' },
            headerClass: "ag-right-aligned-header",
            cellRenderer: (data) => {
              return data.value ? this.decimalpipe.transform(data.value, '1.2-2') : '0.00 ';
            },
          },
          {
            field: 'balance',
            headerName: 'Balance',
            filter: "agTextColumnFilter",
            width: 100,
            editable: true,
            valueParser: "Number(newValue)",
            cellStyle: { textAlign: 'end' },
            headerClass: "ag-right-aligned-header",
            flex:1,
            cellRenderer: (data) => {
              const x = Number(data.value);
              const formattedValue = x ? this.decimalpipe.transform((x < 0 ? Math.abs(x) : x), '1.2-2') : '0.00';
              return x ? (x < 0 ? `${formattedValue} Dr` : `${formattedValue} Cr`) : '0.00';
            },
          },
        ];
    
    
        setTimeout(() => {
          if (this.gridApi) {
            // this.gridApi.sizeColumnsToFit();
            this.generatePinnedBottomData();
          }
        }, 100);


        var x = this.datepipe.transform(new Date(), 'yyyy-MM-dd')?? '';
        this.entity.edt = this.provider.companyinfo.finyear.tdt >= x ? x : this.provider.companyinfo.finyear.tdt;
      }
    
      Listshow(){
        this.runningTotal = 0;
        var param = {
          firm_id: this.provider.companyinfo.company.firmCode,
          div_id: this.provider.companyinfo.company.divId,
          acc_code: this.entity.accCode || this.list.accCode.accCode,
          sdt: this.entity.sdt,
          edt: this.entity.edt
        }
        this.http.get('Ledger/getLedgerItems', param).subscribe({
          next: (res: any) => {
            if (res.status_cd == 1) {
              this.list = res.data || [];
              // this.generatePinnedBottomData();
              this.OnIntCalculateRunningTotal();
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

      OnIntCalculateRunningTotal() {
        let runningTotal = 0;
        const rowData = this.list;
        if (rowData) {
          rowData.forEach(row => {
            row.balance = (row.cramt || 0) - (row.dramt || 0) + runningTotal;
            runningTotal = row.balance;
          });
        }
        this.gridApi?.setRowData(rowData);
        this.generatePinnedBottomData();
      }
      OnfilteredCalculateRunningTotal() {
        let runningTotal = 0;
        this.gridResult.cramt = 0;
        this.gridResult.dramt = 0;
        // Iterate over filtered rows
        this.gridApi?.forEachNodeAfterFilter(node => {
          const rowData = node.data;
          rowData.balance = (rowData.cramt || 0) - (rowData.dramt || 0) + runningTotal;
          runningTotal = rowData.balance;
          node.setData(rowData); // Update node data
          this.gridResult.cramt += rowData.cramt;
          this.gridResult.dramt += rowData.dramt;
    
        });
        this.generatePinnedBottomData();
      }
      onGridReady(params) {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
        // this.generatePinnedBottomData();
    
      }

      close() {
        this.location.back();
      }
      generatePinnedBottomData() {
    
        const columnsWithAggregation = ['cramt', 'dramt'];
    
        const totalPages = this.gridApi.paginationGetTotalPages();
    
        const result = {
          cramt: 0,
          dramt: 0,
          balance: 0,
        };
        let balance = 0;
       
        for (let page = 0; page < totalPages; page++) {
    
          this.gridApi.paginationGoToPage(page);
    
          const filteredRows = this.gridApi.getRenderedNodes().map(node => node.data);
    
         
          filteredRows.forEach((rowData) => {
            const cramt = Number(rowData.cramt) || 0;
            const dramt = Number(rowData.dramt) || 0;
            balance += cramt - dramt;
            result.cramt += cramt;
            result.dramt += dramt;
    
    
          })
         
    
        }
        result.balance = balance;
       
        this.gridApi.paginationGoToPage(0);
    
        setTimeout(() => {
          this.gridApi.setPinnedBottomRowData([result]);
        }, 500);
    
      }
      printparam() {

        const bsOffcanvas = new bootstrap.Offcanvas('#offcanvasRight');
        bsOffcanvas.show();
        this.referance.sdt = this.entity.sdt;
        this.referance.edt = this.entity.edt;
    
        this.referance.isPageBreak = "1";
        this.referance.isBCLedger = false;
      }
      getaccInforeferance(event) {
        if (event && event.accCode !== undefined && event.accCode !== null) {
          if (event.accCode === null) {
    
            this.referance.accCode = null;
          }
        }
      }
    
      groupChange(event) {
    
        this.referance.groupCodeObj = event.sgCodeNavigation;
        this.referance.grpByaccount = event;
        this.entity.accCodeNavigation = event
        //console.log(this.entity);
    
      }
      trackByIndex(index: number, item: any): number {
        return index;
      }

      getaccInfo(event) {

        console.log(event);
    
      }
    
      getAccountOptions() {
        const allOption = { 'accName': 'All', 'accCode': '' };
        this.referance.groups.unshift(allOption);
        return this.referance.groups;
      }
    
    
      getGroupObj(obj) {
        this.entity.groupCodeObj = obj;
      }
    
    
      OnGroupSelected(x) {
        this.referance.groupParams = { sgCode: x.sgCode || null }
      }
 
      Ladgerprint() {


        this.myServiceUrl = "LedgerReport";
    
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
              key: "acc_code", value: this.referance.accCode,
            },
            {
              key: "sdt", value: this.referance.sdt,
    
            },
            {
              key: "edt", value: this.referance.edt,
    
            },
            {
              key: "inventory", value: this.referance.inventory,
            },
            {
              key: "isPageBreak", value: this.referance.isPageBreak,
            },
            {
              key: "isBCLedger", value: this.referance.isBCLedger,
            },
            {
              key: "sg_code", value: this.referance.sggroup,
            }
          ]
        };
        this.rptMode = true;
      }
    
}
