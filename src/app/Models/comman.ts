import {Product } from './product'
import { purchaseInvoiceItem } from './purchaseInvoice'
import { purchaseOrderItem } from './purchaseOrder'
import { salesInvoiceItem } from './salesInvoice'
import { salesOrderItem } from './salesOrder'

export interface lineItem {
    vchId: number
    detlId: number
    iId: number
    hsn: string
    unit: string    
    qty: number
    inclRate: number
    rate: number
    grossAmt: number
    discountOn: number
    discRate: number
    disc1Amt: number
    disc2Amt: number
    assessValue: number
    crate: number
    srate: number
    irate: number
    csrate: number
    camt: number
    samt: number
    iamt: number
    csamt: number
    stateCsrate: number
    stateCsamt: number
    csNonAdvlAmt: number
    stateCesNonAdvlAmt: number
    othCharges: number
    totalItemAssValue: number
    freeQty: number
    ratePerUnit: string
    altrUnit: string
    altrQty: number
    altrRate: number
    totalCs: number
    totalGST: number
    product?: Product
    totalItemOthCharges:number
    totalStateNonAdvlAmt:number
    totalNonAdvlAmt:number
    totalStateCsAmt:number
    totalCsAmt:number
    totalIamt:number
    totalSamt:number
    totalCamt:number
    totalitemValue:number
    location:any
    piBatch?: invBatch  
    batch:invBatch
    saleRate:number
    isInclGst:number
    checked:any
    totalFreeQty:number
    totalBilledQty:number
    totalUsedQty:number
    totalBilledQuantity:number
    totalFreeQuantity:number
    checked1:any
    includeingGST:string
    //iStockUnitNavigation:any,
    // invItemFactors:any
    // invItemGsts:any
    totalSaleValue:number,
    poDetlId:number
    soDetlId:number
    piDetlId:number
    siDetlId:number
    purchaseReturnBatchs?: invBatch 
    purchasediscountbatch?:invBatch
    salediscountbatchs?:invBatch
    salesReturnBatchs?:invBatch
    salesInvoiceBatchs?:invBatch
    purcahseOrderItem:purchaseOrderItem
    salesOrderItem:salesOrderItem
    //purchaseInvoiceItem:invBatch
    purchaseReturnItem:invBatch
    purchaseInvoiceItem:purchaseInvoiceItem
    salesInvoiceItem:salesInvoiceItem
    gwnCode:number
    rackNo:string
    godown?:Godown
    barCode:number
    diffRate:number
    actualRate:number
    diffAmt:number
    discounts:number
    discAmt:number
    discountRate:number
    billAmt:number
    effDate:string
  }
 export interface invBatch {
    detlId: number,
    bathId: number,
    batchNo: string,
    expDate: string,
    mfdDate: string,
    mrp:number
    billedQty: number,
    freeQty: number,
    saleRate:number
    usedQty:number
    disabled:any
    checked:any
    billableQty:number
    
    
  }
   
 export interface invItemsDesc {
    SO: boolean
    PO: number
    SSO:string
    GO:string
    stateType: number
    itm?: lineItem
    //piBatchs: invBatch[]
    //salesInvoiceBatchs:invBatch[]
    discTypes:any[]
    isBth:boolean
    bth?:invBatch[]
    IO:string 
    bthIndex?:number
    vchDate:string
    mode:number
    totalFreeQty:number
    totalBilledQty:number
    totalUsedQty:number
    totalBilledQuantity:number
    totalFreeQuantity:number
    checked1:any
    totalSaleValue:number
    accCode:number
    
    
    
  
  
  }
  export interface docAttach {
    detlId: number
    vchId: number
    descr: string
    filepath: string
    uploadby: string
    uploadedDt: string
    filesize:number
    imagebase64:any,
    image:any
}
export interface Godown {
  lName: string |null
  lId: number
  lAddress: string
  lAlias: string
  lCityId: number
  place: Place
  lCity:Place;
  createdUser:string
  modifiedUser:string
  createdDt:string
  modifiedDt:string
}
export interface Place {
  cityName: string
  cityId: number
  cityPin: number
  talukaId: number
  taluka: Taluka
  createdUser:string
  modifiedUser:string
  createdDt:string
  modifiedDt:string
}
export interface Taluka {
  talukaName: string
  talukaId: number
  districtId: number
  district :District
  createdUser:string
  modifiedUser:string
  createdDt:string
  modifiedDt:string
   
}


export interface District {
  districtName: string
  districtId: number
  stateCode: number
  stateCodeNavigation :State
  createdUser:string
  modifiedUser:string
  createdDt:string
  modifiedDt:string
   
}


export interface State {
  StateName: string
  StateCode: number
  StateCapital: string
  VehicleSeries :string
  StateUt:boolean
  createdUser:string
  modifiedUser:string
  createdDt:string
  modifiedDt:string
   
}
