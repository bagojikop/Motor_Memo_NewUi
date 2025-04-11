import { computed, inject, Inject, Injectable, NgZone, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpParams, HttpRequest, HttpResponse } from '@angular/common/http';
import { MyProvider } from './provider';
import { catchError, map } from 'rxjs/operators';
import { BehaviorSubject, forkJoin, Observable, of, throwError } from 'rxjs';
import { DatePipe, formatDate } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { ArraySortPipe } from '../pipes/inrcrdr.pipe';
import { NgxImageCompressService } from 'ngx-image-compress';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import {environment} from '../../../environments/environment';
 

declare var $: any;

@Injectable()
export class castFromArrayBuffer {

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

 
@Injectable({ providedIn: 'root' }) // Ensure Singleton Service
export class UserPermissions {
  private userControl = signal<string | null>(null); // Store as string to avoid losing data
  
 

  setInfo(obj: any) {
    this.userControl.set(JSON.stringify(obj)); // Convert object to JSON string
  }

  getInfo() {
    return computed(() => {
      const data = this.userControl();
      return data ? JSON.parse(data) : null;
    })();
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

  onScroll(end , array, arrayBuffer) {
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
  providedIn: 'root'
})
export class gridOptions {
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
export class NavbarActions {
  new1: boolean = false;
  edit1: boolean = false;
  print1: boolean = false;
  save1: boolean = false;
  undo1: boolean = false;
  document1: boolean = false;
  pastentity: any = {};
  fieldset: boolean = false;
  ngview: boolean = false;
  isRcmDisabled: boolean = false;
  constructor() { }

  navaction(mode) {
    if (mode == "new") {
      this.new1 = true;
      this.edit1 = true;
      this.print1 = true;
      this.save1 = false;
      this.document1 = true;


      if (Object.keys(this.pastentity).length > 0) {
        this.undo1 = true;

      } else {
        this.undo1 = false;

      }
      this.fieldset = false;
      //  option -EDIT
    } else if (mode == "view") {
      this.new1 = false;
      this.edit1 = false;
      this.print1 = false;
      this.save1 = true;
      this.document1 = true;
      this.isRcmDisabled = true;

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
      this.document1 = false;
      this.print1 = true;
      this.save1 = false;
      this.undo1 = false;
      this.pastentity = Array;
      this.fieldset = false;
      this.ngview = false;
    } else {
      this.new1 = false;
      this.edit1 = false;
      this.print1 = false;
      this.save1 = true;
      this.document1 = true;
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
  providedIn: 'root',

})
export class http {
  status: boolean = false;
  constructor(public http: HttpClient, public provider: MyProvider) {
    this.provider.serverapi = environment.server;
  }

  jsonget(url: any) {
    return this.http.get<any>(url);
  }

  get(url: any, param?: any, header?) {

    if (!header) {
      header = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.provider.companyinfo.user.access_token}`,
        'database': this.provider.companyinfo.database
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
      'database': this.provider.companyinfo.database
    })

    return this.http.put<any>(this.provider.serverapi + url, data, { headers: header, params: param })
  }

  post(url: any, data: any, params?) {

    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.provider.companyinfo.user.access_token}`,
      'database': this.provider.companyinfo.database
    })

    return this.http.post<any>(this.provider.serverapi + url, data, { headers: header, params: params })
  }


  attachDoc(url: any, data: any, params?) {

    const header = new HttpHeaders({
      //'Content-Type':  'application/octet-stream',
      'Authorization': `Bearer ${this.provider.companyinfo.user.access_token}`,
      'database': this.provider.companyinfo.database
    })

    return this.http.post<any>(this.provider.serverapi + url, data, { headers: header, params: params })
  }



