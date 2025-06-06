import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogsComponent } from '../../../../assets/pg/dialogs/dialogs.component';
import { MyProvider } from '../../../../assets/services/provider';
import { CommonModule, DatePipe, Location } from '@angular/common';
import { http, Master, NavbarActions } from '../../../../assets/services/services';
import { validation } from '../../../../assets/services/services';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { FirmObj, mst00403sObj, mst00409, mst00401 } from '../../../../assets/datatypests/firm-child';
import { NgSelectModule } from '@ng-select/ng-select';
import { DssInputComponent } from '../../../../assets/mydirective/dss-input/dss-input.component';
import { MydirectiveModule } from '../../../../assets/mydirective/mydirective.module';
import { MasternavComponent } from '../../../../assets/pg/masternav/masternav.component';
import { ngselectComponent } from '../../../../assets/pg/ngselect/ngselect.component';
import { UppercaseDirective, NumberOnlyDirective } from '../../../../assets/mydirective/mydirective.directive';


declare var $: any;

@Component({
  selector: 'app-firm-child',
  templateUrl: './firm-child.component.html',
  styleUrls: ['./firm-child.component.scss'],
  imports: [FormsModule, CommonModule,NumberOnlyDirective,UppercaseDirective, ngselectComponent, NgSelectModule, DssInputComponent, MydirectiveModule, MasternavComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FirmChildComponent {
  @ViewChild('FirmInfo') FirmInfo: NgForm;
  entity: any;
  reference: any = {};
  RegTypes = [];
  stateparams: any;


  mode: 0;
  pastentity: any = {};
  rowIndex: number;
  loading: boolean = false;
  param: any;
  isactive: boolean;
  disabledata: boolean = false;
  constructor(private http: http,
    private spinner: NgxSpinnerService,
    private navaction: NavbarActions,
    private provider: MyProvider,
    public valid: validation,
    private dialog: DialogsComponent,
    private location: Location,
    public navactions: NavbarActions,) { }
  ngOnInit(): void {
    this.entity = <FirmObj>{};
    this.entity.mst00401 = <mst00401>{};
    this.entity.mst00409 = <mst00409>{};
    this.entity.mst00403s = <mst00403sObj[]>[];
    this.reference = {};
    this.states = [];
    this.entity.active = 1;
    this.isactive = true;
    let paramss: any = this.location.getState();
    this.navactions.navaction(paramss.action);
    this.entity.firmCode = paramss.id;

    if (this.entity.firmCode) {
      this.navactions.fieldset = true;
      this.callbackedit();
    } else {
      this.navactions.fieldset = false;
      this.newRecord();
    }

    if (paramss.id) {
      this.callbackEdit();
    };

    this.Init();
  }
  Init() {
    this.loading = true;
    this.http.get('state/list').subscribe({
      next: (res: any) => {
        if (res.status_cd == 1) {
          this.states = res.data;
          this.loading = false;
        } else {
          this.loading = false;
          this.dialog.swal({ dialog: 'error', title: 'Error', message: res.errors.exception.Message });
        }


        this.spinner.hide();
      }, error: (err: any) => {
        this.spinner.hide();
        this.dialog.swal({ dialog: 'error', title: 'Error', message: err.message });
      }
    })


    this.spinner.show();
    this.http.jsonget('assets/json/GSTURLIST.json').subscribe({
      next: res => {
        this.RegTypes = res;
        this.spinner.hide();
      }, error: err => {
        this.spinner.hide();
        alert(err);
      }
    })
  }
  navbar(event) {

    switch (event) {
      case 'new':
        this.newRecord();
        break;

      case 'save':
        this.save()
        break;

      case 'edit':
        this.edit()
        break;

      case 'undo':
        this.undo()
        break;

      case 'print':
        break;


      case 'close':
        this.close()
        break;



    }
  }

  isInvalidPan: boolean = false;
  isInvalidWebsite: boolean = false;
  isInvalidEmail: boolean = false;
  exampleEmail: string = 'user@example.com';
  validatePan(pan: string): void {
    const panPattern = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    this.isInvalidPan = pan ? !panPattern.test(pan) : false;
  }

  validateNumber(event: KeyboardEvent): void {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault(); // Block non-numeric input
    }
  }
  validateRange(): void {
    const value = Number(this.entity.firmPinCode);
    // Ensure it's a valid 6-digit PIN code
    if (value < 100000 || value > 999999) {
      this.entity.firmPinCode = ''; // Clear input if not valid
    }
  }
  validateEmail(email: string): void {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    this.isInvalidEmail = email ? !emailPattern.test(email) : false;
  }

  edit() {
    this.navactions.navaction("view");
  }

  callbackedit() {
    this.spinner.show();
    var url = "Firm/FirmEdit"
    this.http.get(url, { id: this.entity.firmCode }).subscribe({
      next: (res: any) => {
        if (res.status_cd == 1) {
          this.entity = res.data;
          this.disabledata = true;

          this.isactive = this.entity.active == 0 ? false : true;

          if (!this.entity.mst00401) {
            this.entity.mst00401 = <mst00401>{};
          } else {
            this.imageSrc = this.entity.mst00401.logo;
          }
          if (!this.entity.mst00409)
            this.entity.mst00409 = <mst00409>{};

          this.pastentity = Object.assign({}, res.data);
          this.navaction.navaction('OK');
        }
      }, error: (err: any) => {
        this.spinner.hide();
        this.dialog.swal({ dialog: 'error', title: 'Error', message: err });
      }
    })
  }

  checkme(event) {
    this.entity.active = event ? 1 : 0;
  }
  updateModel(index) {
    this.entity.firmStateCode = index.value;

  }
  save() {

    this.entity.createdUser = this.provider.companyinfo.userinfo.username;

    this.spinner.show();


    if (this.entity.firmCode) {

      this.http.put('Firm/update', this.entity, { firm_code: this.entity.firmCode }).subscribe({
        next: (res: any) => {
          if (res.status_cd == 1) {

            this.entity = res.data;
            this.disabledata = true;

            this.pastentity = Object.assign({}, res.data);
            this.dialog.swal({ dialog: "success", title: "Success", message: "Record is saved sucessfully" });
            this.navaction.navaction("OK");
          }

          this.spinner.hide()

        }, error: (err: any) => {
          this.spinner.hide()
          this.dialog.swal({ dialog: 'error', title: 'Error', message: err.message })
        }
      })

    }
   
  }


  callbackEdit() {

  }
  states = [];

  newRecord() {
    this.entity = <FirmObj>{};
    this.entity.mst00401 = <mst00401>{};
    this.entity.mst00409 = <mst00409>{};
    this.entity.mst00403s = <mst00403sObj[]>[];
    this.reference = {};
    this.entity.active = 1;
    this.isactive = true;
    this.disabledata = false;
    //  this.entity.Stateinfo = {}; -----------------------forhelper
    this.cancellogo();

  }

  mainedit() {
    this.navactions.navaction("view");
    this.navactions.save1 = false;
    this.navactions.print1 = true;
    this.navactions.fieldset = false;



  }
  undo() {
    this.entity = this.pastentity;
  }
  close() {
    this.location.back();
  }

  addTbrow() {
    if (this.rowIndex == null) {
      this.reference.branchCode = this.entity.branchCode;
      this.entity.mst00403s.push(this.reference);
    }
    else {
      this.entity.mst00403s[this.rowIndex] = this.reference;
    }
    this.reference = {};
    //@ts-ignore
    this.rowIndex = null;

  }

  editTbrow(obj, index) {
    this.rowIndex = index;
    this.reference = Object.assign({}, obj);
  }

  deleteTbrow(index) {
    var params = {

      dialog: 'confirm',
      title: "warning",
      message: "Do you want to delete record"
    }
    this.dialog.swal(params).then(data => {
      if (data == true) {
        this.entity.mst00403s.splice(index, 1);
      }
    })
  }

  uploadImage() {
    $("#myinput").val('');
    //@ts-ignore
    document.getElementById("myinput").click();

  }
  imageSrc: string = '';

  handleInputChange(e) {

    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    var pattern = /image-*/;
    var reader = new FileReader();
    if (!file.type.match(pattern)) {
      alert('invalid format');
      return;
    }
    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }


  _handleReaderLoaded(e) {
    let reader = e.target;
    this.imageSrc = reader.result;
    this.entity.mst00401.logo = reader.result;
    this.entity.mst00401.firmCode = this.entity.firmCode;
    console.log(this.imageSrc)
    $("#Logo").modal('show');

  }
  closelogo() {

    $("#Logo").modal('hide');
  }


  savelogo() {
    $("#Logo").modal('hide');
  }
  openmodel() {
    if (this.navactions.fieldset == false)
      $("#Logo").modal('show');

  }


  cancellogo() {
    $("#myinput").val('');
    this.imageSrc = "";
    this.entity.mst00401.logo = '';
  }

  defaultLegalnm() {
    if (this.entity.firmLegalName == "") {

      this.entity.firmLegalName = this.entity.firmName;

    }


  }
  setLegalnm() {

    this.entity.firmLegalName = '';

  }

}

