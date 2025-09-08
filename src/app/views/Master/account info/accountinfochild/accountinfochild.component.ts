import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, ViewChild } from '@angular/core';
import { CommonModule, DatePipe, Location } from '@angular/common';
import { NavbarActions, http, ngselectpagination, Master } from '../../../../assets/services/services';
import { NgxSpinnerService } from 'ngx-spinner';
import { MyProvider } from '../../../../assets/services/provider';
import { DialogsComponent } from '../../../../assets/pg/dialogs/dialogs.component';
import { FormsModule, NgForm } from '@angular/forms';
import { AccountObj, mst01110sObj, grpCodeNavigationObj, accBusinessLocationObj, mst01101Obj, mst01104Obj, mst01109Obj, cityObj, mst01100Obj } from '../../../../assets/datatypests/accontinfochild'
import { MydirectiveModule } from '../../../../assets/mydirective/mydirective.module';
import { DssInputComponent } from '../../../../assets/mydirective/dss-input/dss-input.component';
import { ngselectComponent } from '../../../../assets/pg/ngselect/ngselect.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { MasternavComponent } from '../../../../assets/pg/masternav/masternav.component'
import { NumberOnlyDirective, } from '../../../../assets/mydirective/mydirective.directive';
import { CurrencyMaskDirective } from "../../../../assets/mydirective/currencyMask/currency-mask.directive";


