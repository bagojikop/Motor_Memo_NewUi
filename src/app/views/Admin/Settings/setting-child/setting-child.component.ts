import { Component, AfterViewInit, } from '@angular/core';
import { CommonModule, DatePipe, Location, DecimalPipe } from '@angular/common';
import { http, Master } from '../../../../assets/services/services';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { MyProvider } from '../../../../assets/services/provider';
import { DialogsComponent } from '../../../../assets/pg/dialogs/dialogs.component';
import { ReportDictionory } from '../../../../../../assets/service/interfaces';
import { v4 as uuidv4 } from 'uuid'
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { DssInputComponent } from '../../../../assets/mydirective/dss-input/dss-input.component';
import { ngselectComponent } from '../../../../assets/pg/ngselect/ngselect.component';
import { NavactionsComponent } from '../../../../assets/pg/navactions/navactions.component';
import { CurrencyMaskDirective } from "../../../../assets/mydirective/currencyMask/currency-mask.directive";
import { DTFormatDirective } from '../../../../assets/mydirective/mydirective.directive';
import { ArraySortPipe } from '../../../../assets/pipes/inrcrdr.pipe';
import { PdfReaderComponent } from '../../../../assets/pdf-reader/pdf-reader.component';
import { PdfViewerComponent, PdfViewerModule } from 'ng2-pdf-viewer';
import { GridApi, ColDef } from 'ag-grid-community';
import { AgGridModule } from 'ag-grid-angular';
import { UiSwitchModule } from 'ngx-ui-switch';
import { Router } from '@angular/router';

declare var bootstrap: any;

@Component({
  selector: 'app-setting-child',
  templateUrl: './setting-child.component.html',
  styleUrl: './setting-child.component.scss',
  imports: [FormsModule, CommonModule, UiSwitchModule, DTFormatDirective, AgGridModule, PdfViewerModule, CurrencyMaskDirective, PdfReaderComponent, ngselectComponent, NgSelectModule, DssInputComponent, NavactionsComponent],
  providers: [DatePipe, DecimalPipe, DialogsComponent, PdfReaderComponent, Master, ArraySortPipe, PdfViewerComponent, PdfViewerModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SettingChildComponent {
  entity: any = {};
  innerWidth: any;
  list: any = [];
  api: any;
  referance: any = {};
  stateParams: any;
  mode: any;
  rptMode: boolean = false;
  pdfSrc: string;
  myServiceUrl: string;
  gridParams: any = {};
  gridColumnApi: any;
  rowIndex: any = {};
  priceList: any = []
  stkGen: any = []
  pastEntity
  motormemo2AdvDetl:any={}
  constructor(
    private location: Location,
    private http: http,
    private dialog: DialogsComponent,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    this.entity = [];
    
    this.loadAccounts();

  }

  loadAccounts() {
    this.spinner.show();
    this.http.get('Setting/list').subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (res.status_cd == 1) {
          this.list = res.data;
         
        }
        else {
          this.dialog.swal({ dialog: 'error', title: 'Error', message: res.errors.exception.Message });
        }
        this.spinner.hide();
      }, error: (err: any) => {
        this.spinner.hide();
        this.dialog.swal({ dialog: 'error', title: 'Error', message: err.message });
      }
    })
  }

submit() {
  this.spinner.show();
  this.http.put('Setting/update', this.list,{ unitCode: this.entity.unitCode }).subscribe({
    next: (res: any) => {
      this.spinner.hide();
      if (res.status_cd == 1) {
        this.list = res.data;
        this.pastEntity = Object.assign({}, this.list);
        this.dialog.swal({ dialog: "success", title: "Success", message: "Record is Update sucessfully" });
      }

      this.spinner.hide()
    }, error: (err: any) => {
      this.dialog.swal({ dialog: 'error', title: 'Error', message: err })
    }
  })
}

  close() {
    this.location.back();
  }
}
