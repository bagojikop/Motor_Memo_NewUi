export interface ReceiptObj {
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
    lrnumber:number
    txnNo: number
    username: string
    txnDate: string
    txnDrawnon: string
    against: number
    refNo: number
    refDate: string
    postDatedid: number
    acc00300: acc00300Obj 
    acc00301: acc00301Obj 
    memoNo:number
    recApprove: recApproveObj 
    range: number
    chqRtnsNo: number
    currdt: string
    sdt: string
    edt: string
    accCodeNavigation: any
    lrId: number
    motormemo:any
}
export interface acc00300Obj {
    vchId: number
    createdUser: string
    createdDt: string
    modifiedUser: string
    modifiedDt: string
}
 
export interface recApproveObj {
    vchId: number
    approvedBy: string
    approvedDt: string
}

export interface acc00301Obj {
    detlId: number
    vchId: number
    lraccount:any
    accCode: number
    amount: number
    tdsRate: number
    tdsAmt: number
    recAmt: number
    costId: number
    acDate: string
    accName: string
    accCodeNavigation: any
  
  }