@Component({

  selector: 'app-accountinfochild',
  templateUrl: './accountinfochild.component.html',
  styleUrls: ['./accountinfochild.component.scss'],
  imports: [FormsModule, CommonModule, ngselectComponent, CurrencyMaskDirective, NumberOnlyDirective, NgSelectModule, DssInputComponent, MydirectiveModule, MasternavComponent,],

  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AccountinfochildComponent implements OnInit {
  @ViewChild("account") account: NgForm;
  entity: AccountObj;

  isDisabled: boolean = true;

  reference: any = {};
  Firms = [];
  acc: any = {};
  status: boolean = false;
  ngview: boolean = false;
  stateParams: any;
  mode: any;
  rowIndex: any;
  param;
  loading: boolean = false;
  placebuffer = [];
  viewing1: number = 1;
  viewing2: any = 2;
  pastentity;

  gstininfo: any = {};
  constructor(public location: Location,
    public http: http,
    private datepipe: DatePipe,
    private dialog: DialogsComponent,
    private spinner: NgxSpinnerService,
    private provider: MyProvider,
    public navactions: NavbarActions,
    public ngselect: ngselectpagination,
    public master: Master,
    private cd: ChangeDetectorRef
  ) {
    this.entity = <AccountObj>{};
    this.stateParams = this.location.getState();
    this.mode = this.stateParams.action;
    this.entity.accCode = this.stateParams.id;
  }

  ngOnInit(): void {
    setInterval(() => {
      this.windowrespo();
    }, 1000)

    this.entity = <AccountObj>{};
    this.acc.accBusinessLocations = <accBusinessLocationObj>{};
    this.acc.accBusinessLocations.city = <cityObj>{};
    this.reference.accLicenses = <mst01110sObj>{};
    this.entity.isDisabled = true;
    this.entity.mst01100 = <mst01100Obj>{}
    this.entity.mst01109 = <mst01109Obj>{};
    this.entity.mst01101 = <mst01101Obj>{};
    this.entity.mst01104 = <mst01104Obj>{};
    this.entity.mst01110s = <mst01110sObj[]>[];
    this.entity.grpCodeNavigation = <grpCodeNavigationObj>{};
    this.entity.mst01100 = {
      // firmId: this.provider.companyinfo?.company?.firmCode ?? null,
      // divId: this.provider.companyinfo?.company?.divId ?? null,
      crbal: this.entity.mst01100.crbal,
      drbal: this.entity.mst01100.drbal
    } as mst01100Obj;
    let paramss: any = this.location.getState();
    this.navactions.navaction(paramss.action);
    this.entity.accCode = paramss.id;

    if (this.entity.accCode) {
      this.navactions.fieldset = true;
      this.callbackedit();
    } else {
      this.navactions.fieldset = false;
      this.newRecord();
    }
    this.Init();
  }

  windowrespo() {
    if (window.innerWidth <= 767) {
      this.status = true;
    } else {
      this.status = false;
    }
  }
  
  Init() {
    this.http.jsonget('assets/json/currancy.json').subscribe({
      next: (res: any) => {
        this.reference.jeson = res;
      }, error: err => {
        this.dialog.swal({ dialog: 'error', title: 'Error', message: err });
      }
    })

    this.http.jsonget('assets/json/GSTURLIST.json').subscribe({
      next: (res: any) => {
        this.reference.gstTypes = res;
      }, error: err => {
        this.dialog.swal({ dialog: 'error', title: 'Error', message: err });
      }
    })

    return new Promise<void>((resolve, reject) => {
      this.loading = true;
      this.http.get('Firm/list').subscribe({
        next: (res: any) => {
          if (res.status_cd == 1) {
            this.Firms = res.data;
            this.reference.firmCode = res.data[0].firmCode;
            this.firm(res.data[0]);

            this.loading = false;
            resolve();
          } else {
            this.loading = false;
            this.dialog.swal({ dialog: 'error', title: 'Error', message: res.errors.exception.Message });
          }
          this.spinner.hide();
        }, error: (err: any) => {
          this.spinner.hide();
          reject();
          this.dialog.swal({ dialog: 'error', title: 'Error', message: err.message });
        }
      })
    })

  }

  navbar(s) {
    switch (s) {
      case 'new':
        this.newRecord();
        break;

      case 'edit':

        this.edit();

        break;

      case 'save':
        this.save();
        break;

      case 'undo':
        this.undo();
        break;

      case 'print':
        this.ngview = true;
        break;

      case 'close':
        this.close();
        break;
    }

  }

  idx = null;
  addFirm() {

    this.reference.accCode = this.entity.accCode;

    var x = this.entity.mst01110s.filter((firm) => firm.firmCode === this.reference.firmCode);

    if (x.length == 0) {
      if (this.idx == null) {

        this.entity.mst01110s.push(this.reference);
      } else {
        alert('Firm already added!');
      }

      this.reference = {};
    } else {
      alert('Please select a firm to add.');
    }
  }

  toggleSelect(ev): void {
    this.entity.isDisabled = 1;
    this.entity.mst01110s = [];
    this.reference.firmCode = {}
  }

  isInvalidPan: boolean = false;
  isInvalidWebsite: boolean = false;
  isInvalidEmail: boolean = false;
  exampleEmail: string = 'user@example.com';

  validatePan(pan: string): void {
    const panPattern = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    this.isInvalidPan = pan ? !panPattern.test(pan) : false;
  }

  validateWebsite(website: string): void {
    const websitePattern = /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+)\.([a-zA-Z]{2,})([\/\w\.-]*)*\/?$/;
    this.isInvalidWebsite = website ? !websitePattern.test(website) : false;
  }

  validateEmail(email: string): void {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    this.isInvalidEmail = email ? !emailPattern.test(email) : false;
  }

  updateModel(index) {
    this.entity.placeId = index.value;
  }

  callbackedit() {
    this.spinner.show();
    var url = "Account/AccountById"
    this.http.get(url, { id: this.entity.accCode }).subscribe({
      next: (res: any) => {
        if (res.status_cd == 1) {
          this.entity = res.data;

          if (!this.entity.mst01100)
            this.entity.mst01100 = <mst01100Obj>{};

          if (!this.entity.mst01109) this.entity.mst01109 = <mst01109Obj>{};
          this.entity.mst01109.gstur = Number(this.entity.mst01109.gstur);
          if (!this.entity.mst01101) this.entity.mst01101 = <mst01101Obj>{};
          if (!this.entity.mst01104) this.entity.mst01104 = <mst01104Obj>{};

          this.entity.createdDt = this.entity.createdDt ? this.datepipe.transform(this.entity.createdDt, 'yyyy-MM-dd') : null;

          this.entity.modifiedDt = this.entity.modifiedDt ? this.datepipe.transform(this.entity.modifiedDt, 'yyyy-MM-dd') : null;

          this.pastentity = Object.assign({}, this.entity);

          this.entity.isDisabled = this.entity.isDisabled || 0;

          this.cd.detectChanges();
        }
        this.spinner.hide();

      }, error: (err: any) => {
        this.spinner.hide();
        this.dialog.swal({ dialog: 'error', title: 'Error', message: err });
      }
    })
  }

  creditEnabled = false;
  onSelectGroup(event) {
    this.entity.sgCodeNavigation = event;
    const mgCode = event?.grpCodeNavigation?.mgCode ?? null;
    this.creditEnabled = [3, 4, 5, 14, 25].includes(mgCode);
  }

  save() {
    Object.keys(this.account.form.controls).forEach(key => {
      const control = this.account.form.controls[key];
      if (control.invalid) {
        console.log(`Invalid Field: ${key}`, control.errors);
      }
    });
    if (this.entity?.mst01109?.gstur != 3 && this.creditEnabled) {
      if (!this.entity.mst01109?.accGstn || this.entity.mst01109.accGstn.trim() === '') {
        this.dialog.swal({
          dialog: 'error',
          title: 'Validation Error',
          message: 'GSTIN is required'
        });
        return; // stop further execution
      }
    }
    this.spinner.show();
    this.entity.mst01100 = {
      // firmId: this.provider.companyinfo?.company?.firmCode ?? null,
      // divId: this.provider.companyinfo?.company?.divId ?? null,
      crbal: this.entity.mst01100?.crbal ?? 0,
      drbal: this.entity.mst01100?.drbal ?? 0,
    } as mst01100Obj;
    if (!this.entity.accCode) {
      if (!this.entity.createdUser)
        this.entity.createdUser = this.provider.companyinfo.userinfo.username;

      this.http.post('Account/insert', this.master.cleanObject(this.entity, 2)).subscribe({
        next: (res: any) => {
          if (res.status_cd == 1) {

            this.entity.accCode = res.data.accCode;
            this.pastentity = JSON.parse(JSON.stringify(this.entity))

            if (!this.entity.mst01100) {
              this.entity.mst01100 = <mst01100Obj>{};
            }

            if (!this.entity.mst01104) {
              this.entity.mst01104 = <mst01104Obj>{};
            }
            if (!this.entity.mst01101) {
              this.entity.mst01101 = <mst01101Obj>{};
            }
            if (!this.entity.mst01109) {
              this.entity.mst01109 = <mst01109Obj>{};
            }

            this.dialog.swal({ dialog: "success", title: "Success", message: "Record is saved sucessfully" });
            this.navactions.navaction("OK");
          }
          else {
            this.dialog.swal({ dialog: 'error', title: 'Error', message: res.errors.exception.InnerException.message })
          }
          this.spinner.hide();
        }, error: (err: any) => {
          this.spinner.hide()
          this.dialog.swal({ dialog: 'error', title: 'Error', message: err.message })
        }
      })
    }
    else {
      this.entity.modifiedUser = this.provider.companyinfo.userinfo.username;
      this.http.put('Account/update', this.master.cleanObject(this.entity, 2), { id: this.entity.accCode }).subscribe({
        next: (res: any) => {

          if (res.status_cd == 1) {
            this.entity.accCode = res.data.accCode;
            if (!this.entity.mst01104) {
              this.entity.mst01104 = <mst01104Obj>{};
            }
            if (!this.entity.mst01101) {
              this.entity.mst01101 = <mst01101Obj>{};
            }
            if (!this.entity.mst01109) {
              this.entity.mst01109 = <mst01109Obj>{};
            }

            this.dialog.swal({ dialog: "success", title: "Success", message: "Record is Update sucessfully" });
            this.navactions.navaction("OK");
          }

          this.spinner.hide()
        }, error: (err: any) => {
          this.dialog.swal({ dialog: 'error', title: 'Error', message: err })
        }
      })
    }
}

close() {
  this.location.back();
}

newRecord() {
  this.pastentity = JSON.parse(JSON.stringify(this.entity))
  this.entity = <AccountObj>{};

  this.entity.mst01100 = <mst01100Obj>{};
  this.entity.mst01101 = <mst01101Obj>{};
  this.entity.mst01104 = <mst01104Obj>{};
  this.entity.mst01109 = <mst01109Obj>{};
  this.entity.mst01110s = <mst01110sObj[]>[];
  this.entity.accBusinessLocations = <accBusinessLocationObj[]>[];
}

edit() {
  this.navactions.navaction("view");
  this.callbackedit();
}

getdata(index) {
  console.log(index);
}

undo() {
  this.entity = this.pastentity;
  this.callbackedit();
  this.entity = <AccountObj>{};
  this.entity.mst01100 = <mst01100Obj>{};
  this.entity.mst01101 = <mst01101Obj>{};
  this.entity.mst01104 = <mst01104Obj>{};
  this.entity.mst01109 = <mst01109Obj>{};
  this.entity.mst01110s = <mst01110sObj[]>[];
  this.entity.accBusinessLocations = <accBusinessLocationObj[]>[];
}

Add() {
  if (this.rowIndex == null) {
    this.entity.accBusinessLocations.push(this.acc.accBusinessLocations);
  } else {

    this.entity.accBusinessLocations[this.rowIndex] = this.acc.accBusinessLocations;
  }
  this.acc.accBusinessLocations = <accBusinessLocationObj>{};
  this.acc.accBusinessLocations.city = <cityObj>{};
  this.rowIndex = null;
}

accBusinessLocations(index) {
  this.reference.accBusinessLocations.cityName = index
}

editrow(s) {
  this.rowIndex = this.entity.accBusinessLocations.indexOf(s);
  this.acc.accBusinessLocations = Object.assign({}, s);
}

deleterow(s) {
  var params = {
    dialog: 'confirm',
    title: "warning",
    message: "Do You Want Delete Row",
  }
  this.dialog.swal(params).then(data => {
    if (data == true) {

      this.param = this.entity.accBusinessLocations.indexOf(s);
      this.iConfirmFn2();
    }
  })
}

iConfirmFn2() {
  if (this.param != undefined) {

    this.entity.accBusinessLocations.splice(this.param, 1);
    var params = {
    }
    this.dialog.swal(params);
  }
}

licensedelete(s) {
  var params = {
    dialog: 'confirm',
    title: "warning",
    message: "Do You Want Delete Row",
  }
  this.dialog.swal(params).then(data => {
    if (data == true) {

      this.param = this.entity.mst01110s.indexOf(s);
      this.iConfirmFn3();
    }
  })
}

iConfirmFn3() {
  if (this.param != undefined) {

    this.entity.mst01110s.splice(this.param, 1);
    var params = {
    }
    this.dialog.swal(params);
  }
}

closerdlc(s) {
  this.ngview = false;
}

firm(index) {
  this.reference.firmName = index.firmName;
  this.reference.firmCode = index.firmCode;
}
}
