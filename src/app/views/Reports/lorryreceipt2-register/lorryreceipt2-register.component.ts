import { Component } from '@angular/core';
import { CommonModule, DatePipe, Location, DecimalPipe } from '@angular/common';
import { http, Master } from '../../../assets/services/services';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
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
import { PdfReaderComponent } from '../../../assets/pdf-reader/pdf-reader.component';
import { PdfViewerComponent, PdfViewerModule } from 'ng2-pdf-viewer';
import { ColDef } from 'ag-grid-community';
import { AgGridModule } from 'ag-grid-angular';
import { UiSwitchModule } from 'ngx-ui-switch';
declare var bootstrap: any;


@Component({
  selector: 'app-lorryreceipt2-register',
  templateUrl: './lorryreceipt2-register.component.html',
  styleUrl: './lorryreceipt2-register.component.scss',
  imports: [FormsModule, CommonModule, UiSwitchModule, DTFormatDirective, AgGridModule, PdfViewerModule, CurrencyMaskDirective, PdfReaderComponent, ngselectComponent, NgSelectModule, DssInputComponent, NavactionsComponent],
  providers: [DatePipe, DecimalPipe, DialogsComponent, PdfReaderComponent, Master, ArraySortPipe, PdfViewerComponent, PdfViewerModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Lorryreceipt2RegisterComponent {
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

  constructor(
    private provider: MyProvider,
    private location: Location,
  ) { }
  ngOnInit(): void {
    this.entity = {};
    this.entity.sdt = this.provider.companyinfo.finyear.fdt;
    this.entity.edt = this.provider.companyinfo.finyear.tdt;
    this.defaultColDef = {};
    this.stateParams = this.location.getState();
    this.mode = this.stateParams.action;
    this.innerWidth = window.innerWidth;


  }
  close() {
    this.location.back();
  }
  TrialBalprint() {
    this.myServiceUrl = "LorryReceipt2RegReport";

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

}
