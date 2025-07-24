export interface AccountObj {
    accCode: number
    panNo: string;
    creditLimit: string
    firm: any
    tanNo: string;
    cinNo: string;
    firmName: string
    firmCode: any
    isDisabled: any; 
    // isDisabled: boolean 
    Gstin: string
    sgCode: number
    state_code: number
    place: any
    accName: string
    accAlias: string
    createdUser: string
    modifiedUser: string
    createdDt?: string | null;
    modifiedDt?: string | null;
    placeId2: string
    placeIdNavigation: any

    contactDesignation2: string
    placeId: number
    blocked: boolean
    headOfficCode: string
    mst01100?: mst01100Obj | null
    mst01101?: mst01101Obj | null
    mst01104?: mst01104Obj | null
    // accPanDetail?: accPanDetailObj | null
    mst01109?: mst01109Obj | null
    mst01110s: mst01110sObj[]
    accBusinessLocations: accBusinessLocationObj[]
    sgCodeNavigation: any
    grpCodeNavigation: grpCodeNavigationObj

}
export interface grpCodeNavigationObj {
    mgCode: number;
}
export interface mst01110sObj {
 
    accCode: number;
    licNo: string;
    firm:number
    firmName: string;
 
    firmCode: number
}
export interface accBusinessLocationObj {
    detlId: number;
    accCode: number;
    addName: string;
    cityId: number;
    address1: string;
    address2: string;
    city: any;
}

export interface mst01100Obj{
    accCode:number;
    divId:string;
    crbal:number;
    drbal:number;
    vchId:number;
    firmId:any;
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
export interface accPanDetailObj {
    accCode: number;
    Tan_no: string;
    cin_no: string;
    creditLimit: number | null
    creditLimitDays: number;
    firmType: number;


    currencyCode: string;
}
export interface mst01109Obj {
    gstrDate: string;
    accCode: number;
    gstur: number;
    accGstn: string;
    gst_typ_name?: string;
    
}
export interface cityObj {
    cityId: number
    cityName: string
}