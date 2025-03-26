export interface SubconsigneeObj {
  sgCodeNavigation: string
  Directpaid:boolean
  receiverName:string 
  totaldebitadd: number
  buildtotalamt:number
  senderaccount:any
  receiveraccout:any
  oweraccount:any
  divId:string
  firmId:number
  freightdeductAmount: number
  advanceAmount:number
  Name: string
  sendernm:string
  totalcharges: number
  receiverStateId:any
  vehicleNo: string
  senderStateId:any
  createdUser:string
  dt: string
  MobileNoReciver: number
  memoNo: number
  TotalFreight:number
  totalothercharges:number
  from: Date
  to: Date
  stateInfo: string
  AccountName: string
  selectedValue: string
  ApproximateKg: string
  iId: string
  gstrDate: string
  vchId: string
  hsncode: number
  GstPer: number

  ownerCreditAmout: number
  cityId: number

  sCode: number
  cityIdNavigation: any

  placeId: string
  mobileNo: number
  website: string
  selectfreightType: number;  

  stateCodeNavigation: any
  expenses: any

  motormemoAudit: MotormemoAuditObj 
  acc003s: Acc003sObj 
  motormemoDetails: MotormemoDetailsObj  
  motormemoCommodities: MotormemoCommoditiesObj[];
  motormemoExpenses: MotormemoExpensesObj[];
  motormemoOtherCharges: otherchargesObj[];

}

export interface Acc003sObj{
  txnNo:number
  txnDate:Date
}

export interface otherchargesObj{
  otherdiscription: string
  accCodeNavigation: any
  
  otherchag: number
  sundries:any
}

export interface MotormemoExpensesObj { 
  expenseName: string
  accName:string
  accCodeNavigation:any
  expensesisChecked: boolean
  sundries:any
  charges: number
  action: number 
}
export interface MotormemoCommoditiesObj {
  commodity: any
  uom: string
  qty: number
  chrgWeight:number
  actWeight:number
  rate:number
  freight: number
}

export interface MotormemoAuditObj {
  createdUser: string
  createdDt: string
  modifiedDt: string
  modifiedUser: string
}


export interface MotormemoDetailsObj {
  senderBillNo: number
  accCodeNavigation:any
  senderBillDt: Date
  ownerAccount: string
  senderAccount:string
  receiverAccount:string
  sName: string
  senderName: string
  senderAmount:number
  receiverAmount:number
  senderGstin: string
  sAlias: string
  sContactName: string
  sContactNo: string
  sGstin: string
  senderAddress1: string
  senderMail: any
  senderStateId: string
  senderPin: number
  senderMobileNo: number
  receiverPin: number
  receiverMobileNo: number
  receiverStateId: string
  receiverMail: string
  receiverName: string
  ewayNo: number
  receiverAddress: string
  receiverGstin: string
}