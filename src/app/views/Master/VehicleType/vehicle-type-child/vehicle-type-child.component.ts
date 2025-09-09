 import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { DatePipe, Location } from '@angular/common';
import { http, Master, NavbarActions } from '../../../../assets/services/services';
import { Component, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { MyProvider } from '../../../../assets/services/provider';
import { DialogsComponent } from '../../../../assets/pg/dialogs/dialogs.component';
 import { FormsModule, NgForm } from '@angular/forms'; 
import { HttpClient } from '@angular/common/http';
import {mst107} from '../../../../assets/datatypests/vehicletype'
import { NgSelectModule } from '@ng-select/ng-select';
import { DssInputComponent } from '../../../../assets/mydirective/dss-input/dss-input.component';
import { MydirectiveModule } from '../../../../assets/mydirective/mydirective.module';
import { MasternavComponent } from '../../../../assets/pg/masternav/masternav.component';
import { ngselectComponent } from '../../../../assets/pg/ngselect/ngselect.component';
 import { NumberOnlyDirective } from '../../../../assets/mydirective/mydirective.directive';
 

@Component({
  selector: 'app-vehicle-type-child',
  templateUrl: './vehicle-type-child.component.html',
  styleUrls: ['./vehicle-type-child.component.scss'],
    imports:[FormsModule,CommonModule,NumberOnlyDirective,NgSelectModule, DssInputComponent, MydirectiveModule, MasternavComponent],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  providers:[ngselectComponent]
})
export class VehicleTypeChildComponent {
  @ViewChild("vi") vi: NgForm;
  entity: mst107;
  sgCodeNavigation: string
  reference: any = {};
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
    this.entity = <mst107>{};
    this.stateParams = this.location.getState();
    this.mode = this.stateParams.action;
  }

  ngOnInit(): void {

    this.entity = <mst107>{};
    let paramss: any = this.location.getState();
    this.navactions.navaction(paramss.action);

    if (this.stateParams.Id) {
      this.callbackedit()
    }
   
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
    var url = "VehicleType/ById"
    this.http.get(url, { id: this.stateParams.Id }).subscribe({
      next: (res: any) => {
        if (res.status_cd == 1) {
          this.entity = res.data;

          this.entity.createdDt = this.entity.createdDt ?? this.datepipe.transform(this.entity.createdDt, 'yyyy-MM-dd')  
          this.entity.modifiedDt = this.entity.modifiedDt ?? this.datepipe.transform(this.entity.modifiedDt, 'yyyy-MM-dd') 


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
    this.spinner.show();
 
    if (!this.entity.vtypeId) {


      if (!this.entity.createdUser)

        this.entity.createdUser = this.provider.companyinfo.userinfo.username;
      this.http.post('VehicleType/insert',this.entity).subscribe({
        next: (res: any) => {
          this.spinner.hide();
          if (res.status_cd == 1) {

            this.entity.vtypeId = res.data.vtypeId;
          
            this.pastentity = Object.assign({}, this.entity);
            this.dialog.swal({ dialog: "success", title: "Success", message: "Record is saved sucessfully" });
            this.navactions.navaction("OK");
          }
          else {
            this.dialog.swal({ dialog: 'error', title: 'Error', message: res.errors.exception.message })
          }
          this.spinner.hide();
        }, error: (err: any) => {
          this.spinner.hide();
          this.dialog.swal({ dialog: 'error', title: 'Error', message: err.message })
        }
      })

    }

    else {

      this.entity.modifiedUser = this.provider.companyinfo.userinfo.username;
      this.http.put('VehicleType/update', this.master.cleanObject(this.entity, 2), { id: this.entity.vtypeId }).subscribe({
        next: (res: any) => {
          this.spinner.hide()
          if (res.status_cd == 1) {
            this.entity.vtypeId = res.data.vtypeId;

            this.pastentity = Object.assign({}, this.entity);
            this.dialog.swal({ dialog: "success", title: "Success", message: "Record is Update sucessfully" });
            this.navactions.navaction("OK");
          }
          else {
            this.dialog.swal({ dialog: 'error', title: 'Error', message: res.errors.exception.InnerException.message })
          }

          this.spinner.hide()
        }, error: (err: any) => {
          this.spinner.hide()
          this.dialog.swal({ dialog: 'error', title: 'Error', message: err.message })
        }
      })
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
       this.entity = <mst107>{};
  }
  edit() {
    this.navactions.navaction("view");
    this.callbackedit();

  }

  undo() {
    this.entity = this.pastentity;
  }


}
