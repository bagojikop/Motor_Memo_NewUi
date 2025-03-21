import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';



export interface FirmObj {
    firmCode: number
    firmName: string
    firmAlias: string
    firmAddress1: string
    firmAddress2: string
    firmPlace: string
    firmPinCode: number
    firmStateCode: number
    firmFno: string
    emailId: string
    webAddress: string
    jurisdiction: string
    firmCin: string
    firmPan: string
    active: number
    firmBankName: string
    firmBankAccno: string
    firmBankIfsc: string
    createdUser: string
    modifiedUser: string
    createdDt: string
    modifiedDt: string
    headOfficeCode: string
    firmLegalName: string
    firmMobNo: string
    accGstn: string
    einvEffFrom: string
    gstFrom: string
    gstTyp: number
    gstNo: string

    mst00401: mst00401
    mst00409: mst00409


    mst00403s: mst00403sObj[]
}

declare var $: any;

export interface mst00401 {
    firmCode: number
    logo?: string
    firmCodeNavigation: string

}
export interface mst00409 {
    gstFrom: string
    gstTyp: number
    gstNo: string
}

export interface mst00403sObj {
    licNo: string
    licName: string


}