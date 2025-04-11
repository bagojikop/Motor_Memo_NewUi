import { CommonModule, DatePipe, Location } from '@angular/common';
import { http, Master, NavbarActions } from '../../../../assets/services/services';
import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { MyProvider } from '../../../../assets/services/provider';
import { DialogsComponent } from '../../../../assets/pg/dialogs/dialogs.component';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { SubconsigneeObj } from '../../../../assets/datatypests/sender-receiverchild'
import { NgSelectModule } from '@ng-select/ng-select';
import { DssInputComponent } from '../../../../assets/mydirective/dss-input/dss-input.component';
import { MydirectiveModule } from '../../../../assets/mydirective/mydirective.module';
import { MasternavComponent } from '../../../../assets/pg/masternav/masternav.component';
import { ngselectComponent } from '../../../../assets/pg/ngselect/ngselect.component';
import { NumberOnlyDirective } from '../../../../assets/mydirective/mydirective.directive';




@Component({
  selector: 'app-sender-receiver-child',
  templateUrl: './sender-receiver-child.component.html',
  styleUrls: ['./sender-receiver-child.component.scss'],
  imports: [FormsModule, CommonModule, NumberOnlyDirective, ngselectComponent, NgSelectModule, DssInputComponent, MydirectiveModule, MasternavComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SenderReceiverChildComponent {
  @ViewChild("vi") vi: NgForm;
  entity: SubconsigneeObj;
  sgCodeNavigation: string
  reference: any = {};
  acc: any = {};
  state: []
  status: boolean = false;
  ngview: boolean = false;
  stateParams: any;
  isSaved: boolean;
  mode: any;
  rowIndex: any;
  param;
  loading: boolean = false;
  placebuffer = [];
  viewing1: number = 1;
  viewing2: number = 2;
  pastentity;
  constructor(public location: Location,
    public http: http,
    private cd: ChangeDetectorRef,
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

  ngOnInit(): void {


    this.entity = <SubconsigneeObj>{};
    this.reference.places = [];
    this.reference.suppliers = [];

    let paramss: any = this.location.getState();
    this.navactions.navaction(paramss.action);
    this.entity.sCode = paramss.id;
    this.getstates();

    if (this.entity.sCode) {
      this.navactions.fieldset = true;
      this.callbackedit();
      // this.navactions.navaction("view");
    } else {
      this.navactions.fieldset = false;
      this.newRecord();
    }

  }


  apiParams() {
    var x = {
      PageNumber: 1,
      PageSize: 10,
      Keys: []
    }

    return x;
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



  callbackedit() {
    this.spinner.show();
    var url = "Vendor/edit"
    this.http.get(url, { id: this.entity.sCode }).subscribe({
      next: (res: any) => {
        if (res.status_cd == 1) {
          this.entity = res.data;
          this.entity.id = res.data.id;
          this.getState(this.entity);
          //  this.pastentity = Object.assign({}, this.entity);
          this.cd.detectChanges();
        }
        this.spinner.hide();

      }, error: (err: any) => {
        this.spinner.hide();
        this.dialog.swal({ dialog: 'error', title: 'Error', message: err });
      }
    })
  }
  save() {
    Object.keys(this.vi.form.controls).forEach(key => {
      const control = this.vi.form.controls[key];
      if (control.invalid) {
        console.log(`Invalid Field: ${key}`, control.errors);
      }
    });

    if (this.vi.valid) {
      this.spinner.show();
      if (!this.entity.id) {
        if (!this.entity.createdUser)
          this.entity.createdUser = this.provider.companyinfo.company.username;

        this.entity.createdUser = this.provider.companyinfo.company.username;

        this.http.post('Vendor/insert', this.entity).subscribe({
          next: (res: any) => {
            if (res.status_cd == 1) {

              this.entity.sCode = res.data.sCode;

              this.dialog.swal({ dialog: "success", title: "Success", message: "Record is saved sucessfully" });
              this.navactions.navaction("OK");
            }
            this.isSaved = true;
            this.spinner.hide()

          }, error: (err: any) => {
            this.spinner.hide()
            this.dialog.swal({ dialog: 'error', title: 'Error', message: err.message })
          }
        })
      }
      else {
        this.entity.modifiedUser = this.provider.companyinfo.company.username;
        this.http.put('Vendor/update', this.master.cleanObject(this.entity, 2), { id: this.entity.id }).subscribe({
          next: (res: any) => {
            this.spinner.hide()
            if (res.status_cd == 1) {
              this.entity.sCode = res.data.sCode;
              this.isSaved = true;
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

    } else {
      this.dialog.swal({ dialog: 'error', title: 'Error', message: "Please Fill All The Required Fields.." })
    }

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
  }
  edit() {

    if (this.isSaved) {

      this.callbackedit();
    }
  }

  undo() {
    this.entity = this.pastentity;
  }

  ongstFunction() {
    if (this.entity.gstinNo) {

      this.http.get('Account/getvender', { no: this.entity.gstinNo }).subscribe({
        next: (res: any) => {
          if (res.status_cd == 1) {
            // this.entity = res.data;
            // this.entity.gstinNo = res.data.accGstn;
            this.entity.name = res.data.accName;
            this.entity.accCodeNavigation = res.data;
            this.entity.emailId = res.data.emailId;
            this.entity.mobileNo = res.data.contactMobileNo;
            this.entity.address = res.data.accAddress;
            this.entity.accCodeNavigation.place = res.data.place;
            this.entity.stateCodeNavigation = res.data.place.stateCodeNavigation;
            this.entity.pincode = res.data.panNo;

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
  }


  getState(event){
    this.entity.state = event.stateCode;
  }

  getstates(){
    this.loading = true;
    this.http.get('state/list').subscribe({
      next: (res: any) => {
        if (res.status_cd == 1) {
          this.state = res.data;
          this.entity.stateCode = res.data[0].firmCode
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
  }
}
