import { Injectable } from '@angular/core';
import currencySymbol from './Currency.json';

@Injectable({
  providedIn: 'root'
})
export class CurrencyMaskService {
  private prefix: string;
  private decimalSeparator: string;
  private thousandsSeparator: string;
  constructor() {
    this.prefix = '';
    this.decimalSeparator = '.';
    this.thousandsSeparator = ',';
   }

   
  transform(value: string, allowNegative = false, decimalPrecision: number = 2, currencyCode:string , show: boolean) {
    if (value == undefined || value === '') {
      return null;
    }
    if(currencyCode.length<=0)
    this.thousandsSeparator="";

    var isMinusValue = false;

    // if (allowNegative) {

    value = value.toString();
    if (value.startsWith('(') || value.startsWith('-')) {
      isMinusValue = true;
      value = value.substring(1, value.length).replace(/[^\d|\-+|\.+]/g, '');
    } else {

      value = value.replace(/[^\d|\-+|\.+]/g, '');
    }
    value = value.replace("-", "");
    //}
    //  value =value.toString().replace(/[^\d|\-+|\.+]/g, '');

    let [integer, fraction = ''] = (value || '').toString().split(this.decimalSeparator);

    fraction = decimalPrecision > 0 ? this.decimalSeparator + (fraction + '000000').substring(0, decimalPrecision) : '';

    if (show) {
      const sessionIndex = currencySymbol.findIndex(sess => sess.Code == currencyCode);
      if (sessionIndex >= 0) {
        this.prefix = currencySymbol[sessionIndex].CurrencyCode
      }
      else
        this.prefix = "";
    }
    else
      this.prefix = "";

    if (currencyCode == "INR") {
      var lastThree = integer.substring(integer.length - 3);
      var otherNumbers = integer.substring(0, integer.length - 3);
      if (otherNumbers != '')
        lastThree = ',' + lastThree;

      integer = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
    }
    else {
      integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, this.thousandsSeparator);
    }

    if (isMinusValue) {

      integer = "-" + integer;

    }
    // If user types .xx we can display 0.xx
    if (integer === '') {
      integer = '0';
    } else if (integer.startsWith(this.prefix)) {
      // If there are multiple transforms, remove the previous dollar sign (blur and change at the same time)

      integer = integer.substr(this.prefix.length, integer.length);
    } else if (allowNegative && integer.startsWith('-')) {
      // If user inputs negative number set to paranthesis format
      integer = integer.substr(1, integer.length);
      return '-' + this.prefix + integer + fraction;
    }
    return this.prefix + integer + fraction;

  }


  parse(value: string, decimalPrecision:number, allowNegative = false) {
    let [integer, fraction = ''] = (value || '').split(this.decimalSeparator);
    integer = integer.replace(new RegExp(/[^\d\.]/, 'g'), '');
    fraction = parseInt(fraction, 10) > 0 && 2 > 0 ? this.decimalSeparator + (fraction + '000000').substring(0, decimalPrecision) : '';
    if (allowNegative && value.startsWith('-')) {
      return (-1 * parseFloat(integer + fraction)).toString();
    } else {
      return integer + fraction;
    }
  }
}
