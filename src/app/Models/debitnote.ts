import { docAttach, lineItem } from './comman'
import { Product } from './product'

export interface debitNote {
    vchId: number
    firmId: number
    branchId: string
    divId: string
    challanNo: number
    vchNo: number
    vchDate: string
    accCode: number
    billType:number
    isReturn:number
    isRcm: number
    nar: string
    memoVchId:number
    taxableAmt:number   
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
    netAmt: number
    totalAmt: number
    crNoteNo: number
    crNoteDate: string
    gwnCode: number
    reasonIssueNote:number
    tom:number
    linkId:number
    debitAmt: number
    isComboInv:number  
    grossAmt: number 
    grossTotal:number
    dbnItems: dbnItems[]
    dbnAudit: debitNoteAudit | null
    debitNoteApprovals: debitNoteApproval | null
    dbnEwayBill: debitNoteEwaybill | null
    dbnIrn: debitNoteEInvoice | null
    accCodeNavigation: any
    totalCs: number
    billAmt: number
    dbnSellerBuyer: debitNoteSellerBuyers | null
    sdt:string
    edt:string
    currdt:string
    billNo:number
    billDate:string
    acknNo:number
    acknDate:string
    creditDays:number
    dueDate:string
    narration:string
    invoice:string
    purchaseReturnItems:lineItem[]
    purchasediscounts:lineItem[]
    tcsAmt:number
    tcsRate:number
    tcsOn:number
    totalTaxableValue:number
    dbnAttachs: docAttach[]
    against:number
    stateCodeNavigation:any
    stateType:number
    barCode:number
    discAmtTotal:number
    diffAmtTotal:number
}
export interface accCodeNavigation {
    accCode: number
    accName: string
}
export interface cost {
    iId: number
    iName: string
}
export interface debitNoteAudit {
    vchId: number
    createdUser: string
    createdDt: string
    modifiedUser: string
    modifiedDt: string
}

export interface debitNoteApproval{
    vchId: number
    approvedBy: string
    approvedDt: string
}
export interface dbnItems {
    vchId: number
    detlId: number
    accCode: number
    hsncode: string
    costId: number
    taxableAmt: number
    crate: number
    srate: number
    irate: number
    csrate: number
    camt: number
    samt: number
    iamt: number
    csamt: number
    totalamt:number
    accCodeNavigation: any
    cost: any
    
}
export interface debitNoteSellerBuyers {
    vchId: number
    sellerGstin: string
    sellerType: number
    buyerName: string
    buyerGstin: string
    buyerType: number
    ecommgstn: string
    stateCode:number
}



export interface debitNoteEwaybill {
    vchId: number
    vehicleNo: string
    ewaybillno: string
    ewaybillDate: string
    ewayvalidUpto: string
    transporterId: string
    lrNo: string
    lrDate: string
    transMode: number
    transDistance: number
    vehType: number
    transId:number
}



export interface debitNoteEInvoice {
    vchId
    irn: string
    ackNo: string
    ackDate: string
    signedInvoice: string
    signedQrCode: string
    cancelDt: string
    cnlRsn: string
    cnlRem: string
    createdUser: string
    canceledUser: string
    createdDt:string
}