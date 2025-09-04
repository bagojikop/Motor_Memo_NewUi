import { CommonModule, DatePipe, Location } from '@angular/common';
import { http, Master, NavbarActions } from '../../../../assets/services/services';
import { Component, ViewChild, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { MyProvider } from '../../../../assets/services/provider';
import { DialogsComponent } from '../../../../assets/pg/dialogs/dialogs.component';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { mst10804Obj, mst10801sObj, mst10805sObj, referenceObj, SubconsigneeObj, mst10806sObj } from '../../../../assets/datatypests/vehicleInfochild'
import { grpCodeNavigationObj, mst01101Obj, mst01104Obj, mst01109Obj } from '../../../../assets/datatypests/accontinfochild'
import { NgSelectModule } from '@ng-select/ng-select';
import { DssInputComponent } from '../../../../assets/mydirective/dss-input/dss-input.component';
import { MydirectiveModule } from '../../../../assets/mydirective/mydirective.module';
import { MasternavComponent } from '../../../../assets/pg/masternav/masternav.component';
import { ngselectComponent } from '../../../../assets/pg/ngselect/ngselect.component';
import { NumberOnlyDirective } from '../../../../assets/mydirective/mydirective.directive';

declare var bootstrap: any;
declare var $: any;

@Component({
  selector: 'app-vehicle-infochild',
  templateUrl: './vehicle-infochild.component.html',
  styleUrls: ['./vehicle-infochild.component.scss'],
  imports: [FormsModule, CommonModule, ngselectComponent, NumberOnlyDirective, NgSelectModule, DssInputComponent, MydirectiveModule, MasternavComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class VehicleInfochildComponent {
  @ViewChild("vi") vi: NgForm;
  entity: SubconsigneeObj;
  reference: any = {};
  acc: any = {};
  status: boolean = false;
  ngview: boolean = false;
  stateParams: any;
  selectedOption: string = 'Own';

  mode: any;
  rowIndex: any;
  param;
  loading: boolean = false;
  placebuffer = [];
  types = [];
  info: any = {}

  viewing1: number = 1;
  viewing2: number = 2;
  pastentity;
  constructor(public location: Location,
    public http: http,
    public httpclient: HttpClient,
    private datepipe: DatePipe,
    private dialog: DialogsComponent,
    private spinner: NgxSpinnerService,
    private provider: MyProvider,
    public navactions: NavbarActions,
    public master: Master
  ) {
    this.entity = <SubconsigneeObj>{};
    this.stateParams = this.location.getState();
    this.mode = this.stateParams.action;
    this.entity.sCode = this.stateParams.id;
  }
  freightTypeList: any = [];

  ngOnInit(): void {


    setInterval(() => {
      this.windowrespo();
    }, 1000)

    this.entity = <SubconsigneeObj>{};
    this.reference.places = [];
    this.reference.suppliers = [];

    this.entity.mst01109 = <mst01109Obj>{};
    this.entity.mst01101 = <mst01101Obj>{};
    this.entity.mst01104 = <mst01104Obj>{};
    this.entity.grpCodeNavigation = <grpCodeNavigationObj>{};

    this.info.reference = <referenceObj>{};
    this.info.reference.state = {};

    let paramss: any = this.location.getState();
    this.navactions.navaction(paramss.action);
    this.entity.sCode = paramss.id;
    this.entity.mst10804 = <mst10804Obj>{};
    this.entity.mst10801s = <mst10801sObj>{};
    this.entity.mst10805s = [];
    this.entity.mst10806s = [];
    this.info.mst10806 = {}
    this.info.mst10806.isTransport = 0;
    this.reference.mst01104 = <mst01104Obj>{};

    if (this.entity.sCode) {
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

    this.http.get('VehicleType/list').subscribe({
      next: (res: any) => {
        if (res.status_cd == 1) {
          this.reference.vtypes = res.data;

        } else {
          this.dialog.swal({ dialog: 'error', title: 'Error', message: res.errors.exception.Message });
        }
        this.spinner.hide();
      }, error: (err: any) => {
        this.spinner.hide();
        this.dialog.swal({ dialog: 'error', title: 'Error', message: err.message });
      }
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

  statechagename(obj) {
    this.info.reference.state = obj;
  }

  Addtaxdata() {
    if (this.info.reference.StateIdthis || this.info.reference.permitfm || this.info.reference.permitto || this.info.reference.taxfm || this.info.reference.taxno || this.info.reference.taxfm || this.info.reference.taxfm) {

      if (this.rowIndex == null) {
        this.entity.mst10805s.push(this.info.reference);

      } else {

        this.entity.mst10805s[this.rowIndex] = this.info.reference;
      }
      this.info.reference = {}
      this.rowIndex = null;

    }
  }

  AddOwner() {
    if (this.info.mst10806.eff_Dt || this.info.mst10806.ownerName || this.info.mst10806.panNo || this.info.mst10806.accCode || this.info.mst10806.isTransport) {

      if (this.rowIndex == null) {
        this.entity.mst10806s.push(this.info.mst10806);

      } else {

        this.entity.mst10806s[this.rowIndex] = this.info.mst10806;
      }
      this.info.mst10806 = {}
      this.rowIndex = null;

    }
  }

  getAccountDetl(obj) {
    this.info.mst10806.accCodeNavigation = obj;
  }

  editownerrow(obj, index){
    this.rowIndex = index;
    this.info.mst10806 = Object.assign({}, obj);
  }

  deleteownerrow(i){
     var params = {
      dialog: 'confirm',
      title: "warning",
      message: "Do You Want Delete Row",
    }
    this.dialog.swal(params).then(data => {
      if (data == true) {
        this.param = this.entity.mst10806s.indexOf(i);
        this.iConfirmFn2();
      }
    })
  }

  iConfirmFn2() {
    if (this.param != undefined) {
      this.entity.mst10806s.splice(this.param, 1);
      var params = {
      }
      this.dialog.swal(params);
    }
  }

  editgstTablerow(obj, index) {
    this.rowIndex = index;
    this.info.reference = Object.assign({}, obj);
  }

  deletegstTablerow(i) {
    var params = {
      dialog: 'confirm',
      title: "warning",
      message: "Do You Want Delete Row",
    }
    this.dialog.swal(params).then(data => {
      if (data == true) {
        this.param = this.entity.mst10805s.indexOf(i);
        this.iConfirmFn3();
      }
    })
  }

  iConfirmFn3() {
    if (this.param != undefined) {
      this.entity.mst10805s.splice(this.param, 1);
      var params = {
      }
      this.dialog.swal(params);
    }
  }

  callbackedit() {
    this.spinner.show();
    var url = "Vehicle/ByNo"
    this.http.get(url, { id: this.stateParams.id }).subscribe({
      next: (res: any) => {
        if (res.status_cd == 1) {
          this.entity = res.data;

          this.entity.mst01109 = this.entity.mst01109 || <mst01109Obj>{};
          this.entity.mst01101 = this.entity.mst01101 || <mst01101Obj>{};
          this.entity.mst01104 = this.entity.mst01104 || <mst01104Obj>{};

          this.entity.mst10804 = this.entity.mst10804 || <mst10804Obj>{};
          this.entity.mst10801s = this.entity.mst10801s || <mst10801sObj>{};

          this.entity.createdDt = this.entity.createdDt ?? this.datepipe.transform(this.entity.createdDt, 'yyyy-MM-dd');
          this.entity.modifiedDt = this.entity.modifiedDt ?? this.datepipe.transform(this.entity.modifiedDt, 'yyyy-MM-dd');

          this.pastentity = Object.assign({}, this.entity);

        }
        this.spinner.hide();

      }, error: (err: any) => {
        this.spinner.hide();
        this.dialog.swal({ dialog: 'error', title: 'Error', message: err });
      }
    })
  }
  save() {

    this.entity.mst01101 = this.entity.mst01101;
    this.entity.mst01104 = this.entity.mst01104;
    this.entity.mst01109 = this.entity.mst01109;

    this.spinner.show();

    if (!this.entity.createdUser)
      this.entity.createdUser = this.provider.companyinfo.userinfo.username;
    this.entity.sCode = 2;

    this.entity.modifiedUser = this.provider.companyinfo.userinfo.username;
    this.http.put('Vehicle/update', this.master.cleanObject(this.entity, 2), { id: this.entity.vehicleNo }).subscribe({
      next: (res: any) => {
        this.spinner.hide()
        if (res.status_cd == 1) {

          if (!this.entity.mst10804) {
            this.entity.mst10804 = <mst10804Obj>{};
          }
          if (!this.entity.mst10801s) {
            this.entity.mst10801s = <mst10801sObj>{};
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

          this.entity.sCode = res.data.sCode;

          this.dialog.swal({ dialog: "success", title: "Success", message: "Record is Update sucessfully" });
          this.navactions.navaction("OK");
        } else {
          this.dialog.swal({ dialog: 'error', title: 'Error', message: res.errors.exception.InnerException.message })
        }


      }, error: (err: any) => {
        this.spinner.hide()
        this.dialog.swal({ dialog: 'error', title: 'Error', message: err.message })
      }
    })
  }


  account(index) {
    this.reference.subdealars.accName = index.accName;
  }

  close() {
    this.location.back();
  }
  newRecord() {
    this.pastentity = JSON.parse(JSON.stringify(this.entity))
    this.entity = <SubconsigneeObj>{};
    this.entity.mst10805s = <mst10805sObj[]>[];
    this.entity.mst10804 = <mst10804Obj>{};
    this.entity.mst10801s = <mst10801sObj>{};
    this.entity.mst10806s = <mst10806sObj[]>[];
  }
  edit() {
    this.navactions.navaction("view");
    this.callbackedit();

  }

  undo() {
    this.entity = this.pastentity;

    this.entity.mst01101 = <mst01101Obj>{};
    this.entity.mst01104 = <mst01104Obj>{};
    this.entity.mst01109 = <mst01109Obj>{};
    this.callbackedit();
  }


  onOptionChange(value: string): void {
    this.entity.isOwn = value;
    console.log('Selected Option:', this.entity.isOwn);
  }

  isInvalidPan: boolean = false;
  isInvalidPanmodel: boolean = false;
  validatePan(pan: string): void {
    const panPattern = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    this.isInvalidPan = pan ? !panPattern.test(pan) : false;
  }
  validatePanmodel(pan: string) {
    const panPattern = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    this.isInvalidPanmodel = pan ? !panPattern.test(pan) : false;
  }

  submitModuledata() {
    if (!this.entity.accCode) {
      if (!this.entity.createdUser)
        this.reference.createdUser = this.provider.companyinfo.userinfo.username;

      this.entity.isDisabled = true
      this.http.post('Vehicle/insert', this.master.cleanObject(this.reference, 2)).subscribe({
        next: (res: any) => {
          if (res.status_cd == 1) {

            this.entity.accCode = res.data.accCode;
            this.pastentity = JSON.parse(JSON.stringify(this.entity))

            if (!this.reference.mst01104) {
              this.reference.mst01104 = <mst01104Obj>{};
            }

            this.dialog.swal({ dialog: "success", title: "Success", message: "Record is saved sucessfully" });
            $('#exampleModal').modal('hide');
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
  }

  getpandetails(item) {
    this.entity.panNo = item.panNo;
  }

  getcityinmtr(res) {
    this.entity.capacityMts = res.capacity;
  }

  accountcreatemodel() {
    $('#exampleModal').modal('hide');
  }
}
