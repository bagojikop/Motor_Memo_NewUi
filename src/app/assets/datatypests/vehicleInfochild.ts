
export interface SubconsigneeObj {
    bankinfo: any;
    isDisabled: boolean
    sCode: number
    accName:string
    vtypeId: number
    isOwn:number
    accCodeNavigation:any
    sgCode: number
    VtypeId:number
    accAlias: string
    stateCode: number
    placeId: number
    accCode: number
    capacityMts: number
    creditLimitAmt: number
    panNo: string
    uploadedDt: string
    createdUser: string
    ownerName: string
    driverLicNo: string
    driverMobileNo: number
    driverAddress: string
    driverName: string
    authorisedMobileNo: number
    authorisedAddress: string
    authorisedName: string
    ownerAddress: string
    ownermobileno: number
    capacityinmtr: string
    chassisno: string
    enginno: string
    accountName: string
    accPanNo: string
    alias: string
    vehicleNo: string
    createdDt: string
    modifiedDt: string
    modifiedUser: string
    mst10804: mst10804Obj  
    mst10805s: mst10805sObj[]  
    mst10801s: mst10801sObj  
    sgCodeNavigation: any

    mst01101?: mst01101Obj | null
    mst01104?: mst01104Obj | null 
    mst01109?: mst01109Obj | null
    
        grpCodeNavigation: grpCodeNavigationObj
}
export interface mst10805sObj {
    state_id: number
    taxno: string
    stateName: string
    taxFm: string
    taxTo: string
    permitno: string
    permitFm: string
    permitTo: string
    vehicleNo: string
    state: any 
}

export interface mst10804Obj {
    address: string
    bankName: string
    bankaccNo: string
    ifscCode: string
}

export interface mst10801sObj {
    fitnessNo: number
    fitnessFrom: string
    permitFm: string
    permitTo: string
    fitnessTo: string
    insuranceFrom: string

    permitno: number
    insuranceTo: string
    insuranceNo: number
}

export interface referenceObj {
    // state_id: number
    // taxno: string
    // taxFm: string
    // taxTo: string
    // permitno: string
    // permitfm: string
    // permitto: string
    // vehicleNo: string
    state_id: number
    taxno: string
    stateName: string
    taxFm: string
    taxTo: string
    permitno: string
    permitFm: string
    permitTo: string
    vehicleNo: string
    state: any 
}
 
export interface grpCodeNavigationObj {
    mgCode: number;
}
 

export interface mst01101Obj {
    accCode: number;
    placeId: number;
    accAddress: string;
    contactPerson2: string
    landlineNo: number
    contactMobileNo2: number
    contactDesignation2: string
    contactPerson: string;
    contactDesignation: string;
    contactMobileNo: string;
    offTelNo: string;
    emailId: string;
    yearOfEstablishment: string;
    website: string;
}
export interface mst01104Obj {
    accCode?: number;
    bankName?: string;
    address?: string;
    bankaccNo?: string;
    ifscCode?: string;
}
 
export interface mst01109Obj {
    gstrDate: string;
    accCode: number;
    gstur: number;
    accGstn: string;
    gst_typ_name?: string;
}
 