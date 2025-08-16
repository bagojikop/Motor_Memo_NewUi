export interface SubconsigneeObj {
  sgCodeNavigation: string
  directPaid:boolean
  receiverName:string 
  totaldebitadd: number
  billAmt:number
  senderaccount:any
  receiveraccout:any
  oweraccount:any
  divId:string
  firmId:number
  totalFreight: number
  advAmount:number
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
  from_Dstn: string
  to_Dstn: string
  kiloMiter:number
  vehAccCode:number
  stateInfo: string
  AccountName: string
  selectedValue: string
  ApproximateKg: string
  iId: string
  gstrDate: string
  vchId: string
  hsncode: number
  GstPer: number
  totalAmt:number
  leftAmount: number
  cityId: number

  s_Id: number
  cityIdNavigation: any

  placeId: string
  mobileNo: number
  website: string
  freightType: number;  

  stateCodeNavigation: any
  expenses: any

  motormemoAudit: MotormemoAuditObj 
  acc003s: Acc003sObj 
  motormemoDetails: MotormemoDetailsObj  
  motormemoCommodities: MotormemoCommoditiesObj[];
  motormemoExpenses: MotormemoExpensesObj[];
  motormemoOtherCharges: otherchargesObj[];
  motormemoPayments:motormemoPayment[];
  vehicleAccNavigation:any

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

export interface motormemoPayment{
  detlId:number
  vchId:number
  accCode:number
  amount:number
  narration:string
  motormemo:any
  accCodeNavigation:any
}

export interface MotormemoExpensesObj { 
  expenseName: string
  accName:string
  accCodeNavigation:any
  isChecked: boolean
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