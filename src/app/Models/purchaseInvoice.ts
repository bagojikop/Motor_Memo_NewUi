import {docAttach, lineItem} from './comman'
import {Product } from './product'
import { purchaseOrder } from './purchaseOrder'

export interface purchaseInvoice {
    vchId: number
    firmId: number
    branchId: string
    divId: string
    challanNo: number
    vchNo: number
    vchDate: string
    accCode: number
    billNo: string
    billDate: string
    inclRate: number
    totalItemAssValue: number
    totalCamt: number
    totalSamt: number
    totalIamt: number
    totalCsAmt: number
    totalStateCsAmt: number
    totalNonAdvlAmt: number
    totalStateNonAdvlAmt: number
    totalItemOthCharges: number
    othCharges: string
    rndAmt: number
    totalAmt: number
    grossTotal: number
    range: number
    discount:number
    tcsRate:number
    tcsAmt:number
    narration:string
    creditDays:number
    dueDate:string
    acknNo:number
    acknDate:string
    purchaseInvoiceItems: lineItem[]
    piAudit: pIAudit | null
    piAttachs: docAttach[]
    accCodeNavigation: any
    totalCs:number
    billAmt:number
    piSupplier:piSupplier | null
    rcm:number
    netAmt:number
    tcsOn:number
    orders:string
    guid: string
    vchType: number
}


export interface piBatch{
    vchId: number
    detlId: number
    batchId:number
    batchNo:number
    expDate:string
    mfdDate:string
    qty:number
    cases:number
    mrp:number
}

export interface pIAudit {
    vchId: number
    createdUser: string
    createdDt: string
    modifiedUser: string
    modifiedDt: string
    approvedBy: string
    approvedDt: string
}


export interface purchaseInvoiceItem {
    vchId: number
    detlId: number
    iId: number
    iName: string
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
    totalitemValue: number
    freeQty: number
    ratePerUnit: string
    altrUnit: string
    altrQty: number
    altrRate: number
    totalCs: number
    totalGST: number
    totalGSTRate: number
    totalGSTAmount: number
    poDetlId:number
    product :Product
    purchaseInvoice:purchaseInvoice
    
}
export interface piSupplier {
    vchId: number
    sellerGstin:string
    sellerType:number
    buyerName:string
    buyerGstin:string
    buyerType:number 
    ecommgstn:string
    stateCode:number|null
}