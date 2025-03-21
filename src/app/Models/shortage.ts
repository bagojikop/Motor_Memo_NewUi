import {Product } from './product'
export interface shortage {
    vchId: number
    firmId: number
    branchId: string
    divId: string
    challanNo: string
    vchNo: number
    vchDate: string
    narration:string
    gwnCode:number
    transType:number
    vchType:number
    shortageItems: shortageItems[]  
    shortageAudit: shortageAudit | null
    sdt:string
    edt:string
    currdt:string
    grossTotal:number
}
export interface shortageAudit {
    vchId: number
    createdUser: string
    createdDt: string
    modifiedUser: string
    modifiedDt: string
}

export interface shortageItems {
    vchId: number
    detlId: number
    iId: number
    unit: string
    qty: number
    rate: number
    inclRate:number
    grossAmt: number
    discountOn: number
    discRate: number
    discAmt: number
    assessValue: number
    crate: number
    srate: number
    irate: number
    csrate: number
    camt: number
    samt: number
    iamt: number
    csamt: number
    product :Product
    shortageBatchs?: shortageBatch 
}

export interface shortageBatch{
    detlId: number,
    batchNo: string,
    expDate: string,
    mfdDate: string,
    mrp:number
    billedQty: number,
}
