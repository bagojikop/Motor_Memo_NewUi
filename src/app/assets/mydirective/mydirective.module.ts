
import { CUSTOM_ELEMENTS_SCHEMA,NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import {  CommonModule, CurrencyPipe, DatePipe, DecimalPipe, TitleCasePipe } from '@angular/common';
import { ArraySortPipe, dssDate, InrcrdrPipe, trimWhiteSpace } from '../pipes/inrcrdr.pipe';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UiSwitchModule } from 'ngx-ui-switch';
import { NgxPaginationModule } from 'ngx-pagination';
import { castFromArrayBuffer, CompressImageService, gridOptions, imgResize, Master, NavbarActions, ngselectpagination, share_data, toNumber, validation } from '../services/services';
import { NgxImageCompressService } from 'ngx-image-compress';
 
import {AgGridModule} from 'ag-grid-angular';
import { TestFilterPipe } from '../pipes/inrcrdr.pipe';
import { RdlcviewerComponent } from '../pg/rdlcviewer/rdlcviewer.component';
 
import { ActBtnComponent, AgGridCheckboxComponent, selectComponent } from '../pg/btn-cell-renderer/btn-cell-renderer.component';
import { DialogsComponent } from '../pg/dialogs/dialogs.component';
import { capitalizeDirective, decimalDirective,
     imguploadDirective, InputRestrictionDirective,
    minmaxDirective, noWhiteSpaceDirective, NumberOnlyDirective, 
    SpecialwithnumDirective,   DTFormatDirective, MinMaxNumberDirective, } from './mydirective.directive';
import { NgbAccordion, NgbModule, NgbPanel, NgbPanelContent, NgbPanelHeader, NgbPanelTitle, NgbPanelToggle, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { NavactionsComponent } from '../pg/navactions/navactions.component';

import { NgxSpinnerModule } from 'ngx-spinner'; 
//import { CurrencyMaskDirective } from './ngx-currency-mask/currency-mask.directive'; 
import { finDateDirective } from './findate/findate.directive';
import { DssPercentageModule } from 'dss-percentage';
import { CurrencyMaskModule } from 'dss-currency-mask';  
import { QuillModule } from 'ngx-quill'
import { NgHelperModule } from 'dss-ng-helper'; 
import {  UploadImageComponent } from '../upload-docs/upload-docs.component';
import { LineOfItemsComponent } from './line-of-items/line-of-items.component';
import { ngselectComponent } from '../pg/ngselect/ngselect.component'; 
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { DssGridComponent } from '../pg/dss-grid/dss-grid.component';
// import { DssDateFormatModule } from 'dss-date-format';
 
import { DssInputComponent } from './dss-input/dss-input.component';
import {CapitalizeModule} from 'dss-capitalize';
import "@angular/common/locales/global/en-IN";
import { MasternavComponent } from '../pg/masternav/masternav.component';


const array = [
  NavactionsComponent,
  RdlcviewerComponent,
  InrcrdrPipe,
  ArraySortPipe,
  dssDate,
  selectComponent,
  trimWhiteSpace,
  
]


@NgModule({
  
  imports: [
    NgSelectModule,
    CommonModule, 
    AgGridModule,
    QuillModule.forRoot(),
    // SimpleModalModule,
    NgbPopoverModule,
    CurrencyMaskModule,
    NgxPaginationModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    NgHelperModule,
    NgxSpinnerModule,
    UiSwitchModule,
    PdfViewerModule,
    DssPercentageModule,
    // Ng2SearchPipeModule,
    
   CapitalizeModule, 
  ],
   
  providers: [
    CompressImageService,
    NgxImageCompressService,
    CurrencyMaskModule,
    DTFormatDirective,
    castFromArrayBuffer,
    ActBtnComponent,
    LineOfItemsComponent, 
    DialogsComponent,
    InrcrdrPipe,
    gridOptions,
    NavbarActions,
 
    TitleCasePipe,
    selectComponent,
    validation,
    DecimalPipe,
    share_data, 
    Master,
    ngselectpagination,
    NavactionsComponent,
    TestFilterPipe,
    ArraySortPipe,
    DatePipe,
    CurrencyPipe,
    toNumber,
    imgResize,
    finDateDirective,
    AgGridCheckboxComponent,
    NumberOnlyDirective,
    // { provide: LOCALE_ID, useValue: "en-IN" }
    { provide: Window, useValue: window }
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MydirectiveModule { }

