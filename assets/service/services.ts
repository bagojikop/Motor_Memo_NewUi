import { Inject, Injectable, NgZone } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpParams, HttpRequest, HttpResponse } from '@angular/common/http';
import { MyProvider } from './provider';
import { catchError, map } from 'rxjs/operators';
import { forkJoin, Observable, of, throwError } from 'rxjs';
import { DatePipe, formatDate } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { environment } from '../../src/environments/environment';



declare var $: any;



@Injectable()
export class castFromArrayBuffer  {
  
castInbase64(response) {
  const byteCharacters = atob(response.fileContents);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);

  // Convert the byte array to a Blob
  const blob = new Blob([byteArray], { type: 'application/pdf' });

  // Create a URL for the Blob
  return URL.createObjectURL(blob);
}
}


@Injectable()
export class AuthGuardservice implements CanActivate {

  constructor(private provider: MyProvider, public router: Router) { }

  canActivate(route: ActivatedRouteSnapshot) {

    if (!this.provider.companyinfo.user.access_token) {

      this.router.navigate(['/']);
      return false;

    } else {

      return true;
    }

  }

}



@Injectable({
  providedIn: 'root'
})
export class ngselectpagination {
  bufferSize = 50;
  numberOfItemsFromEndBeforeFetchingMore = 10;
  Loading: boolean = false;
  constructor() { }

  onScrollToEnd(array, arrayBuffer) {
    this.onScroll(null, array, arrayBuffer)
  }

  onScroll({ end }:any, array, arrayBuffer) {
    if (this.Loading || array.length <= arrayBuffer.length) {
      return;
    }

    if (end + this.numberOfItemsFromEndBeforeFetchingMore >= arrayBuffer.length) {
      this.fetchMore(array, arrayBuffer);
    }
  }

  private fetchMore(array, arrayBuffer) {
    const len = arrayBuffer.length;
    const more = array.slice(len, this.bufferSize + len);
    this.Loading = true;
    // using timeout here to simulate backend API delay
    setTimeout(() => {
      this.Loading = false;
      arrayBuffer = arrayBuffer.concat(more);
    }, 200)
  }

}


  @Injectable({
    providedIn:'root'
  })
  export class gridOptions{
    gridOptions = {
      responsiveLayout: true,
      autoGroupColumnDef: {
        headerName: 'Group',
        minWidth: 200,
      },
      groupUseEntireRow: true,
    }
  }


@Injectable({
  providedIn: 'root'
}) 
export class NavbarActions{
  new1: boolean = false;
  edit1: boolean = false;
  print1: boolean = false;
  save1: boolean = false;
  undo1: boolean = false;
  document1:boolean=false;
  pastentity = Array;
  fieldset: boolean = false;
  ngview:boolean=false;

  constructor(){}

  navaction(mode) {
    // option -NEW
    if (mode == "new") {
      this.new1 = true;
      this.edit1 = true;
      this.print1 = true;
      this.save1 = false;
      this.document1=true;


      if (Object.keys(this.pastentity).length > 0) {
        this.undo1 = false;
      
      } else {
        this.undo1 = true;
      
      }
      this.fieldset = false;
      //  option -EDIT
    } else if (mode == "view") {
      this.new1 = false;
      this.edit1 = false;
      this.print1 = false;
      this.save1 = true;
      this.document1=true;

      if (Object.keys(this.pastentity).length > 0) {
        this.undo1 = false;
      } else {
        this.undo1 = true;
      }

      this.fieldset = true;
      //option -SAVE
    } 
    else if (mode == "edit") {    
      this.new1 = false;
      this.edit1 = true;
      this.document1=false;
      this.print1 = true;
      this.save1 = false;
      this.undo1 = false;
      this.pastentity = Array;
      this.fieldset = false;
      this.ngview=false;
    }else{
      this.new1 = false;
      this.edit1 = false;
      this.print1 = false;
      this.save1 = true;
      this.document1=true;
      if (Object.keys(this.pastentity).length > 0) {
        this.undo1 = false;
      } else {
        this.undo1 = true;
      }

      this.fieldset = true;
    }
  }

}

