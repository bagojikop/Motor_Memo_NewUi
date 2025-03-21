import { docAttach, lineItem,invBatch } from './comman'
import { Product } from './product'

export interface salesInvoice {
    vchId: number
    firmId: number
    branchId: string
    divId: string
    challanNo: number
    vchNo: number
    vchDate: string
    accCode: number
    sCode: number
    dcNo: number
    dcDate: string
    grp: number
    grp1:number
    gwnCode: number
    iId:number
    totalUsedQty:number
    //inclRate: number
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
    rcm: number
    guid: number
    grossAmt: number
    range: number
    discount: number
    tcsRate: number
    tcsAmt: number
    narration: string
    creditDays: number
    dueDate: string
    salesType: number
    invType: number
    counterId: number
    tp: string
    vchType: number
    debitamt: number
    grossTotal:number
    salesInvoiceItems: lineItem[]
    //salesInvoiceBatchs:invBatch[]
    salesInvoiceAudits: salesInvoiceAudit | null
    salesInvAdvanceReceipt: salesInvAdvanceReceipt | null
    salesInvPaymentDetails: SalesInvPaymentDetails[]
    salesInvEwaybill: SalesInvEwaybill | null
    salesInvEInvoice: SalesInvEInvoice | null
    salesInvDispatch: SalesInvDispatch | null
    salesInvShipping: SalesInvShipping | null
    accCodeNavigation: accCodeNavigation |null
    totalCs: number
    billAmt: number
    salesInvoiceSellerBuyer: salesInvoiceSellerBuyers | null
    //saleInvoice:salesInvoice[]
    amt:number
    totalAmount:number
    iName:string
    qty:number
    rate:number
    tcsOn:number
    sdt:string
    edt:string
    currdt:string
    orders:string
    barCode:number
}

export interface accCodeNavigation{
    accCode:number
    accName:string
    placeIdNavigation:any
}


export interface salesInvoiceAudit {
    vchId: number
    createdUser: string
    createdDt: string
    modifiedUser: string
    modifiedDt: string
    approvedBy: string
    approvedDt: string
}


export interface salesInvoiceItem {
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
    product: Product
    salesInvoice:salesInvoice
}
export interface salesInvoiceSellerBuyers {
    vchId: number
    sellerGstin: string
    sellerType: number
    buyerName: string
    buyerGstin: string
    buyerType: number
    ecommgstn: string
    address:string
    place:string
    mobNo:number
    email:string
    stateCode:number
    pinCode:string
    
}

export interface salesInvAdvanceReceipt {
      vchId :number
      recId :number
      taxableAmt :number
      srate :number
      crate :number
      irate :number
      csrate :number
      samt :number
      camt :number
      iamt :number
      csamt :number
      totalAmt :number
      detlId :number
      hsnCode :string
}

export interface SalesInvEwaybill {
    vchId: number
    vehicleNo: string
    ewayBillNo: string
    ewayBillDate: string
    ewayValidUpTo: string
    transporterId: string
    lrNo: string
    lrDate: string
    transMode: number
    transDistance: number
    vehType: number
    transId:string
}

export interface SalesInvPaymentDetails {
    vchId: number
    detlId: number
    accCode: number
    amount: number
    txNo: string
    accName:string
    
}

export interface SalesInvEInvoice {
    vchId:number
    irn: string
    acknNo: string
    acknDate: string
    signedInvoice: string
    signedQrCode: string
    cancleDt: string
    cnlRsn: string
    cnlRem: string
    createdUser: string
    canceledUser: string
    createdDt:string
}

export interface salesInvoiceBatchs{
    vchId:number
    detlId: number
    batchId:number
    batchNo:string
    expDate:string
    mfdDate:string
    qty:number
    cases:number
    mrp:number
    usedQty:number
    disabled:any
    checked:number
}

export interface SalesInvDispatch{
    vchId:number
    supplierName:string
    address_I:string
    address_II:string
    place:string
    pinCode:number
    stateCode:number
}


export interface SalesInvShipping{
    vchId:number
    supplierName:string
    address_I:string
    address_II:string
    place:string
    pinCode:number
    stateCode:number
}