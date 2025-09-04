
import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, EventEmitter, Input, NO_ERRORS_SCHEMA, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import discountOnList from './discounttype.json'
import { http } from '../../../assets/services/services';
import { MyProvider } from '../../../assets/services/provider';
import { Godown, invBatch, invItemsDesc, lineItem } from '../../../Models/comman';
import { Product, UOM, invItemFactor, invItemGst, invItemlocation } from '../../../Models/product';
import { DialogsComponent } from '../../pg/dialogs/dialogs.component';
import { CommonModule, DatePipe } from '@angular/common';
import { error } from 'jquery';
import '../../../Models/prototypes'
import { FormsModule } from '@angular/forms';

declare var $: any;
declare var bootstrap: any;

@Component({
  selector: 'app-lineOfItems',
  standalone:true,
  imports:[FormsModule,CommonModule],
  templateUrl: './line-of-items.component.html',
  styleUrls: ['./line-of-items.component.scss'],
  schemas:[CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA]
})
export class LineOfItemsComponent implements OnInit, AfterViewInit, OnChanges {
  @ViewChild("unitTable") unitTable: ElementRef;
  entity: any = {};
  reference: any = {};
  InvItemsDesc = <invItemsDesc>{};
  InvItemBatch: invBatch = <invBatch>{};
  //@ts-ignore
  warningMessage: string = null
  bthIndex;
  viewing: number;
  stockList: any = {};
  ref: any = {};
  list;
  salesRates;
  rowIndex: number;
  myCompany: any;
  @Input() show: boolean;
  @Input() name: string;
  @Input() cssclass: string;
  @Input() Obj: invItemsDesc = <invItemsDesc>{};
  @Input() disabled: boolean = false;
  @ViewChild('sidebar') sidebar: ElementRef<any>;
  //@ViewChild('slide') slide: ElementRef<any>;
  @ViewChild('batchNofocus') batchNofocus: ElementRef<any>;
  @Output() result = new EventEmitter<any>;
  @Input() columns: [];


