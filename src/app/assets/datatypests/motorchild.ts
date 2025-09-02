export interface MotorMemoObj {
  sgCodeNavigation: string
  directPaid:boolean
  receiverName:string 
  isBilty:boolean
  senderaccount:any
  receiveraccout:any
  oweraccount:any
  divId:string
  firmId:number
  totalFreight: number
  vehTotalFreight:number
  vehBilledAmt:number
  vehAdvAmount:number
  vehLeftAmount: number
  totalcharges: number
  receiverStateId:any
  vehicleNo: string 
  senderStateId:any
  createdUser:string
  dt: string
  MobileNoReciver: number
  memoNo: number
  confDate:string
  totalothercharges:number
  from_Dstn: string
  to_Dstn: string
  kms:number
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
  recTotalAmt:number
  senderTotalAmt:number
  totalAmt:number

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
  motormemoVehExpenses: MotormemoVehExpensesObj[];
  motormemoOtherCharges: otherchargesObj[];
  motormemoPayments:motormemoPayment[];
  motormemoRecPayments:motormemoRecPayment[];
  vehicleAccNavigation:any
  confirmAccNavigation:any
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

export interface motormemoRecPayment{
  detlId:number
  vchId:number
  accCode:number
  amount:number
  narration:string
  motormemo:any
  accCodeNavigation:any
}

export interface MotormemoVehExpensesObj { 
  expenseName: string
  accName:string
  accCodeNavigation:any
  isInclFreight: boolean
  sundries:any
  charges: number
  action: number 
}
export interface MotormemoCommoditiesObj {
  commodity: any
  unitCode: string
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