import { Product } from "./product";


export interface BranchPriceList{
    vchId:number
    branchId:string
    priceItems:PriceItems[]
}
export interface PriceItems{
    detlId:number;
    vchId:number;
    iId:number;
    whRate:number;
    rlRate:number;
    negoRate:number;
    createdUser:string;
    createdDt:string;
    modifiedUser:string;
    modifieddt:string;
    iIdNavigation:Product
  }