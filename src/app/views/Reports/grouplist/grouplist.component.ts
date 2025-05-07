import { Component} from '@angular/core';
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
declare var bootstrap:any;
@Component({
  selector: 'app-grouplist',
  templateUrl: './grouplist.component.html',
  styleUrl: './grouplist.component.scss',
  imports: [FormsModule, CommonModule,UiSwitchModule, DTFormatDirective,AgGridModule, PdfViewerModule, CurrencyMaskDirective,PdfReaderComponent, ngselectComponent, NgSelectModule, DssInputComponent,  NavactionsComponent], 
  providers: [DatePipe, DecimalPipe, DialogsComponent, PdfReaderComponent, Master, ArraySortPipe, PdfViewerComponent, PdfViewerModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class GrouplistComponent {
  entity: any = {};
  columns: ColDef[] = [];
  innerWidth: any;
  list: any = [];
  api: any;
  defaultColDef: ColDef = {};
  stateParams: any;
  mode: any;
  reference: any = {};
  rptMode: boolean = false;
  myServiceUrl: string;
  myReportDictionory: ReportDictionory = <ReportDictionory>{};
  gridColumnApi: any;
  private gridApi: GridApi;

  constructor(
    public location: Location,
    public http: http,
    private datepipe: DatePipe,
    private dialog: DialogsComponent,
    private spinner: NgxSpinnerService,
    public provider: MyProvider,
    private router: Router,
    private decimalpipe: DecimalPipe,
    public navactions: NavbarActions,
    public master: Master,) {
      this.entity = {};
    }


    ngOnInit(): void {
      this.entity = {};
      this.reference.groups = [];
      this.entity.sdt = this.provider.companyinfo.finyear.fdt;
      this.stateParams = this.location.getState();
      this.list = this.stateParams.list || [];
      this.mode = this.stateParams.action;
      this.innerWidth = window.innerWidth;
      this.entity.accSubGroups = { 'sgCode': '', sgName: "[ALL]" };
      
     
      this.defaultColDef = {
        sortable: true,
        floatingFilter: true,
        resizable: true,
      };
    
      this.columns = [
        {
          field: 'acc_name',
          headerName: 'Account Name',
          filter: "agTextColumnFilter",
          flex: 2,
          minWidth:200,           
          headerClass: "text-left",
        },
        {
          field: 'city_name',
          headerName: 'City',
          filter: "agTextColumnFilter",
          flex: 1,
          minWidth: 100,               
          headerClass: "text-left",
          
        },
        {
          field: 'mobile_no',
          headerName: 'Mobile No',
          filter: "agTextColumnFilter",
          flex: 1,
          minWidth: 100,               
          headerClass: "text-left",
        },
        {
          field: 'opening',
          headerName: 'Opening',
          filter: "agTextColumnFilter",
          flex: 1,
          minWidth: 100,              
          aggFunc: "sum",
          valueParser: "Number(newValue)",
          cellStyle: { textAlign: 'end' },
          headerClass: "ag-right-aligned-header",
          cellRenderer: (data) => {
            return data.value ? this.decimalpipe.transform(data.value, '1.2-2') : '0.00 ';
          },
        },
        {
          field: 'current',
          headerName: 'Current',
          filter: "agTextColumnFilter",
          minWidth: 100, 
          flex: 1,
          aggFunc: "sum",
          cellStyle: { textAlign: 'end' },
          headerClass: "ag-right-aligned-header",
          cellRenderer: (data) => {
            return data.value ? this.decimalpipe.transform(data.value, '1.2-2') : '0.00 ';
          },
        },
        {
          field: 'closing',
          headerName: 'Closing',
          filter: "agTextColumnFilter",
          flex: 1,
          minWidth: 100,               
          aggFunc: "sum",
          cellStyle: { textAlign: 'end' },
          headerClass: "ag-right-aligned-header",
          cellRenderer: (data) => {
            return data.value ? this.decimalpipe.transform(data.value, '1.2-2') : '0.00 ';
          },
        },
      ];
    
      setTimeout(() => {
        if (this.gridApi) {
          this.generatePinnedBottomData();
        }
      }, 100);

      var x = this.datepipe.transform(new Date(), 'yyyy-MM-dd') ?? '';
      this.entity.edt = this.provider.companyinfo.finyear.tdt >= x ? x : this.provider.companyinfo.finyear.tdt;
    }


    onGridReady(params) {
      this.api = params.api;
      this.gridApi = params.api;
      this.gridColumnApi = params.columnApi;
      // this.gridApi.sizeColumnsToFit();
    }
    getGroupObj(obj) {
      this.entity.groupCodeObj = obj;
    
    }
  
    close() {
      this.location.back();
    }

    getGroupOptions() {
      const allOption = { 'sgName': 'All', 'sgCode': '' };
      this.reference.unshift(allOption);
      return this.reference.sgCode;
    }
    SubGroupListprint() {
      this.myServiceUrl = "SubGroupListReport";
  
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
            key: "sg_code", value: this.reference.sgCode,
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

    printparam() {
      const bsOffcanvas = new bootstrap.Offcanvas('#offcanvasRight');
      bsOffcanvas.show();
      this.reference = Object.assign({}, this.entity);
  
    }
  
    generatePinnedBottomData() {
      let result = {
        'opening': 0,
        'current': 0,
        'closing': 0,
        'creditDisplay': '',
        'debitDisplay': '',
        'totalDisplay': 'Total: Opening 0.00, Current 0.00, closing 0.00'
      };
  
      const columnsWithAggregation = ['opening', 'current', 'closing'];
      const filteredRows = this.api.getRenderedNodes().map(node => node.data);
      columnsWithAggregation.forEach(element => {
        filteredRows.forEach((rowData: any) => {
          const value = Number(rowData[element]) || 0;
          result[element] += value;
        });
      });
  
      result['totalDisplay'] = `Total: Opening ${result['opening'].toFixed(2)}, Current ${result['current'].toFixed(2)}, Closing ${result['closing'].toFixed(2)}`;
      this.api.setPinnedBottomRowData([result]);
    }
  
    
    Listshow() {
      var param = {
        firm_id: this.provider.companyinfo.company.firmCode,
        div_id: this.provider.companyinfo.company.divId,
        sg_code: this.entity.sgCode,
        sdt: this.entity.sdt,
        edt: this.entity.edt
      }
      this.http.get('SubGroupList/getSubGroupListItems', param).subscribe({
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

    onCellClicked(index) {

      var params = {
        firm_id: this.provider.companyinfo.company.firmCode,
        div_id: this.provider.companyinfo.company.divId,
        acc_code: index.data.acc_code,
        sdt: this.entity.sdt,
        edt: this.entity.edt
  
      }
      this.http.get('Ledger/getLedgerItems', params).subscribe({
        next: (res: any) => {
          if (res.status_cd == 1) {
            this.list = res.data || [];
  
            index.data.accCode=index.data.acc_code;
            index.data.accName=index.data.acc_name;
    
            this.list.accCode=index.data;
            this.router.navigate(['/ledger'], { state: { list: this.list } });
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