@Injectable({
  providedIn: 'root'
})
export class http {
  status: boolean = false;
  constructor(public http: HttpClient, public provider: MyProvider) { 
    // this.provider.serverapi="http://localhost:5267/"

     this.provider.serverapi=environment.server;

  }

  jsonget(url: any) {
    return this.http.get<any>(url);
  }

  get(url: any, param?: any, header?) {

    if (!header) {
      header = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.provider.companyinfo.user.access_token}`,
        'database':this.provider.companyinfo.database
      })
    }
    return this.http.get<any>(this.provider.serverapi + url, { headers: header, params: param })

  }

  getDoc(url: any, param?: any, header?) {
    return this.http.get(this.provider.serverapi + url,
      { params: param, responseType: 'arraybuffer' })
  };
 

  put(url: any, data: any, param: any) {

    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.provider.companyinfo.user.access_token}`,
      'database':this.provider.companyinfo.database
    })

    return this.http.put<any>(this.provider.serverapi + url, data, { headers: header, params: param })
  }

  post(url: any, data: any, params?) {

    const header = new HttpHeaders({
       'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.provider.companyinfo.user.access_token}`,
      'database':this.provider.companyinfo.database
    })

    return this.http.post<any>(this.provider.serverapi + url, data, { headers: header, params: params })
  }

 
  attachDoc(url: any, data: any, params?) {

    const header = new HttpHeaders({
      //'Content-Type':  'application/octet-stream',
      'Authorization': `Bearer ${this.provider.companyinfo.user.access_token}`,
      'database':this.provider.companyinfo.database
    })

    return this.http.post<any>(this.provider.serverapi + url, data, { headers: header, params: params })
  }



  delete(url: any, param: any) {
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.provider.companyinfo.user.access_token}`,
      'database':this.provider.companyinfo.database
    })

    return this.http.delete<any>(this.provider.serverapi + url, { headers: header, params: param })
  }

}

@Injectable()
export class share_data {
  products = [];
  post(obj) {
    this.products = obj;

  }


}

@Injectable()
export class ruppy_option {

  INRPAY() {
    return function (input: any) {
      if (!isNaN(input)) {

        if (input === '0' || input === null) {
          return 0;
        }
        var result = input.toString().split('.');

        var lastThree = result[0].substring(result[0].length - 3);
        var otherNumbers = result[0].substring(0, result[0].length - 3);
        if (otherNumbers != '')
          lastThree = ',' + lastThree;
        var output = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
        if (result.length > 1) {
          if (result[1].length == 1) {
            output += "." + result[1].substring(0, 1) + '0';
          } else {
            output += "." + result[1].substring(0, 2);
          }
        }

        return output;
      }
    }
  }

  INRDecimal() {
    return function (input: any) {
      if (!isNaN(input)) {

        if (input === '0' || input === null) {
          return 0;
        }

        //var output = Number(input).toLocaleString('en-IN');   <-- This method is not working fine in all browsers!
        var result = input.toString().split('.');

        var lastThree = result[0].substring(result[0].length - 3);
        var otherNumbers = result[0].substring(0, result[0].length - 3);
        if (otherNumbers != '')
          lastThree = ',' + lastThree;
        var output = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;

        if (output.length >= 15) {
          var showval = output.substring(0, 15) + '...';
          return showval
        }

        if (result.length > 1) {

          if (result[1].length == 1) {
            output += "." + result[1].substring(0, 1) + '0';
          } else {
            output += "." + result[1].substring(0, 2);
          }
        } else {
          output += ".00";
        }

        return output;
      }
    }
  }

  INR() {
    return function (input: any, arg: any) {
      if (!isNaN(input)) {

        if (input === '0' || input === null) {
          return 0;
        }
        //var output = Number(input).toLocaleString('en-IN');   <-- This method is not working fine in all browsers!
        var isNegative = parseFloat(input) < 0;
        input = Math.abs(parseFloat(input));
        var result = input.toString().split('.');
        var lastThree = result[0].substring(result[0].length - 3);
        //               console.log(lastThree.length)
        //                if(lastThree.length <= 3)
        //                    return lastThree+"."+result[1];
        var otherNumbers = result[0].substring(0, result[0].length - 3);
        if (otherNumbers != '')
          lastThree = ',' + lastThree;
        var output = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
        if (arg === 'ret') {
          if (output.length >= 15) {
            var showval = output.substring(0, 15) + '...';
            showval = (isNegative ? '-' : '') + showval;
            return showval;
          }
        }
        if (result.length > 1) {
          if (result[1].length == 1) {
            output += "." + result[1].substring(0, 1) + '0';
          } else {
            output += "." + result[1].substring(0, 2);
          }
        } else {
          if (arg === 'pay') {
            output = output;
          } else {
            output += ".00";
          }
        }
        output = (isNegative ? '-' : '') + output;

        return output;
      }
    }
  }


  INRCRDR() {
    return function (input: any, arg: any) {
      if (!isNaN(input)) {

        if (input === '0' || input === null) {
          return 0;
        }
        //var output = Number(input).toLocaleString('en-IN');   <-- This method is not working fine in all browsers!
        var isNegative = parseFloat(input) < 0;
        input = Math.abs(parseFloat(input));
        var result = input.toString().split('.');
        var lastThree = result[0].substring(result[0].length - 3);
        //               console.log(lastThree.length)
        //                if(lastThree.length <= 3)
        //                    return lastThree+"."+result[1];
        var otherNumbers = result[0].substring(0, result[0].length - 3);
        if (otherNumbers != '')
          lastThree = ',' + lastThree;
        var output = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
        if (arg === 'ret') {
          if (output.length >= 15) {
            var showval = output.substring(0, 15) + '...';
            showval = showval + (isNegative ? ' DR' : ' CR');
            return showval;
          }
        }
        if (result.length > 1) {
          if (result[1].length == 1) {
            output += "." + result[1].substring(0, 1) + '0';
          } else {
            output += "." + result[1].substring(0, 2);
          }
        } else {
          if (arg === 'pay') {
            output = output;
          } else {
            output += ".00";
          }
        }
        output = output + (isNegative ? ' DR' : ' CR');

        return output;
      }
    }
  }

}
 
@Injectable()
export class validation {

  formats: any = {};
  maxlength: any = {};
  messages: any = {};
  invAr: any = {};
  aadha: any = {};


  constructor() {

    this.formats = {
      tmpgstin: /^[a-zA-Z0-9]{6,25}$/,
      pan: /^[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}$/,
      tan: /^[a-zA-Z]{4}[0-9]{5}[a-zA-Z]{1}$/,
      mobile: /^[1-9]{1}[0-9]{9}$/,
      tlphno: /^[1-9]{1}[0-9]{9}$/,
      email: /^[a-zA-Z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/,
      inum: /^[a-zA-Z0-9\/\-]*$/,
      captcha: /^([0-9]){6}$/,
      passport: /^[A-PR-WYa-pr-wy][1-9]\d\s?\d{4}[1-9]$/,
      piocard: /^[pP]\d{7}$/,
      gstin: /[0-9]{2}[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9A-Za-z]{1}[Zz1-9A-Ja-j]{1}[0-9a-zA-Z]{1}/,
      uin: /[0-9]{4}[A-Z]{3}[0-9]{5}[UO]{1}[N][A-Z0-9]{1}/,
      nrid: /[0-9]{4}[a-zA-Z]{3}[0-9]{5}[N][R][0-9a-zA-Z]{1}/,
      number: /^[0-9]*$/,
      fo_otp: /^[0-9]+$/,
      pincode: /^[0-9]{6}$/,
      zipcode: /^[A-Za-z0-9]{1,60}$/,
      aadhar: /\d{12}$/,
      fo_user: /^[a-zA-Z][a-zA-Z0-9_\.\-]*$/,
      fo_password: /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\@\!\#\%\^\$\&\`\*\-\_\+])(?=.*[a-zA-Z0-9\@\!\#\%\^\$\&\`\*\-\_\+]*$).{8,15}/,
      fo_secans: /^[a-zA-Z0-9@._*\/\-]+(\s+[a-zA-Z0-9@._*\/\-\s]+)*$/,
      otp: /^[0-9]{6}$/,
      svat: /^[A-Za-z0-9\/]{6,25}$/,
      othr: /^[A-Za-z0-9\/]{6,25}$/,
      cst: /^[A-Za-z0-9]{6,25}$/,
      entax: /^[A-Za-z0-9]{6,25}$/,
      etax: /^[A-Za-z0-9]{6,25}$/,
      et: /^[A-Za-z0-9]{6,25}$/,
      ent: /^[A-Za-z0-9]{6,25}$/,
      hlt: /^[A-Za-z0-9]{6,25}$/,
      hltax: /^[A-Za-z0-9]{6,25}$/,
      seact: /^[A-Za-z0-9]{6,25}$/,
      exact: /^[A-Za-z0-9]{6,25}$/,
      llpin: /^[A-Za-z0-9]{6,25}$/,
      ce: /^[A-Za-z0-9]{6,25}$/,
      svtax: /^[A-Za-z0-9]{6,25}$/,
      cin: /^[A-Za-z0-9\-]{6,25}$/,
      llp: /^[A-Za-z0-9\-]{6,25}$/,
      iec: /^[A-Za-z0-9]{6,25}$/,
      mnt: /^[A-Za-z0-9]{6,25}$/,
      globalpassport: /^[A-Za-z0-9 -\/]{8,15}$/,
      trn: /[0-9]{12}(T|t)(R|r)(N|n)$/,
      name: /^[a-zA-Z0-9\_&'\-\.\/\,()?@!#%$~*;+= ]{1,99}$/,
      buidno: /^[a-zA-Z0-9 \/_\-\,\.]{1,60}$/,
      floorno: /^[a-zA-Z0-9\-\\\/\.\, ]{1,60}$/,
      faxno: /^[0-9]{11,16}$/,
      tName: /^[a-zA-Z0-9\_&'\-\.\/\,()?@!#%$~*;+= ]{1,99}$/,
      reason: /^[a-zA-Z0-9\_\-\/.,&%$ ]{1,500}$/,
      din: /^[0-9]{8}$/,
      acno: /^[A-Za-z0-9]{6,20}$/,
      pwdtooltip_user: /^([a-zA-Z0-9\_\-\.]){8,15}$/,
      pwdtooltip_uppercase: /[A-Z]/,
      pwdtooltip_lowercase: /[a-z]/,
      pwdtooltip_num: /[0-9]/,
      pwdtooltip_symbol: /[\@\!\#\%\^\$\&\`\*\-\_\+]+/,
      pwdtooltip_pwd: /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*^[a-zA-Z0-9\@\!\#\%\^\$\&\`\*\-\_\+]*$).{8,15}/,
      latlng: /^-?([1-8]?[1-9]|[1-9]0)\.{1}\d{1,6}/,
      quantity: /^([0-9]{0,5}|[0-9]{0,5}\.{1}[0-9]{0,2})$/,
      uqc: /^[a-zA-Z]{0,30}$/,
      etin: /^[0-9]{2}[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9A-Za-z]{1}[C]{1}[0-9a-zA-Z]{1}$/
    };

    this.maxlength = {
      pan: "10",
      tan: "10",
      mobile: "10",
      tlphno: "16",
      email: "255",
      captcha: "6",
      passport: "",
      piocard: "7",
      gstin: "15",
      number: "",
      fo_otp: "",
      pincode: "6",
      aadhar: "12",
      fo_user: "",
      fo_password: "15",
      fo_secans: "",
      svat: "25",
      othr: "25",
      cst: "25",
      etax: "25",
      entax: "25",
      et: "25",
      ent: "25",
      hlt: "25",
      ce: "25",
      svtax: "25",
      cin: "25",
      llp: "25",
      iec: "25",
      mnt: "25",
      globalpassport: "25",
      trn: "15",
      name: "60",
      buidno: "60",
      floorno: "60",
      faxno: "16",
      tName: "99",
      reason: "500",
      din: "8",
      acno: "20",
      rate: "6",
      unit: "3",
      hsnmin: "4"
    };

    this.messages = {
      pan: "ERR_PAN",
      tan: "ERR_TAN",
      mobile: "ERR_MBL_FRMT",
      tlphno: "ERR_INV_TELE",
      email: "ERR_EMAIL_FRMT",
      captcha: "ERR_CAPTCHA_FRMT",
      passport: "Invalid Passport Number",
      piocard: "Invalid PIO Card Number",
      gstin: "Invalid GSTIN",
      tmpgstin: "Invalid entry, Please enter 6-25 alphanumeric registration no.",
      number: "Invalid Number, please enter digits only",
      pincode: "Enter valid PIN code",
      aadhar: "Invalid aadhar, Please enter 12 digit aadhar number",
      svat: "Invalid entry, Please enter 6-25 alphanumeric state VAT registration number",
      cst: "Invalid entry, Please enter 6-25 character central sales tax number",
      etax: "Invalid entry, Please enter 6-25 character central sales tax number",
      et: "Invalid entry, Please enter 6-25 alphanumeric registration no.",
      entax: "Invalid entry, Please enter 6-25 alphanumeric registration no.",
      ent: "Invalid entry, Please enter 6-25 alphanumeric registration no.",
      hlt: "Invalid entry, Please enter 6-25 alphanumeric registration no.",
      hltax: "Invalid entry, Please enter 6-25 alphanumeric registration no.",
      seact: "Invalid entry, Please enter 6-25 alphanumeric registration no.",
      exact: "Invalid entry, Please enter 6-25 alphanumeric registration no.",
      llpin: "Invalid entry, Please enter 6-25 alphanumeric Identification no.",
      ce: "Invalid entry, Please enter 6-25 character alphanumneic central excise number",
      svtax: "Invalid entry, Please enter 6-25 character alphanumeric service tax registration number",
      cin: "Invalid entry, Please enter 6-25 character alphanumeric Corporate identity number",
      llp: "Invalid entry, Please enter 6-25 character alphanumeric LLP registration number",
      iec: "Invalid entry, Please enter 6-25 character alphanumeric Importer/Exporter code number",
      mnt: "Invalid entry, Please enter 6-25 alphanumeric registration no.",
      globalpassport: "ERR_PASS_NUM",
      name: "",
      buidno: "",
      floorno: "",
      faxno: "",
      tName: "",
      reason: "",
      din: "ERR_INV_DIN",
      acno: ""
    };
  }



  pan(value: any) {
    return this.formats.pan.test(value);
  };
  acno(value: any) {
    return this.formats.acno.test(value);
  };
  din(value: any) {
    return this.formats.din.test(value);
  };
  faxno(value: any) {
    return this.formats.faxno.test(value);
  };
  mobile(value: any) {
    return this.formats.mobile.test(value);
  };
  captcha(value: any) {
    return this.formats.captcha.test(value);
  };
  cin(value: any) {
    return this.formats.cin.test(value);
  };
  iec(value: any) {
    return this.formats.iec.test(value);
  };
  svat(value: any) {
    return this.formats.svat.test(value);
  };
  ce(value: any) {
    return this.formats.ce.test(value);
  };
  svtax(value: any) {
    return this.formats.svtax.test(value);
  };

  cst(value: any) {
    return this.formats.cst.test(value);
  };
  email(value: any) {
    return this.formats.email.test(value);
  };
  name(value: any) {
    return this.formats.name.test(value);
  };
  buidno(value: any) {
    return this.formats.buidno.test(value);
  };
  floorno(value: any) {
    return this.formats.floorno.test(value);
  };
  checkGstn(gst: any) {

    var factor = 2,
      sum = 0,
      checkCodePoint = 0,
      i, j, digit, mod, codePoint, cpChars, inputChars;
    cpChars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    inputChars = gst.trim().toUpperCase();

    mod = cpChars.length;
    for (i = inputChars.length - 1; i >= 0; i = i - 1) {
      codePoint = -1;
      for (j = 0; j < cpChars.length; j = j + 1) {
        if (cpChars[j] === inputChars[i]) {
          codePoint = j;
        }
      }

      digit = factor * codePoint;
      factor = (factor === 2) ? 1 : 2;
      digit = (digit / mod) + (digit % mod);
      sum += Math.floor(digit);
    }
    checkCodePoint = ((mod - (sum % mod)) % mod);

    return gst + cpChars[checkCodePoint];
  };
  gstin(gst: any) {
    if (this.formats.gstin.test(gst)) {
      var substrgst = gst.substr(0, 14);
      if (gst === this.checkGstn(substrgst)) {
        return true;
      }
    }
    return false;
  };
  uin(uin: any) {
    if (this.formats.uin.test(uin)) {
      var substrgst = uin.substr(0, 14);
      if (uin === this.checkGstn(substrgst)) {
        return true;
      }
    }
    return false;
  };
  isNumber(val: any) {
    return this.formats.number.test(val);
  };
  invArray(array: any) {
    if (Object.prototype.toString.call(array) === "[object Number]") {
      array = String(array);
    }

    if (Object.prototype.toString.call(array) === "[object String]") {
      array = array.split("").map(Number);
    }

    return array.reverse();
  };

  aadhar(value: any) {
    if (!this.formats.aadhar.test(value)) {
      return false;
    }

    var d = [
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
      [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
      [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
      [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
      [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
      [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
      [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
      [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
      [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
    ],
      p = [
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
        [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
        [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
        [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
        [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
        [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
        [7, 0, 4, 6, 9, 1, 3, 2, 5, 8]
      ],
      inv = [0, 4, 3, 2, 1, 5, 6, 7, 8, 9],
      c = 0,
      invertedArray = this.invArray(value),
      i;

    for (i = 0; i < invertedArray.length; i = i + 1) {
      c = d[c][p[(i % 8)][invertedArray[i]]];
    }

    return (c === 0);
  };

}


@Injectable()
 
@Injectable()
export class Httpenterceptor implements HttpInterceptor {
  // public errorDialogService: ErrorDialogService

  constructor() { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          console.log('event--->>>', event);
        }
        return event;
      }),
      catchError((error: HttpErrorResponse) => {
        let data = {};
        data = {
          reason: error && error.error && error.error.reason ? error.error.reason : '',
          status: error.status
        };
        // this.errorDialogService.openDialog(data);
        return throwError(error);
      }));
  }
}


@Injectable()
export class cacheservice {
  ttl: any;

  setStorage(key: any, value: any) {

    this.ttl = 3 * 60 * 60;

    const item = {
      value: value,
      timestamp: new Date().getTime(),
      expiry: new Date().getTime() + this.ttl,
    }

    localStorage.setItem(key, JSON.stringify(item))
  }

  getStorage(key: any) {
    var item: any = localStorage.getItem(key);
    if (item === null || item === undefined) {
      return [];
    }
    if (item) {
      if (Object.keys(item).length < 3) {
        return [];
      }

      return item;
    }
    return [];
  }

  removeStorage(key: any) {
    localStorage.removeItem(key)
  }

  // removeExpired() {
  //   localStorage.keys(), function (key:any) {
  //     if (key != null && (new Date().getTime() > (key.timestamp + key.ttl))) {
  //       localStorage.remove(key);
  //     }
  //   }
  // }

  clearAll() {
    localStorage.clear();
  };

}
 

@Injectable()
export class toNumber {

  number(e) {
    if (typeof (e) === 'number') return e;
    if (typeof (e) === 'string') {
        var str = e.trim();
        var value = Number(e.replace(/[^0-9.-]+/g, ""));
        return str.startsWith('(') && str.endsWith(')') ? -value: value;
    }

    return e;
    
  }
}


@Injectable()
export class dateFormat {

  constructor() { }

  formatdate(s: any) {
    return formatDate(s, 'yyyy/MM/dd', 'en-IN');
  }

}

@Injectable()
export class transactionValid {
  static CurrDate(arg0: Date): any {
    throw new Error('Method not implemented.');
  }

  constructor(public datePipe: DatePipe, public provider: MyProvider) { }

  currDate(dt: any) {
    return new Promise((resolve, reject) => {
      var sdt: any = this.datePipe.transform(this.provider.companyinfo.company.from_date, 'yyyy-MM-dd');
      var edt: any = this.datePipe.transform(this.provider.companyinfo.company.to_date, 'yyyy-MM-dd');

      if (this.compareDate(sdt, edt, dt)) {
        resolve(dt);
      } else {
        var dd = new Date(dt).getDate();
        var mm = new Date(dt).getMonth();
        var yy = sdt.getFullYear();

        var newDate = new Date(yy, mm, dd);

        if (this.compareDate(sdt, edt, newDate)) {
          var newdate = this.datePipe.transform(newDate, 'yyyy-MM-dd');
          resolve(newdate);
        } else {
          yy = edt.getFullYear();
          var k = new Date(yy, mm, dd)
          var newdate = this.datePipe.transform(k, 'yyyy-MM-dd');
          resolve(newdate);

        }
      }
    })


  }


  compareDate(sdt: any, edt: any, dt: any) {
    var date: any = this.datePipe.transform(dt, 'yyyy-MM-dd');
    if (date >= sdt && date <= edt)
      return true;
    else
      return false;
  }

}

 
 


// in bytes, compress images larger than 1MB
const fileSizeMax = 1 * 1024 * 1024
// in pixels, compress images have the width or height larger than 1024px
const widthHeightMax = 1024


@Injectable({
  providedIn: 'root'
})
export class CompressImageService {

  compress(file: File, myquality): Observable<File> {
    const imageType = file.type || 'image/jpeg'
    const reader = new FileReader()
    reader.readAsDataURL(file)

    return Observable.create(observer => {
      // This event is triggered each time the reading operation is successfully completed.
      reader.onload = ev => {
        // Create an html image element
        const img = this.createImage(ev)
        // Choose the side (width or height) that longer than the other
        const imgWH = img.width > img.height ? img.width : img.height

        // Determines the ratios to compress the image
        let withHeightRatio = (imgWH > widthHeightMax) ? widthHeightMax / imgWH : myquality
        let qualityRatio = (file.size > fileSizeMax) ? fileSizeMax / file.size : myquality

        // Fires immediately after the browser loads the object
        img.onload = () => {
          const elem = document.createElement('canvas')
          // resize width, height
          elem.width = img.width * withHeightRatio
          elem.height = img.height * withHeightRatio

          const ctx = <CanvasRenderingContext2D>elem.getContext('2d')
          ctx.drawImage(img, 0, 0, elem.width, elem.height)
          ctx.canvas.toBlob(
            // callback, called when blob created
            (blob:any) => {
              observer.next(new File(
                [blob],
                file.name,
                {
                  type: imageType,
                  lastModified: Date.now(),
                }
              ))
            },
            imageType,
            qualityRatio, // reduce image quantity
          )
        }
      }

      // Catch errors when reading file
      reader.onerror = error => observer.error(error)
    })
  }

  private createImage(ev) {
    let imageContent = ev.target.result
    const img = new Image()
    img.src = imageContent
    return img
  }
}


