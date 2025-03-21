export interface JournalObj {
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
    against: number
    transType: number
    acc00500: acc00500Obj  
    jrnApprove: jrnApproveObj | null
    acc00501s: acc00501sObj[]
    jrnAttachs: jrnAttachsObj[]
    range: number
    currdt: string
    sdt: string
    edt: string
    accCodeNavigation: any
}
export interface acc00500Obj {
    vchId: number
    createdUser: string
    createdDt: string
    modifiedUser: string
    modifiedDt: string
}
export interface jrnApproveObj {
    vchId: number
    approvedBy: string
    approvedDt: string
}
export interface acc00501sObj {
    detlId: number
    vchId: number
    accCode: number
    amount: number
    nar: string
    costId: number
    acDate: string
    accName: string
    accCodeNavigation: any
}
export interface accCodeNavigationObj {
    accCode: number
    accName: string
}
export interface jrnAttachsObj {
    detlId: number
    vchId: number
    attachdescr: string
    filepath: string
    uploadby: string
    uploadedDt: string
}