
import {docAttach, lineItem} from './comman'
import {Product } from './product'
export interface salesOrder {
    vchId: number
    firmId: number
    branchId: string
    divId: string
    challanNo: string
    vchNo: number
    vchDate: string
    accCode: number
    refNo: number
    refDate: string
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
    termsAndConditions: string
    grossTotal: number
    range: number
    salesOrderSellerBuyers: salesOrderSellerBuyer | null
    salesOrderItems: lineItem[]
    soApprove: soApprove | null
    soAudit: soAudit | null
    soAttachs: docAttach[]
    accCodeNavigation: any
    totalCs:number
    billAmt:number
    currdt:string
  sdt:string
  edt:string
}
export interface soAudit {
    vchId: number
    createdUser: string
    createdDt: string
    modifiedUser: string
    modifiedDt: string
}
export interface soApprove {
    vchId: number
    approvedBy: string
    approvedDt: string
}
export interface salesOrderSellerBuyer {
    vchId: number
    sellerGstin:string
    sellerType:number
    buyerName:string
    buyerGstin:string
    buyerType:number 
    ecommgstn:string
    stateCode:number|null
}
export interface salesOrderItem {
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
    product :Product
    salesOrder:salesOrder
}
