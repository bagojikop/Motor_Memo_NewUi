import { Component, HostListener, ViewChild } from '@angular/core';
import { CommonModule, DatePipe, Location, DecimalPipe } from '@angular/common';
import { http, Master, NavbarActions } from '../../../assets/services/services';
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
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
declare var bootstrap: any;

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrl: './expenses.component.scss',
  imports: [FormsModule, CommonModule, DTFormatDirective, AgGridModule, PdfViewerModule, CurrencyMaskDirective, PdfReaderComponent, ngselectComponent, NgSelectModule, DssInputComponent, NavactionsComponent],
  providers: [DatePipe, DecimalPipe, DialogsComponent, PdfReaderComponent, Master, ArraySortPipe, PdfViewerComponent, PdfViewerModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ExpensesComponent {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  entity: any = {};
  reference: any = {}
  columns: ColDef[] = [];
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
    public provider: MyProvider,
    public navactions: NavbarActions,
    public master: Master,) {
    this.entity = {};
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
  }

  ngOnInit(): void {
    this.entity = {},
      this.reference = {}
    this.entity.sdt = this.provider.companyinfo.finyear.fdt;
    this.defaultColDef = {};
    this.stateParams = this.location.getState();
    this.mode = this.stateParams.action;
    this.innerWidth = window.innerWidth;

    var x = this.datepipe.transform(new Date(), 'yyyy-MM-dd') ?? '';
    this.entity.edt = this.provider.companyinfo.finyear.tdt >= x ? x : this.provider.companyinfo.finyear.tdt;

  }

  onSelectExp(ev) {
    this.entity.sundries = {};

    this.entity.sundries.sundryName = ev.sundryName;
    this.entity.accCodeNavigation = ev.accCodeNavigation;
  }
 

  close() {
    this.location.back();
  }
 
  daybookprint() {


    this.myServiceUrl = "ExpensesReport";

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
          key: "s_id", value: this.entity.s_Id,
        },
        {
          key: "sdt", value: this.entity.sdt,
        },
        {
          key: "edt", value: this.entity.edt,
        }

      ]
    };
    this.rptMode = true;
  }
}