  delete(url: any, param: any) {
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.provider.companyinfo.user.access_token}`,
      'database': this.provider.companyinfo.database
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
      // provisional: /[0-9]{2}[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9A-Za-z]{1}[Z]{1}[0-9a-zA-Z]{1}/ || /^[0-9]{4}[A][R][0-9]{7}[Z]{1}[0-9]{1}/ || /^[0-9]{2}[a-zA-Z]{4}[0-9]{5}[a-zA-Z]{1}[0-9]{1}[Z]{1}[0-9]{1}/ || /^[0-9]{4}[a-zA-Z]{3}[0-9]{5}[0-9]{1}[Z]{1}[0-9]{1}/,
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
export class imgResize {
  promises;
  imgformatedsize
  reader = new FileReader();
  url;


  constructor(
    private imageCompress: NgxImageCompressService,
    private zone: NgZone,
  ) { }

  file;
  handleFileInput(event) {
    //this.formdata = new FormData();
    this.file = event.target.files;
    if (event.target.files[0].name.match(/.(jpg|jpeg|png|gif)$/i)) {

      if (event.target.files[0].size >= 1000000) {
        this.compressimg(event.target.files);
        $('#PreviewImg').modal('show');
      } else {
        return this.file;
      }
    } else {
      return this.file;
      // this.imagecreate = event.target.files[0];
      // this.doc.filename = this.file[0].name;
      // this.doc.filesize = this.formatSizeUnits(this.file[0].size);
    }

  }

  formatSizeUnits(bytes) {
    if ((bytes >> 30) & 0x3FF)
      bytes = (bytes >>> 30) + '.' + (bytes & (3 * 0x3FF)) + 'GB';
    else if ((bytes >> 20) & 0x3FF)
      bytes = (bytes >>> 20) + '.' + (bytes & (2 * 0x3FF)) + 'MB';
    else if ((bytes >> 10) & 0x3FF)
      bytes = (bytes >>> 10) + '.' + (bytes & (0x3FF)) + 'KB';
    else if ((bytes >> 1) & 0x3FF)
      bytes = (bytes >>> 1) + 'Bytes';
    else
      bytes = bytes + 'Byte';
    return bytes;
  }


  async compressimg(files: FileList) {
    var promis = new Promise<void>((resolve, reject) => {
      this.zone.runOutsideAngular(() => {
        this.imgformatedsize = this.formatSizeUnits(files[0].size);
        resolve();
      });
    })

    promis.then((res) => {
      this.reader.readAsDataURL(files[0]);
      this.reader.onload = (event: any) => { // called once readAsDataURL is completed
        this.url = event.target.result;
      }

    })


  }

  changeIMGQuality(quality) {
    this.reader.readAsDataURL(this.file[0]);

    this.reader.onload = (event: any) => { // called once readAsDataURL is completed
      this.url = event.target.result;

      this.imageCompress.compressFile(this.url, 1, quality, quality).then(
        result => {
          this.url = result;
          const base64 = result;

          this.urltoFile(base64, this.file[0].name, 'image/png').then((res) => {
            this.promises = res;
            this.imgformatedsize = this.formatSizeUnits(res.size);

            this.reader.readAsDataURL(res);
            this.reader.onload = (event: any) => {
              this.url = event.target.result;
            }

          })
        })
    }

  }

  urltoFile(url, filename, mimeType) {
    return (fetch(url)
      .then(function (res) { return res.arrayBuffer(); })
      .then(function (buf) { return new File([buf], filename, { type: mimeType }); })
    );
  }
}
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
      return str.startsWith('(') && str.endsWith(')') ? -value : value;
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


@Injectable()
export class Master {
  tables: any = {};
  mstJsons: any = {};
  constructor(public provider: MyProvider, public sort: ArraySortPipe, public datepipe: DatePipe, public spinner: NgxSpinnerService, public http: http) { }
  formdisabled(mode: any) {
    if (mode == 'new' || mode == 'edit')
      return false;

    else

      return true;
  };

  Bankers() {
    return new Promise((resolve, reject) => {
      if (this.provider.companyinfo.accounts.length > 0) {
        var b: any = [];
        this.tables.Bankers = this.provider.companyinfo.accounts.filter((item: any) => {

          if (item.mg_code === 3 || item.mg_code === 4 || item.mg_code === 25) {
            if (item.AllowAllFirm) {

              b.push(item);
              resolve(b);
            }
            else {
              var fbIdx = item.firms.findIndex((fb: any) => {
                fb.firm_id === this.provider.companyinfo.company.firm_id && fb.Branch_code === this.provider.companyinfo.company.branch_id;
              });

              if (fbIdx >= 0)
                resolve(item);
            }
          }
        })

      }
    });


  }


  PayRecAccount() {
    return new Promise<void>((resolve, reject) => {
      if (this.provider.companyinfo.accounts.length > 0) {
        this.tables.PayRecAccount = this.provider.companyinfo.accounts.filter((item: any) => {
          //   var k=[];
          if ([3, 4, 23, 24, 25].filter((cmb: any) => {
            if (cmb != item.mg_code) {
              if (item.AllowAllFirm) {
                //      k.push(item);
                return cmb;
              }
              else {
                var fbIdx = item.firms.findIndex((fb: any) => {
                  return fb.firm_id === this.provider.companyinfo.company.firm_id && fb.Branch_code === this.provider.companyinfo.company.branch_id;
                });

                if (fbIdx >= 0)
                  return cmb;
              }

            }

          }).length > 0) {
            return item;
          }

        })
        resolve();
      }
      else
        resolve();

    })

  }


  CocProducts(firm_id: any) {
    if (!firm_id)
      firm_id = this.provider.companyinfo.company.firm_id;

    return new Promise((resolve, reject) => {
      if (this.provider.companyinfo.products.length > 0) {
        var CocProducts = this.provider.companyinfo.products.filter((item: any) => {

          if (item.I_mode === 1 || item.I_mode === 3) {
            var fbIdx = 0;
            if (firm_id && item.firms.length > 0)
              var fbIdx: number = item.firms.findIndex((fb: any) => {
                return fb === firm_id;
              });

            if (fbIdx >= 0)
              return item;
          }

        })

        var CocItems = this.sort.transform(CocProducts, 'I_Name');

        resolve(CocItems);
      }
      else
        resolve([]);

    });

  }

  RoundN(num: any, n: any) {
    num = parseFloat(num);
    return (Math.round(num * Math.pow(10, n)) / Math.pow(10, n)).toFixed(n);
  };

  GenChallanNo(vch_type: any, Config: any, vch_no: any, tp?: any) {

    var challan: any;
    var branch_id = "";

    var ptrn = Config.pattern.split(',');

    if (this.provider.companyinfo.company.branch_id)
      branch_id = this.provider.companyinfo.company.branch_id;

    var padLen = 0;
    var tpLen = 0;

    if (tp)
      tpLen = tp.trim().length;

    if (Config.padding)
      padLen = Config.vchLength - tpLen;

    if (padLen < 0)
      padLen = 0;

    var vchNo = vch_no.toString();

    while (vchNo.length < padLen)
      vchNo = '0' + vchNo;


    if (tp)
      vchNo = tp.trim() + vchNo;


    ptrn.forEach((value: any) => {
      switch (value) {
        case "COMPANYCODE":
          challan += this.provider.companyinfo.company.firm_code.toString();
          break;

        case "COMPANYALIAS":
          challan += this.provider.companyinfo.company.firm_alias.trim();
          break;

        case "BRANCHCODE":
          challan += branch_id.trim();
          break;

        case "VOUCHERCODE":
          challan += vch_type.toString();
          break;

        case "VOUCHERNO":
          challan += vchNo;
          break;

        case "YEAR":
          challan += this.provider.companyinfo.company.fyprefix.trim();
          break;

        case "/":
          challan += "/";
          break;

        case "-":
          challan += "-";
          break;

        case "PREFIX":
          challan += Config.prefix.trim();
          break;


      }

    });

    if (challan.length > 15) {

      var rtn = {
        status_cd: 0,
        error: "Challan No Lenght(" + challan.length + ") is Greater Than 15 Characters. \r\n Please Contact Your Administrator."
      }

      return rtn;

    } else {

      var b = { status_cd: 1, data: challan }

      return b;
    }
  }


  getBranchGst(vchDate: any, fn?: any, firm_id?: any) {
    return new Promise((resolve, reject) => {
      var company = {
        type: 3,
        gstin: null
      };

      var params = {
        branch_id: this.provider.companyinfo.company.branch_id,
        dt: this.datepipe.transform(vchDate, 'yyyy/MM/dd'),
        firm_id: firm_id ? firm_id : this.provider.companyinfo.company.firm_id
      }

      if (vchDate) {
        this.spinner.show();
        this.http.get('branch/gstur', params).subscribe((res: any) => {
          if (res.status_cd == 1) {
            company.gstin = res.data.branch_gstn;
            company.type = res.data.GSTUR;

            company.type = company.type == null ? 3 : company.type;
            this.spinner.hide();
            resolve(company);

          }
          else {
            var error = "An Error has occured while branch gstin record!";

            if (res.error)
              if (res.error.message)
                error = res.error.message;
            this.spinner.hide();
            reject(error);


          }
        })
      }
    })


  };

  getAccountGST(accCode: any, vchDate: any, fn?: any) {

    return new Promise((resolve, reject) => {

      var account = {
        type: 3,
        gstin: null

      };

      if (accCode != null) {
        this.spinner.show();
        this.http.get('Account/actGST', {
          id: accCode,
          vchDate: this.datepipe.transform(vchDate, 'yyyy/MM/dd')
        }).subscribe((res: any) => {
          if (res.status_cd == 1) {
            if (res.data != null) {
              account.gstin = res.data.acc_gstn;
              account.type = res.data.GSTUR;

              account.type = account.type == null ? 3 : account.type;
            }
            this.spinner.hide();
            resolve(account);

          }
          else {
            var error = "An Error has occured while ?? record!";

            if (res.error)
              if (res.error.message)
                error = res.error.message;

            this.spinner.hide();
            reject(error);
            // R1Util.createAlert(this, "Error", error, null);
          }
        })
      }
    })
  };


  requestAccounts() {
    return new Promise<void>((resolve, reject) => {
      var params = { firm_id: '', branch_id: this.provider.companyinfo.selectedbranch.branch_code }

      if (this.provider.companyinfo.accounts.length <= 0) {

        this.http.get("account/accounts", params).subscribe({
          next: (res: any) => {
            this.provider.companyinfo.accounts = res.data;
            this.provider.companyinfo.last_api_calls.accounts = res.call_time;
            resolve(this.provider.companyinfo.accounts);
          }, error: (err) => {
            reject(err)

          }
        });
      } else {
        resolve();
      }
    })
  }

  Products(firm_id, tom, grp) {
    return new Promise<void>((resolve, reject) => {
      if (this.provider.companyinfo.products) {
        var products = this.provider.companyinfo.products.filter((item) => {

          if ((!tom || item.I_mode === tom) && (!grp || item.I_Group === grp)) {
            var fbIdx: any = -1;
            if (firm_id && item.firms.length > 0)

              var fbIdx = item.firms.findIndex((fb) => {
                return fb === firm_id;
              });
            else
              fbIdx = 1;

            if (fbIdx >= 0)
              return item;
          }

        })

        //  var items = orderBy(products, ['tom_name', 'grp_name', 'I_HSN', 'I_Name'], false);

        resolve(products)
      }
      else
        resolve();


    })
  };


  Units() {
    return new Promise<void>((resolve, reject) => {
      if (this.provider.companyinfo.master.Units) {
        this.tables.Units = this.provider.companyinfo.master.Units;
        resolve(this.provider.companyinfo.master.Units);
      }
      else
        resolve();
    })
  };

  Places(tal_id, dist_id, state_id) {

    return new Promise<void>((resolve, reject) => {
      if (this.provider.companyinfo.master.Destinations) {
        var Places = this.provider.companyinfo.master.Destinations.filter(function (item) {
          if ((!tal_id || item.Taluka_id === tal_id) && (!dist_id || item.mst006_01.District_id === dist_id) && (!state_id || item.mst006_01.mst006_02.State_Code === state_id)) {
            return item;
          }
        })

        if (!tal_id && !dist_id && !state_id)
          this.tables.Places = Places;

        resolve(Places);
      }
      else
        resolve();
    })

  };

  requestProducts() {

    return new Promise<void>((resolve, reject) => {
      var params = { firm_id: '' }
      if (!this.provider.companyinfo.products)

        this.http.get("product/products", params).subscribe({
          next: (res: any) => {
            // companyinfo.master.Products = res.data;

            // Sohan 22-02-21
            this.provider.companyinfo.products = this.sort.transform(res.data, JSON.stringify(['tom_name', 'grp_name', 'I_HSN', 'I_Name']));


            this.provider.companyinfo.last_api_calls.Products = res.call_time;

            resolve();

          }, error: (err) => {

            return reject("No Data Founf");
          }
        });
      else
        resolve();
    });
  }


  requestPlaces() {
    return new Promise<void>((resolve, reject) => {
      if (!this.provider.companyinfo.Destinations)

        this.http.get("city/citys").subscribe((res: any) => {
          this.provider.companyinfo.Destinations = res.data;
          this.provider.companyinfo.last_api_calls.Places = res.call_time;

          resolve();

        }, function (res) {
          var data = res;
          reject("No Data Found");
        });
      else
        resolve();

    })
  };


  requestItemUnits(hideLoading?: any) {
    return new Promise((resolve, reject) => {

      var IgnoreLoadingBar = false;

      if (hideLoading) { IgnoreLoadingBar = true; }

      if (!this.provider.companyinfo.Units) {

        this.http.get("unit/units", IgnoreLoadingBar).subscribe((res: any) => {
          this.provider.companyinfo.Units = res.data;
          this.provider.companyinfo.last_api_calls.Units = res.call_time;

          resolve(res.data);

        }, function (res) {
          var data = res;
          reject("No Data Found");
        });
      } else {
        resolve(this.provider.companyinfo.Units);
      }
    })

  };

  async requestTalukas() {
    return new Promise<void>((resolve, reject) => {
      if (!this.provider.companyinfo.Talukas) {
        this.http.get("taluka/talukas").subscribe({
          next: (res: any) => {
            this.provider.companyinfo.Talukas = res.data;
            this.provider.companyinfo.last_api_calls.Talukas = res.call_time;
            resolve();
          }, error: (res: any) => {
            var data = res;
            reject("No Data Found");
          }
        });
      }
      else {
        resolve();
      }
    })
  };

  requestDistricts() {
    return new Promise<void>((resolve, reject) => {
      if (!this.provider.companyinfo.Districts) {
        this.http.get("district/districts").subscribe((res: any) => {
          this.provider.companyinfo.Districts = res.data;
          this.provider.companyinfo.last_api_calls.Districts = res.call_time;

          resolve();

        }, function (res) {
          var data = res;
          reject("No Data Found");
        });
      }
      else
        resolve();

    })

  };

  requestStates() {
    return new Promise<void>((resolve, reject) => {
      if (!this.provider.companyinfo.States) {
        this.http.get("State/States").subscribe((res: any) => {
          this.provider.companyinfo.States = res.data;
          this.provider.companyinfo.last_api_calls.States = res.call_time;

          resolve();

        }, function (res) {
          var data = res;
          reject("No Data Found");
        });
      }
      else
        resolve();
    })

  };


  requestProductGroup(hideLoading?: any) {

    return new Promise<void>((resolve, reject) => {
      var IgnoreLoadingBar = false;

      if (hideLoading) IgnoreLoadingBar = true;

      this.http.get('productGroup/prodGroups', IgnoreLoadingBar).subscribe((res: any) => {

        var allGroup = { 'grp_name': 'ALL', 'grp_code': 0 };

        res.data.splice(0, 0, allGroup);

        // this.tables.productGroups = res.data;

        resolve(res.data);

      }, function (res) {
        var data = res;
        reject("No Data Found");
      });

    })
  };

  requestHamaliRate(hideLoading?: any) {
    return new Promise((resolve, reject) => {
      var IgnoreLoadingBar = false;

      if (hideLoading) IgnoreLoadingBar = true;

      this.http.get('HamaliRate/Records', IgnoreLoadingBar).subscribe((res: any) => {
        if (res.data)
          resolve(res.data);
        else
          resolve([]);

      }, function (res) {
        var data = res;
        resolve([]);
      });

    })

  };


  Debitors() {
    return new Promise<void>((resolve, reject) => {

      if (this.provider.companyinfo.master.Accounts) {
        this.tables.Debitors = this.provider.companyinfo.master.Accounts.filter((item: any) => {
          if (item.mg_code === 5) {
            if (item.AllowAllFirm) {
              return item;
            }
            else {
              var fbIdx = item.firms.findIndex(function (fb) {
                return fb.firm_id === this.provider.companyinfo.company.firm_id && fb.Branch_code === this.provider.companyinfo.company.branch_id;
              });

              if (fbIdx >= 0)
                return item;
            }
          }
        })

        resolve();
      }
      else
        resolve();

    })
  };


  tom() {
    var gfl = [
      { tom_id: 0, tom_nm: 'All Goods' },
      { tom_id: 1, tom_nm: 'Raw Material' },
      { tom_id: 2, tom_nm: 'Semi Finieshed Goods' },
      { tom_id: 3, tom_nm: 'Finished Goods' },
      { tom_id: 4, tom_nm: 'Store Material' },
      { tom_id: 5, tom_nm: 'Packing Material' },
      { tom_id: 6, tom_nm: 'Scrape & Waste Material' },
      { tom_id: 8, tom_nm: 'Fixed Assets' }
    ]

    return [
      { tom_id: 0, tom_nm: 'All Goods' },
      { tom_id: 3, tom_nm: 'Bill of Material' },
      { tom_id: 4, tom_nm: 'Store Material' },
      { tom_id: 5, tom_nm: 'Packing Material' },
      { tom_id: 8, tom_nm: 'Fixed Assets' }
    ]

  };

  cleanObject = (obj, level, recurse = true) => {
    const isObject = _ => _ instanceof Object && _.constructor.name == "Object"
    const isEmpty = _ => isObject(_) ? !!!Object.values(_).length : false
    for (let key in obj) {
      if (level) {
        if ([null, undefined].indexOf(obj[key]) > -1)
          delete obj[key]
        else if (isObject(obj[key]))
          obj[key] = this.cleanObject(obj[key], level, false)
      }
      if (recurse) {
        if (isEmpty(obj[key]))
          delete obj[key]
        --level
      }
    }
    return obj
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
            blob => {
              if (blob) {
                observer.next(new File(
                  [blob],
                  file.name,
                  {
                    type: imageType,
                    lastModified: Date.now(),
                  }
                ))
              }
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


