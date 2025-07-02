
export interface PaymentObj {
    vchId: number
    firmId: number
    branchId: string
    divId: string
    challanNo: number
    vchNo: number
    vchDate: string
    accCode: number
    amount: number
    txnType: number
    nar: string
    txnNo: number
    username: string
    txnDate: string
    txnDrawnon: string
    against: number
    refNo: number
    refDate: string
    postDatedid: number
    rem: number
    acc00200: acc00200Obj 
    acc00201: acc00201Obj 
    payLinks: payLinksObj[]
    payAttachs: payAttachsObj[]
    chqRtns: chqRtnsObj[]
    payApprove: payApproveObj 
    range: number
    chqRtnsNo: number
    currdt: string
    sdt: string
    edt: string
    accCodeNavigation: any
    paySellerBuyer: paySellerBuyerObj | null
    payGsts: payGstsObj[]

}
export interface acc00200Obj {
    vchId: number
    createdUser: string
    createdDt: string
    modifiedUser: string
    modifiedDt: string
}
export interface acc00201Obj {
    detlId: number
    vchId: number
    accCode: number
    amount: number
    tdsRate: number
    tdsAmt: number
    recAmt: number
    costId: number
    acDate: string
    nar: string
    accCodeNavigation: any

}
export interface accCodeNavigationObj {
    accCode: number
    accName: string
}
export interface payLinksObj {
    detlId: number
    vchId: number
    linkid: number
    SaleAmt: number
    year: number
    billNo: number
    billDate: string
    link: any
    linkedAmt: any
}
export interface payGstsObj {
    detlId: number
    vchId: number
    hsncode: string
    description: string
    taxableAmt: number
    srate: number
    crate: number
    irate: number
    csrate: number
    samt: number
    camt: number
    iamt: number
    csamt: number
    totalAmt: number
    gstRate: number
}

export interface linkObj {
    billNo: string
    billDt: string
    billAmt: number
}

export interface payAttachsObj {
    detlId: number
    vchId: number
    attachdescr: string
    filepath: string
    uploadby: string
    uploadedDt: string
}
export interface chqRtnsObj {
    vchId: number
    firmId: number
    branchId: string
    divId: string
    vchNo: number
    challanNo: string
    vchDate: string
    accCode: number
    amount: number
    acDate: string
    nar: string
    txnType: number
    txnNo: string
    txnDate: string
    txnDrawnon: string
    against: number
    challanType: number
    challanRecId: number
    challanPayId: number
}
export interface payApproveObj {
    vchId: number
    approvedBy: string
    approvedDt: string
}

export interface paySellerBuyerObj {
    vchId: number
    supplierGstin: string
    supplierType: number
    toGstin: string
    partyName: string
    partyType: number
    stateType: string
    stateCode: number
    sec7act: number
    ecommgstn: number
}
