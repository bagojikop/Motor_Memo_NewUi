import { docAttach, lineItem } from './comman'
import { Product } from './product'

export interface creditNote {
    vchId: number
    firmId: number
    branchId: string
    divId: string
    challanNo: number
    vchNo: number
    vchDate: string
    accCode: number
    billType: number
    isReturn: number
    isRcm: number
    nar: string
    memoVchId: number
    taxableAmt: number
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
    dbNoteNo: number
    dbNoteDate: string
    gwnCode: number
    reasonIssueNote: number
    tom: number
    linkId: number
    debitAmt: number
    isComboInv: number
    grossAmt: number
    grossTotal: number
    crnItems: crnItems[]
    crnAudit: creditNoteAudit | null
    creditNoteApprovals: creditNoteApproval | null
    crnEwayBill: creditNoteEwaybill | null
    crnIrn?: creditNoteEInvoice | null
    accCodeNavigation: any
    totalCs: number
    billAmt: number
    chllNo: number
    crnSellerBuyer: creditNoteSellerBuyers | null
    invoice: string
    dcNo: number
    dcDate: string
    reasonOfIssueNote: number
    creditAmt: number
    tcsOn: number
    tcsRate: number
    tcsAmt: number
    salesReturnItems: lineItem[]
    salediscounts:lineItem[]
    crnAttachs: docAttach[]
    against:number
    stateType:number
    barCode:number
    discAmtTotal:number
    diffAmtTotal:number
    
}
export interface creditNoteAudit {
    vchId: number
    createdUser: string
    createdDt: string
    modifiedUser: string
    modifiedDt: string
}

export interface creditNoteApproval {
    vchId: number
    approvedBy: string
    approvedDt: string
}
export interface crnItems {
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
    totalAmt: number
    accCodeNavigation: accCodeNavigation
    cost: cost
    totalGST:number
   
}
export interface accCodeNavigation {
    accCode: number
    accName: string
}
export interface cost {
    iId: number
    iName: string
}
export interface creditNoteSellerBuyers {
    vchId: number
    sellerGstin: string
    sellerType: number
    buyerName: string
    buyerGstin: string
    buyerType: number
    ecommgstn: string
    stateCode: number
}



export interface creditNoteEwaybill {
    vchId: number
    vehicleNo?: string
    ewaybillno: string
    ewaybillDate: string
    ewayValidUpTo: string
    transporterId: string
    lrNo: string
    lrDate: string
    transMode: number
    transDistance: number
    vehType: number
    transId: number
}



export interface creditNoteEInvoice {
    vchId
    irn?: string
    ackNo: string
    ackDate: string
    signedInvoice: string
    signedQrCode: string
    cancelDt: string
    cnlRsn: string
    cnlRem: string
    createdUser: string
    canceledUser: string
    createdDt: string
}