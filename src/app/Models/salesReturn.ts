import {docAttach, lineItem} from './comman'
import {Product } from './product'
import { salesOrder } from './salesOrder'

export interface salesReturn {
    vchId: number
    firmId: number
    branchId: string
    divId: string
    challanNo: number
    vchNo: number
    vchDate: string
    accCode: number
    dcNo: number
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
    salesReturnItems: lineItem[]
    salesRnAudit: salesRnAudit | null
    salesRnAttachs: docAttach[]
    accCodeNavigation: any
    totalCs:number
    billAmt:number
    salesRnSupplier:salesRnSupplier | null
    rcm:number
    sdt:string
    edt:string
    currdt:string
    tcsOn:number
    creditAmt:number
    reasonOfIssueNote:number
    isRcm:string
    crNoteDate:string
    crNoteNo:number
    nar:string
    invoice:string
}


export interface salesRnBatch{
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

export interface salesRnAudit {
    vchId: number
    createdUser: string
    createdDt: string
    modifiedUser: string
    modifiedDt: string
    approvedBy: string
    approvedDt: string
}


export interface salesRnItem {
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
    siDetlId:number
    product :Product
    
}
export interface salesRnSupplier {
    vchId: number
    sellerGstin:string
    sellerType:number
    buyerName:string
    buyerGstin:string
    buyerType:number
    ecommgstn:string
}