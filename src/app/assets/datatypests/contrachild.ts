export interface ContraObj {
    vchId: number
    firmId: number
    branchId: string
    divId: string
    challanNo: number
    vchNo: number
    vchDate: string
    accCode: number
    amount: number
    nar: string
    transType: number
    contraAudit: contraAuditObj 
    contraApprove: contraApproveObj 
    contraItems: contraItemsObj[]
    acc00601s:contraItemsObj[]
    currdt: string
    sdt: string
    edt: string
    accCodeNavigation: any
}
export interface contraAuditObj {
    vchId: number
    createdUser: string
    createdDt: string
    modifiedUser: string
    modifiedDt: string
}
export interface contraApproveObj {
    vchId: number
    approvedBy: string
    approvedDt: string
}
export interface contraItemsObj {
    detlId: number
    vchId: number
    accCode: number
    amount: number
    nar: string
    accName: string
    accCodeNavigation: any
}
export interface accCodeNavigationObj {
    accCode: number
    accName: string
}