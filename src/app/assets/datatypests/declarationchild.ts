export interface AccountObj {
  sgCodeNavigation: string
  panNo: string
  id:string
  declrId:string 
  accCode:string
  createdUser: string
  name: string
  accCodeNavigation:any
  declrNo: number 
  noOfVehicles: number
  fromDt: string
//   fromDt: dateFormat
  accName: string
  ishuf: string
  sCode: number
  createdDt: string
  modifiedDt: string
  modifiedUser: string
  mst10301s: mst10301sObj[]
  fyId:number
}
export interface mst10301sObj {
  vehicleNo: string
}