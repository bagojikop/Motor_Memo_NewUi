import { Component} from '@angular/core';
import { CommonModule, DatePipe, Location,DecimalPipe } from '@angular/common';
import {  Master,  } from '../../../../assets/services/services';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MyProvider } from '../../../../assets/services/provider';
import { DialogsComponent } from '../../../../assets/pg/dialogs/dialogs.component';
import { ReportDictionory } from '../../../../../../assets/service/interfaces';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { DssInputComponent } from '../../../../assets/mydirective/dss-input/dss-input.component';
import { ngselectComponent } from '../../../../assets/pg/ngselect/ngselect.component';
import { NavactionsComponent } from '../../../../assets/pg/navactions/navactions.component';
import { CurrencyMaskDirective } from "../../../../assets/mydirective/currencyMask/currency-mask.directive";
import { DTFormatDirective } from '../../../../assets/mydirective/mydirective.directive';
import { ArraySortPipe } from '../../../../assets/pipes/inrcrdr.pipe';
import {PdfReaderComponent} from '../../../../assets/pdf-reader/pdf-reader.component';
import { PdfViewerComponent, PdfViewerModule } from 'ng2-pdf-viewer';
import { GridApi,ColDef } from 'ag-grid-community';
import {  AgGridModule } from 'ag-grid-angular';
import { UiSwitchModule } from 'ngx-ui-switch';

declare var bootstrap:any;
@Component({
  selector: 'app-profit-loss-child',
  templateUrl: './profit-loss-child.component.html',
  styleUrl: './profit-loss-child.component.scss',
  imports: [FormsModule, CommonModule,UiSwitchModule, DTFormatDirective,AgGridModule, PdfViewerModule, CurrencyMaskDirective,PdfReaderComponent, ngselectComponent, NgSelectModule, DssInputComponent,  NavactionsComponent], 
  providers: [DatePipe, DecimalPipe, DialogsComponent, PdfReaderComponent, Master, ArraySortPipe, PdfViewerComponent, PdfViewerModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProfitLossChildComponent {
  entity: any = {};
  columns: ColDef[]  = [];
  innerWidth: any;
  list: any = [];
  api: any;
  referance: any={};
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
    
    private location: Location,
    private decimalpipe: DecimalPipe,
    ) { }

    ngOnInit(): void {
      this.entity = {};
      this.reference.groups = [];
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
          field: 'acc_name',
          headerName: 'Accounts',
          filter: "agTextColumnFilter",
          maxWidth: 1000,
          flex: 2,
          headerClass: 'text-left',
        },
        {
          field: 'cramt',
          headerName: 'Credit',
          filter: "agTextColumnFilter",
          type: "rightAligned",
          maxWidth: 500,
          flex: 1,
          cellStyle: { textAlign: 'end' },
          headerClass: "ag-right-aligned-header",
          cellRenderer: (data) => {
            return data.value ? this.decimalpipe.transform(data.value, '1.2-2') : '0.00';
          },
        },
        {
          field: 'dramt',
          headerName: 'Debit',
          filter: "agTextColumnFilter",
          type: "rightAligned",
          maxWidth: 500,
          flex: 1,
          cellStyle: { textAlign: 'end' },
          headerClass: "ag-right-aligned-header",
          cellRenderer: (data) => {
            return data.value ? this.decimalpipe.transform(data.value, '1.2-2') : '0.00';
          },
        },
        
      ];
    }

    close() {
      this.location.back();
      }


      onGridReady(params) {
  
        this.api = params.api;
        this.gridColumnApi = params.columnApi;
      }
}