  constructor(private http: http, private spinner: NgxSpinnerService,
    private datepipe: DatePipe,
    private provider: MyProvider, private dialog: DialogsComponent) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['show']) {
      if (this.show) {
        this.InvItemsDesc ={...this.Obj} //JSON.parse(JSON.stringify(this.Obj));
        //@ts-ignore
        if (!this.InvItemsDesc.itm.product)
//@ts-ignore
          this.InvItemsDesc.itm.product = <Product>{};

        if (this.Obj.mode == 1) {

          this.clearObj()
          this.newItem();
        }
        else {
        //@ts-ignore 
          if (!this.InvItemsDesc.itm.godown)
           //@ts-ignore
            this.InvItemsDesc.itm.godown = <Godown>{};

        }
        this.InvItemsDesc.discTypes = discountOnList;

        $("#InvItemsDesc").modal('show');
      }
    }
  }

  product: any;

  ngOnInit() {
    this.myCompany = this.provider.companyinfo.company;
    this.reference.items = [];
    this.InvItemsDesc.itm = <lineItem>{};
    this.clearObj()

  }



  ngAfterViewInit(): void {
    this.unitTable.nativeElement.append(this.sidebar.nativeElement);
    
    this.ref = {
      batchNo: '',
      expDate: '',
    }

  }



 
  getGWN() {
    if (!this.reference.godowns || this.reference.godowns.length == 0) {
      this.spinner.show();
      this.http.get("godown/list").subscribe({
        next: (res: any) => {
          this.reference.godowns = res.data;
          this.spinner.hide();
        }, error: err => {
          this.spinner.hide();
          Swal.fire({
            icon: 'error',
            text: err.message
          })
          //this.dialog.swal({ dialog: 'error', title: 'Error', message: err });
        }
      })
    }
  }
   async GstRates() {
    this.spinner.show();
    var params = {
       //@ts-ignore
      id: this.InvItemsDesc.itm.iId,
      vchDate: this.InvItemsDesc.vchDate
    }
    return new Promise((resolve,reject)=>{
     this.http.get('ProductInfo/getgstRate', params).subscribe({
      next: (res: any) => {
        if (res.status_cd == 1) {
           //@ts-ignore
          this.InvItemsDesc.itm.crate = res.data?.cgst;
           //@ts-ignore
          this.InvItemsDesc.itm.srate = res.data?.sgst;
           //@ts-ignore
          this.InvItemsDesc.itm.irate = res.data?.igst;
           //@ts-ignore
          this.InvItemsDesc.itm.csrate = res.data?.cess;
           //@ts-ignore
          this.InvItemsDesc.itm.effDate=this.datepipe.transform(res.data?.effDate,'yyyy-MM-dd');
          resolve(this.InvItemsDesc.itm)
          this.spinner.hide();
        } else {
          reject(res.errors.message)
          this.spinner.hide();
          //this.dialog.swal({ dialog: 'error', title: 'Error', message: "GST Rates Are Not Found" })

        }
        this.spinner.hide();
      }, error: (err: any) => {
         reject(err.message)
         
        this.spinner.hide();
        this.dialog.swal({ dialog: 'error', title: 'Error', message: err.message });
      }
    })
  })
  }


  dataP:any={};
  selectedItem(item) {
    if (item && item.iStockUnitNavigation?.unitCode) {
    //@ts-ignore
        if (!this.InvItemsDesc.itm.iId) {
              //@ts-ignore
          this.InvItemsDesc.itm.iId = item.iId
        }
    //@ts-ignore
         this.InvItemsDesc.itm.product = item;
        
        //this.dataP.product=item;
         // this.InvItemsDesc.itm = item;
             //@ts-ignore
        this.InvItemsDesc.itm.gwnCode = item.invItemlocation?.locationId;
            //@ts-ignore
        this.InvItemsDesc.itm.godown = item.invItemlocation?.location;
    //@ts-ignore
        if (!this.InvItemsDesc.itm.godown)
            //@ts-ignore
          this.InvItemsDesc.itm.godown = <Godown>{};
    //@ts-ignore
        if(this.InvItemsDesc.itm.product.invItemFactors){
              //@ts-ignore
        if (  this.InvItemsDesc.itm.product.invItemFactors.length == 0) {
              //@ts-ignore
          let uom: any = this.InvItemsDesc.itm.product.iStockUnitNavigation;
    //@ts-ignore
          this.InvItemsDesc.itm.product.invItemFactors.push(
            {
                  //@ts-ignore
              iId: this.InvItemsDesc.itm.product.iId,
              iFactor: 1,
              iUnit: uom.unitCode,
              srNo: 1,
              freeQtyOn: 0,
              freeQty: 0,
              discQtyOn: 0,
              discRate: 0,
              uid: 0,
              iRate: 0
            }
          )
          }


        }

    //@ts-ignore
        this.InvItemsDesc.itm.unit = this.InvItemsDesc.itm.altrUnit = this.InvItemsDesc.itm.ratePerUnit = item.iStockUnitNavigation?.unitCode;
           //@ts-ignore
        this.InvItemsDesc.itm.hsn = item.iHsn;
            //@ts-ignore
        this.InvItemsDesc.itm.rackNo = item.invItemlocation?.rackNo

        this.GstRates().then(res  => {
         
       
       

        var invItmGst: any = res;
        
        if (!invItmGst) {
          this.warningMessage = "GST rates not found...."
        }
        else
            //@ts-ignore
          this.warningMessage = null

        if (this.InvItemsDesc.stateType == 1) {
              //@ts-ignore
          this.InvItemsDesc.itm.srate = invItmGst?.srate || 0;
              //@ts-ignore
          this.InvItemsDesc.itm.crate = invItmGst?.crate || 0;
              //@ts-ignore
          this.InvItemsDesc.itm.irate = 0
              //@ts-ignore
          this.InvItemsDesc.itm.iamt = 0
        }
        else {    //@ts-ignore
          this.InvItemsDesc.itm.irate = invItmGst?.irate || 0;
              //@ts-ignore
          this.InvItemsDesc.itm.srate = 0;
              //@ts-ignore
          this.InvItemsDesc.itm.crate = 0;
              //@ts-ignore
          this.InvItemsDesc.itm.samt = 0;
              //@ts-ignore
          this.InvItemsDesc.itm.camt = 0;
        }
            //@ts-ignore
        this.InvItemsDesc.itm.csrate = invItmGst?.csrate || 0;
     }) 

      if (this.InvItemsDesc.SSO == "S" || this.InvItemsDesc.PO == 11) {
        var params = {
          iId: item.iId,
        };
        this.http.get('PriceList/getInclusiveRates', params).subscribe({
          next: (res: any) => {
            if (res.status_cd == 1) {
                  //@ts-ignore
              this.InvItemsDesc.itm.inclRate = res.data.rlRate;
              this.defineExclRate();
              this.spinner.hide();
            } else {
             // this.dialog.swal({ dialog: 'error', title: 'Error', message: "Batch Not Found" })
            }
            this.spinner.hide();
          }, error: (err: any) => {
            this.spinner.hide();
            this.dialog.swal({ dialog: 'error', title: 'Error', message: err.message });
          }
        })
      }


    } else {
          //@ts-ignore
      this.InvItemsDesc.itm.product = <Product>{};
    }

    this.getBatchStock(item);



  }



  newItem() {

    this.InvItemsDesc.itm = <lineItem>{
      qty: 0,
      freeQty: 0,
      inclRate: 0,
      rate: 0,
      crate: 0,
      srate: 0,
      irate: 0,
      csrate: 0,
      stateCsrate: 0,
      grossAmt: 0,
      camt: 0,
      samt: 0,
      iamt: 0,
      csamt: 0,
      csNonAdvlAmt: 0,
      stateCsamt: 0,
      stateCesNonAdvlAmt: 0,
      discountOn: 0,
      discRate: 0,
      disc1Amt: 0,
      disc2Amt: 0,
      assessValue: 0,
      totalCs: 0,
      totalGST: 0,
      othCharges: 0,
      totalitemValue: 0,
      saleRate: 0
    };

    this.InvItemsDesc.itm.product = <Product>{};
    this.InvItemsDesc.itm.product.invItemFactors = <invItemFactor[]>[];
    this.InvItemsDesc.bth = <invBatch[]>[];
    this.InvItemsDesc.itm.godown = <Godown>{};
    this.InvItemBatch = <invBatch>{};


  }

  saveLineItem() {
    if (this.InvItemsDesc.itm?.iId) {
      //this.save();
      this.sidebar.nativeElement.style.display = "none";
          //@ts-ignore
      this.InvItemsDesc.itm.iId=this.InvItemsDesc.itm.product.iId;
      
      this.result.emit(this.InvItemsDesc);
      this.closeStockList();
      if (this.Obj.mode != 1)
        $("#InvItemsDesc").modal('hide')
      else
        this.newItem();
    }
  }
  is_sidebar: boolean = false;
  //is_slide:boolean=false;
  showStockList() {

    if (this.InvItemsDesc.IO == "I") {
      if (this.InvItemsDesc.mode == 1) {
            //@ts-ignore
        this.InvItemBatch.billedQty = this.InvItemsDesc.itm.qty;
            //@ts-ignore
        this.InvItemBatch.freeQty = this.InvItemsDesc.itm.freeQty;
      }
    }
        //@ts-ignore
    if (this.InvItemsDesc.isBth && this.InvItemsDesc.itm.product.batch)
      this.sidebar.nativeElement.style.display = "inline";
        //@ts-ignore
    this.getBatchStock(this.InvItemsDesc.itm.product).then(res => {



    })

  }
  Sidebar() {

  }
  closeStockList() {
    this.is_sidebar = false;
    this.sidebar.nativeElement.style.display = "none";
  }

  closeInvItemsDesc() {
        //@ts-ignore
    this.InvItemsDesc.itm.product = <Product>{};
    this.closeStockList();
    $("#InvItemsDesc").modal('hide')
    
    this.result.emit(null);
  }

  clearObj() {
        //@ts-ignore
    this.warningMessage = null;
    this.reference.item = {};
    this.InvItemsDesc = <invItemsDesc>{};
    this.InvItemsDesc.IO = this.Obj.IO;
    this.InvItemsDesc.mode = this.Obj.mode;
    this.InvItemsDesc.isBth = this.Obj.isBth;
    this.InvItemsDesc.PO = this.Obj.PO;
    this.InvItemsDesc.SSO = this.Obj.SSO;
    this.InvItemsDesc.GO = this.Obj.GO;
    this.InvItemsDesc.vchDate = this.Obj.vchDate;
    this.InvItemsDesc.accCode = this.Obj.accCode;
    this.InvItemsDesc.stateType = this.Obj.stateType;

    this.InvItemsDesc.itm = <lineItem>{};
    this.InvItemsDesc.bth = <invBatch[]>[];
    this.InvItemsDesc.itm.product = <Product>{};
    this.InvItemsDesc.itm.godown = <Godown>{};
    this.InvItemsDesc.itm.product.invItemlocation = <invItemlocation>{};
    this.InvItemsDesc.itm.product.invItemlocation.location = <Godown>{};

    this.InvItemBatch = <invBatch>{};

    this.reference.Fields = [
      {
        field: 'iName',
        headerName: 'Item',
        filter: "agTextColumnFilter",
        width: 350
      }
    ]

    this.reference.GWNFields = [
      {
        field: 'lName',
        headerName: 'Godowns',
        filter: "agTextColumnFilter",
        width: 350
      }
    ]
  }

  gstRate(key) {
    return (Number(key.crate) + Number(key.srate) + Number(key.irate)).round(2);
  }

  discount(key) {
    return (Number(key.disc1Amt) + Number(key.disc2Amt)).round(2);
  }



  defineRate(rateUnit: string, billedUnit: string) {
    //@ts-ignore
    var RatePerUnit = this.InvItemsDesc.itm.product.invItemFactors.filter((factor) => factor.iUnit == rateUnit)[0];
    //@ts-ignore
    var BilledUnit = this.InvItemsDesc.itm.product.invItemFactors.filter((factor) => factor.iUnit == billedUnit)[0];

    var qty = 1;
    if (RatePerUnit?.srNo < BilledUnit?.srNo) {

      for (var i = RatePerUnit.srNo; i <= BilledUnit.srNo; i++)
          //@ts-ignore
        this.InvItemsDesc.itm.product.invItemFactors.filter((factor) => {
          if (factor.srNo == i) {
            qty = (qty * factor.iFactor)
          }
        });

    }
    else if (RatePerUnit?.srNo > BilledUnit?.srNo) {

      for (var i = BilledUnit.srNo; i <= RatePerUnit.srNo; i++)
    //@ts-ignore
        this.InvItemsDesc.itm.product.invItemFactors.filter((factor) => {
          if (factor.srNo == i) {
            qty = (qty / factor.iFactor)
          }
        });



    }

    return qty;



  }
  defineDiscount(billedUnit: string) {
        //@ts-ignore
    var discount = this.InvItemsDesc.itm.product.invItemFactors.filter((factor) => factor.iUnit == billedUnit)[0];
    return { discQtyOn:discount.discQtyOn,discRate:discount.discRate}
    
  }
  defineFreeQty(billedUnit: string, billedQty: number) {
        //@ts-ignore
    var Unit = this.InvItemsDesc.itm.product.invItemFactors.filter((factor) => factor.iUnit == billedUnit)[0];
    return Math.floor(billedQty / Unit?.freeQtyOn * Unit?.freeQty);
  }
  defineExclRate() {
    var gstrate = this.gstRate(this.InvItemsDesc.itm)
        //@ts-ignore
    this.InvItemsDesc.itm.rate = (Number(this.InvItemsDesc.itm.inclRate) * 100 / (100 + gstrate)).round(3)
    this.lineGrossAmt();
  }
  defineInclRate() {
    var gstrate = this.gstRate(this.InvItemsDesc.itm)
        //@ts-ignore
    this.InvItemsDesc.itm.inclRate = (Number(this.InvItemsDesc.itm.rate) + Number(this.InvItemsDesc.itm.rate) * gstrate / 100).round(2)
    this.lineGrossAmt();
  }


  lineGrossAmt() {
    var item = this.InvItemsDesc.itm;
    //@ts-ignore
    var billedfactorQty = this.defineRate(item.ratePerUnit, item.unit);
        //@ts-ignore
    item.grossAmt = (billedfactorQty * Number(item.qty) * Number(item.rate)).round(2);
        //@ts-ignore
    item.freeQty = this.defineFreeQty(item.unit, Number(item.qty));
    // if(item.product.isSchemeApply &&  new Date(this.InvItemsDesc.vchDate) >= new Date(item.product.schemeFrom) && new Date(this.InvItemsDesc.vchDate)<=new Date(item.product.schemeTo))
    // {
    // var discObj=this.defineDiscount(item.unit);
    
    // item.discRate=discObj.discRate;
    // item.discountOn=0;
    // }
        //@ts-ignore
    var invFactorBilledQty = this.defineRate(item.altrUnit, item.unit);
        //@ts-ignore
    item.altrQty = invFactorBilledQty * (Number(item.qty) + (isNaN(item.freeQty) ? 0 : Number(item.freeQty)));
    ////var invFactorRateQty = this.defineRate(item.altrUnit, item.ratePerUnit);
        //@ts-ignore
    item.altrRate = (((item.grossAmt / item.altrQty) * 100) / 100).round(3);
   // this.lineDiscount(discObj.discQtyOn);
    this.lineDiscount();
  }

  //lineDiscount(OnQty) {
    lineDiscount(){
    var itm = this.InvItemsDesc.itm;

   // var ApplicableQty= Number(itm.qty)- OnQty?? 0 >0 ? Number(itm.qty) :0;
    //@ts-ignore
    if (itm.discountOn == 0) {
      //itm.disc1Amt = ApplicableQty * Number(itm.discRate);
          //@ts-ignore
      itm.disc1Amt = Number(itm.qty) * Number(itm.discRate);
          //@ts-ignore
    } else if (itm.discountOn == 1) {
          //@ts-ignore
      itm.disc1Amt = Number(itm.altrQty) * Number(itm.discRate);
          //@ts-ignore
    } else if (itm.discountOn == 2) {
          //@ts-ignore
      itm.disc1Amt = (Number(itm.grossAmt) * Number(itm.discRate) / 100).round(2);
    }

    //itm.disc2Amt = (Number((itm.grossAmt)-Number(itm.disc1Amt)) * Number(itm.product.discRate|| 0) / 100).round(2);

    this.lineTaxableAmt();
  }
  lineTaxableAmt() {
    var itm = this.InvItemsDesc.itm;
        //@ts-ignore
    itm.assessValue = (Number(itm.grossAmt) - Number(itm.disc1Amt) - Number(itm.disc2Amt)).round(2);
        //@ts-ignore
    itm.camt = (itm.assessValue * Number(itm.crate) / 100).round(2);
        //@ts-ignore
    itm.samt = (itm.assessValue * Number(itm.srate) / 100).round(2);
        //@ts-ignore
    itm.iamt = (itm.assessValue * Number(itm.irate) / 100).round(2);
        //@ts-ignore
    itm.csamt = (itm.assessValue * Number(itm.csrate) / 100).round(2);
        //@ts-ignore
    itm.stateCsamt = (itm.assessValue * Number(itm.stateCsrate) / 100).round(2);

    this.lineTotalAmt()
  }
  lineTotalAmt() {
    var itm = this.InvItemsDesc.itm;
        //@ts-ignore
    itm.totalGST = Number(itm.camt) + Number(itm.samt) + Number(itm.iamt);
        //@ts-ignore
    itm.totalCs = Number(itm.csamt) + Number(itm.stateCsamt) + Number(itm.stateCesNonAdvlAmt) + Number(itm.csNonAdvlAmt);
        //@ts-ignore
    itm.totalitemValue =(Number(itm.assessValue) + Number(itm.totalGST) + Number(itm.totalCs) + Number(itm.othCharges)).round(2);

  }

  saveInvItemsDescBth() {
    if (!this.InvItemsDesc.bth || Object.keys(this.InvItemsDesc.bth).length == 0) { this.InvItemsDesc.bth = [] };

    if (this.rowIndex == null) {
      this.InvItemsDesc.bth.push(this.InvItemBatch);
    } else {

      this.InvItemsDesc.bth[this.rowIndex] = this.InvItemBatch;
    }
    this.InvItemBatch = <invBatch>{};
        //@ts-ignore
    this.rowIndex = null;
    this.TotalBilledQty();
    this.TotalFreeQty();
    //this.fn();
    //this.TotalSaleRate();

    // if (this.InvItemsDesc.bthIndex)
    //   this.InvItemsDesc.bth[this.InvItemsDesc.bthIndex] = this.InvItemBatch;
    // else
    //   this.InvItemsDesc.bth.push(this.InvItemBatch)

    // this.batchNofocus.nativeElement.focus();
    // this.InvItemBatch={};
    // this.InvItemsDesc.bthIndex = null;

  }


  saveInvItemsDesc() {

    if (this.InvItemsDesc.isBth) {
      var billedqty = 0;
      var freeqty = 0;
          //@ts-ignore
      this.InvItemsDesc.bth.forEach(element => {
        billedqty += Number(element.billedQty | 0);
        freeqty += Number(element.freeQty | 0)
      });
      var batchQty = Number(this.InvItemsDesc.totalBilledQty) + Number(this.InvItemsDesc.totalFreeQty);
          //@ts-ignore
      var itmQty = Number(this.InvItemsDesc.itm.qty | 0) + Number(this.InvItemsDesc.itm.freeQty | 0);
          //@ts-ignore
      if (batchQty != itmQty || this.InvItemsDesc.totalBilledQty!=this.InvItemsDesc.itm.qty || this.InvItemsDesc.totalFreeQty!=this.InvItemsDesc.itm.freeQty) {
        alert("Batch Qty is not matched, please try again....  ");
      }
      else {
        this.closeStockList();
      }

    }

  }




  save() {
    if (this.InvItemsDesc.IO == "I") {
      this.saveInvItemsDesc();
    } else {
      this.saveInvItemsBatch();
    }
  }

  saveInvItemsBatch() {
    if (this.InvItemsDesc.isBth) {
      var billedqty = 0;
      var freeqty = 0;
      var bths = [];
          //@ts-ignore
      this.InvItemsDesc.bth.forEach(element => {
        billedqty += Number(element.billedQty | 0);
        freeqty += Number(element.freeQty | 0);
        if (element.checked == true) {
              //@ts-ignore
          bths.push(element)
        }
      });
      this.InvItemsDesc.bth = bths;
      var batchQty = Number(this.InvItemsDesc.totalBilledQuantity) + Number(this.InvItemsDesc.totalFreeQuantity);
          //@ts-ignore
      var itmQty = Number(this.InvItemsDesc.itm.qty | 0) + Number(this.InvItemsDesc.itm.freeQty | 0);
      if (batchQty != itmQty) {
        alert("Batch Qty is not matched, please try again....  ");
        this.StockCount();
      }
      else {
        this.closeStockList();
      }
      //this.AverageSaleRate();
      //this.defineExclRate();

    }

  }
  clear(s) {
    s.checked == false;
  }
  delInvItemsDescBth(i) {
        //@ts-ignore
    this.InvItemsDesc.bth.splice(i, 1);
    this.TotalBilledQty();
    this.TotalFreeQty();
    //this.TotalSaleRate();
  }
  editIndex: number;
  editInvItemsDescBth(s, i) {
        //@ts-ignore
    this.rowIndex = this.InvItemsDesc.bth.indexOf(s);
    this.InvItemBatch = Object.assign({}, s);

    // this.InvItemsDesc.bthIndex = index;
    // this.InvItemsDesc.bth = this.InvItemBatch[index];

  }

  TotalBilledQty() {
        //@ts-ignore
    if (this.InvItemsDesc.bth.length > 0) {
          //@ts-ignore
      var sumArray = this.InvItemsDesc.bth.map(item => {
        return item.billedQty;
      });

      var sumValue = sumArray.reduce(function (pValue, cValue) {
        return Number(pValue) + Number(cValue)

      });

      this.InvItemsDesc.totalBilledQty = sumValue;
    }
  }


  TotalFreeQty() {
        //@ts-ignore
    if (this.InvItemsDesc.bth.length > 0) {
          //@ts-ignore
      var sumArray = this.InvItemsDesc.bth.map(item => {
        return item.freeQty;
      });

      var sumValue = sumArray.reduce(function (pValue, cValue) {
        return Number(pValue) + Number(cValue)

      });

      this.InvItemsDesc.totalFreeQty = sumValue;
    }
  }

  TotalSaleRate() {
        //@ts-ignore
    var sumArray = this.InvItemsDesc.bth.map(item => {
      //if (item.isInclGst)

      return item.saleRate * item.billableQty;
      // else
      //return item.saleRate +(item.saleRate*(this.InvItemsDesc.itm.crate+this.InvItemsDesc.itm.srate+this.InvItemsDesc.itm.irate)/100)
    });

    var sumValue = sumArray.reduce(function (pValue, cValue) {
      return Number(pValue) + Number(cValue)

    });

    this.InvItemsDesc.totalSaleValue = sumValue;
  }

  AverageSaleRate() {
    //@ts-ignore
    this.InvItemsDesc.itm.inclRate = (Number(this.InvItemsDesc.totalSaleValue) / Number(this.InvItemsDesc.totalBilledQuantity)).round(2);
  }



  getBatchStock(item) {
    return new Promise((resolve, reject) => {
      if (this.InvItemsDesc.IO != "I") {
        // if (this.InvItemsDesc.bth.length == 0) {
        var params = {
          iId: item.iId,
          firmId: this.myCompany.firmCode,
          branchId: this.myCompany.branchCode,
          divId: this.myCompany.divId

        };
        //this.http.get('InventoryBatchs/Batch', params).subscribe({
          this.http.get('purchaseInvoice/Batch', params).subscribe({
          next: (res: any) => {
            if (res.status_cd == 1) {
              this.stockList = [...res.data];
              this.spinner.hide();
              this.StockCount();

              setTimeout(resolve, 500)


            } else {
              //this.dialog.swal({ dialog: 'error', title: 'Error', message: "Batch Not Found" })
            }

            this.spinner.hide();
          }, error: (err: any) => {
            reject(err);
            this.spinner.hide();
            this.dialog.swal({ dialog: 'error', title: 'Error', message: err.message });
          }
        })

        // }
      }

    })
  }

  ItemChange(index) {
    this.InvItemsDesc.bth = [];
    this.reference.PurchaseInvoice = {};
    this.reference.PurchaseInvoice = Object.assign({}, index);
    this.totalUsedQty();
  }

  StockCount() {
    if (this.InvItemsDesc.IO == "O") {
      this.InvItemsDesc.bth = [...this.stockList] //JSON.parse(JSON.stringify(this.stockList));
      this.reference.bth = this.InvItemsDesc.bth;

      let freeQty: number = 0;
      let billableQty: number = 0

      for (var i = 0; i < this.InvItemsDesc.bth.length; i++) {
        let usedQty = freeQty + billableQty;
            //@ts-ignore
        let targetQty = Number(this.InvItemsDesc.itm.qty) + Number(this.InvItemsDesc.itm.freeQty);
        if (usedQty < targetQty) {
          const element = this.InvItemsDesc.bth[i];
              //@ts-ignore
          let b = this.InvItemsDesc.itm.qty - billableQty || 0;
              //@ts-ignore
          let f = this.InvItemsDesc.itm.freeQty - freeQty || 0;

          element.freeQty = f - element.billedQty > 0 ? element.billedQty : f;
          element.billableQty = b - (element.billedQty - element.freeQty) > 0 ? element.billedQty - element.freeQty : b;



          // element.usedQty = q - element.billedQty > 0 ? element.billedQty : q;
          element.checked = element.freeQty + element.billableQty > 0;
          freeQty += element.freeQty;
          billableQty += element.billableQty;

        }
        else
          break;

      };

      this.resetStockTableDisable();

    }

  }


  // Batch(){
  //   if(this.InvItemsDesc.bthIndex <=0){
  //     var params = {
  //       iId: this.InvItemsDesc.itm.iId,
  //       firmId: this.myCompany.firmCode,
  //       branchId: this.myCompany.branchCode,
  //       divId: this.myCompany.divId

  //     };
  //     this.http.get('PurchaseInvoice/Batch', params).subscribe({
  //       next: (res: any) => {
  //         if (res.status_cd == 1) {
  //           this.stockList = [...res.data];

  //           this.spinner.hide();
  //           this.StockCount();

  //         } else {
  //           this.dialog.swal({ dialog: 'error', title: 'Error', message: res.errors.exception.Message })
  //         }

  //         this.spinner.hide();
  //       }, error: (err: any) => {

  //         this.spinner.hide();
  //         this.dialog.swal({ dialog: 'error', title: 'Error', message: err.message });
  //       }
  //     })
  //   }
  // }

  totalUsedQty() {
        //@ts-ignore
    var sumBilledArray = this.InvItemsDesc.bth.map(item => {
      return item.billableQty;
    });



    var sumBilledQty: number;
    if (sumBilledArray.length > 0) {
      sumBilledQty = sumBilledArray.reduce(function (pValue, cValue) {
        return Number(pValue || 0) + Number(cValue || 0)
      });
    }
        //@ts-ignore
    var sumFreeQtyArray = this.InvItemsDesc.bth.map(item => {
      return item.freeQty;
    });

    var sumFreeQty: number;
    if (sumFreeQtyArray.length > 0) {
      sumFreeQty = sumFreeQtyArray.reduce(function (pValue, cValue) {
        return Number(pValue || 0) + Number(cValue || 0)
      });
    }
        //@ts-ignore
    this.InvItemsDesc.totalBilledQuantity = sumBilledQty;
        //@ts-ignore
    this.InvItemsDesc.totalFreeQuantity = sumFreeQty;
  }
  clearQty(s) {
    s.freeQty = 0;
    s.billableQty = 0;
    let x: number;

    if (s.checked == true) {
    //@ts-ignore
      x = this.InvItemsDesc.IO == "I" ? this.InvItemsDesc.itm.freeQty - this.InvItemsDesc.totalFreeQty : this.InvItemsDesc.itm.freeQty - this.InvItemsDesc.totalFreeQuantity;
      s.freeQty = s.billedQty < x ? s.billedQty : x;
          //@ts-ignore
      x = this.InvItemsDesc.IO == "I" ? this.InvItemsDesc.itm.qty - this.InvItemsDesc.totalBilledQty : this.InvItemsDesc.itm.qty - this.InvItemsDesc.totalBilledQuantity;
      s.billableQty = s.billedQty - s.freeQty < x ? s.billedQty - s.freeQty : x;


    }


    this.resetStockTableDisable();
  }

  AllChecked() {
    this.ref.batchNo = "";
    this.ref.expDate = "";
    if (this.InvItemsDesc.checked1 == true)
      this.StockCount();
    else {
          //@ts-ignore
      this.InvItemsDesc.bth.forEach(s => {

        s.checked = false;
        s.billableQty = 0;
        s.freeQty = 0;

      })
    }
    this.resetStockTableDisable();
  }
  //  check(s){
  //   if(s.billableQty){
  //     s.checked=true;
  //   }
  //  }
  //  check1(s){
  //   if(s.freeQty){
  //     s.checked=true;
  //   }
  //  }
  BatchSearched() {

    this.InvItemsDesc.bth = this.reference.bth.filter(x => x.batchNo.includes(this.ref.batchNo))

  }
  DateSearched() {
    this.InvItemsDesc.bth = this.reference.bth.filter(x => x.expDate.includes(this.ref.expDate))
  }

  resetStockTableDisable() {

    this.totalUsedQty();
        //@ts-ignore
    this.InvItemsDesc.bth.forEach(s => {
      if (!s.checked) {
            //@ts-ignore
        if (this.InvItemsDesc.itm.qty == this.InvItemsDesc.totalBilledQty && this.InvItemsDesc.itm.freeQty == this.InvItemsDesc.totalFreeQty) {
          s.disabled = true;
        } else {
          s.disabled = false;
        }
      }

    })
    //this.TotalSaleRate();
  }
  disabledsave() {
        //@ts-ignore
    if (!this.InvItemsDesc.PO && this.InvItemsDesc.itm.inclRate && this.InvItemsDesc.itm.qty || this.InvItemsDesc.SO) {
      return false;
    }
    else if (this.InvItemsDesc.PO || this.InvItemsDesc.SO) {
      return false;
    }
    
    else {
      return true;
    }
  }

  showSalesRates() {
    var param = {
      accCode: this.InvItemsDesc.accCode,
          //@ts-ignore
      iId: this.InvItemsDesc.itm.iId,
      firmId: this.myCompany.firmCode,
      branchId: this.myCompany.branchCode,
      div_id: this.myCompany.divId
    }
    this.spinner.show();
    this.http.get("salesInvoice/getSalesRates", param).subscribe((res: any) => {
      if (res.status_cd == 1) {
        this.salesRates = res.data;

      } else {
        this.dialog.swal({ dialog: 'error', title: 'Error', message: res.errors.exception.Message })
      }

      $("#salesRate").modal('show');
      this.spinner.hide();
    }, err => {
      this.dialog.swal({ dialog: 'error', title: 'Error', message: err.message });
    })

    //$("#purchaseRate").modal('show')
  }
  closesalesRate() {
    $("#salesRate").modal('hide')
  }
  closepurchaseRate() {
    this.entity.margine={};
    $("#purchaseRate").modal('hide')
  }
  calculateSaleRate() {
    const x = this.entity.margine;
    this.list.forEach(element => {
      if (x)
       var y = (x * Number(element.inclRate) / 100).round(2);
          //@ts-ignore
       element.saleRate=y+element.inclRate;
      
      
    });
  }
  showPurRates() {
    var params = {
          //@ts-ignore
      iId: this.InvItemsDesc.itm.iId,
      firmId: this.myCompany.firmCode,
      branchId: this.myCompany.branchCode,
      div_id: this.myCompany.divId

    }
    this.spinner.show();
    this.http.get("purchaseInvoice/getPurchaseRates", params).subscribe((res: any) => {
      if (res.status_cd == 1) {
        this.list = res.data;

      } else {
        this.dialog.swal({ dialog: 'error', title: 'Error', message: res.errors.exception.Message })
      }

      $("#purchaseRate").modal('show');
      this.spinner.hide();
    }, err => {
      this.dialog.swal({ dialog: 'error', title: 'Error', message: err.message });
    })
  }
}
