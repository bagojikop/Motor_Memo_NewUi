import { Component } from '@angular/core';
import { CommonModule, DatePipe, Location, DecimalPipe } from '@angular/common';
import { http, Master } from '../../../../assets/services/services';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogsComponent } from '../../../../assets/pg/dialogs/dialogs.component';
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
import { AgGridModule } from 'ag-grid-angular';
import { UiSwitchModule } from 'ngx-ui-switch';

declare var $: any;

@Component({
  selector: 'app-dueties-taxes',
  templateUrl: './dueties-taxes.component.html',
  styleUrl: './dueties-taxes.component.scss',
  imports: [FormsModule, CommonModule, UiSwitchModule, DTFormatDirective, AgGridModule, PdfViewerModule, CurrencyMaskDirective, PdfReaderComponent, ngselectComponent, NgSelectModule, DssInputComponent, NavactionsComponent],
  providers: [DatePipe, DecimalPipe, DialogsComponent, PdfReaderComponent, Master, ArraySortPipe, PdfViewerComponent, PdfViewerModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DuetiesTaxesComponent {
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
  motormemo2AdvDetl: any = {}
  constructor(
    private location: Location,
    private http: http,
    private dialog: DialogsComponent,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    this.entity = {};
    this.entity.accCodeNavigation={}
    this.loadAccounts();

  }

  loadAccounts() {
    this.spinner.show();
    this.http.get('DuetiesTaxes/list').subscribe({
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

  save() {
    this.spinner.show();
    this.http.put('DuetiesTaxes/update', this.entity, { id: this.entity.id }).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (res.status_cd == 1) {
          this.list = res.data;
           $('#exampleModal').modal('hide');
          this.pastEntity = Object.assign({}, this.entity);
          this.dialog.swal({ dialog: "success", title: "Success", message: "Record is Update sucessfully" });
          this.loadAccounts();
        }

        this.spinner.hide()
      }, error: (err: any) => {
        this.dialog.swal({ dialog: 'error', title: 'Error', message: err })
      }
    })
  }

  editExpTablerow(item,i) { 
    this.entity=item;
     $('#exampleModal').modal('show');
  }

  close() {
    this.location.back();
  }
}
