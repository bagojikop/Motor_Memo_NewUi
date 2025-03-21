import { Godown } from "./comman"

export interface Product {
    iId: number
    iAlias: string
    iTitle: string
    iMfgr?: string
    iName: string
    iPackUnit: string
    iPacking: number
    iDescription: string
    iHsn: string
    iStockUnit: string
    subCatId:number
    subCat?: number
    iMode: number
    taxability: number
    hsnDescription: string
    expiry: boolean
    batch: boolean
    expDays: number
    createdUser: string
    modifiedUser: string
    createdDt: string
    modifiedDt: string
    iType: number
    iTech: string
    iTech1: string[]
    headOfficCode: string
    invItemFactors?: invItemFactor[]
    invItemGsts?: invItemGst[]
    invItemlocation?: invItemlocation | null
    invItemSuppliers?: invItemSupplier[]
    mfgrName: string
    mfgrCode: number
    mfgrAlias: string
    techName: string
    techId: number
    isSchemeApply: number
    isDiscount: number
    discRate: number
    schemeFrom: string
    schemeTo: string
    iPrate: number
    iSrate: number
    iMrp: number
    minResQty: number
    maxResQty: number
    reorderQty: number
    isNarcotic: number
    isSchH: number
    isSchH1: number
    schH1Typ: number
    seasonCode: number
    iStockUnitNavigation:UOM
    subCategory:any,
    slAcc?:number,
    purAcc?:number,
    saleAccount:any;
    purAccount:any;

    
}

export interface subCategory{
    subCatId:number
    subCatName:string
    invItemTeches:invItemTeches

}

export interface invItemTeches{
    techId:number
    techName:string
}

export interface invItemFactor {
    uid: number
    iId: number
    iFactor: number
    iUnit: string
    iRate: number
    srNo: number
    freeQtyOn: number
    freeQty: number
    discQtyOn: number
    discRate: number
}
export interface invItemGst {
    iId: number
    igst: number
    cgst: number
    sgst: number
    cess: number
    effDate: string
    uid: number

}
export interface invItemlocation {
    iId: number
    partNo: string
    locationId: number
    rackNo: string
    location:Godown
}
export interface invItemSupplier {
    iId: number
    supplierId: string
    supplier: any
    accName: string
}
export interface supplier {
    accName: string
    acccode: number
}

export interface UOM {
    unitName: string
    unitCode: string
    createdUser:string |null
    modifiedUser:string|null
    createdDt: |null
    modifiedDt:string|null
}
