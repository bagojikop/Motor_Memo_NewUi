import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogsComponent } from '../../../../assets/pg/dialogs/dialogs.component';
import { MyProvider } from '../../../../assets/services/provider';
import { CommonModule, DatePipe, Location } from '@angular/common';
import { http, Master, NavbarActions } from '../../../../assets/services/services';
import { validation } from '../../../../assets/services/services';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { DssInputComponent } from '../../../../assets/mydirective/dss-input/dss-input.component';
import { MydirectiveModule } from '../../../../assets/mydirective/mydirective.module'; 
import { ngselectComponent } from '../../../../assets/pg/ngselect/ngselect.component';
import { NavactionsComponent } from '../../../../assets/pg/navactions/navactions.component';
 
declare var $: any;

interface RoleObj {
  roleId: number
  roleName: string
  comments: string
}
@Component({
  selector: 'app-roleinfochild',
  templateUrl: './roleinfochild.component.html',
  styleUrls: ['./roleinfochild.component.scss'],
  imports: [FormsModule, CommonModule, ngselectComponent, NgSelectModule, DssInputComponent, MydirectiveModule,NavactionsComponent],
  providers: [NavbarActions],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RoleinfochildComponent {
  entity: any;
  reference: any = {};
  stateparams: any;
  mode: 0;
  pastentity: any = {};
  rowIndex: number;
  loading: boolean = false;
  param: any;
  RoleInfoForm: any;

  isChecked: boolean = false;
  constructor(private http: http,
    private spinner: NgxSpinnerService,
    private navaction: NavbarActions,
    private provider: MyProvider,
    public valid: validation,
    private datepipe: DatePipe,
    private dialog: DialogsComponent,
    private location: Location,
    private router: Router,
    private Master: Master,
    public navactions: NavbarActions,) {

  }


  ngOnInit(): void {
    this.entity = <RoleObj>{}
    this.reference = {};
    let paramss: any = this.location.getState();
    this.navactions.navaction(paramss.action);
    this.entity.roleId = paramss.id;

    if (this.entity.roleId) {
      this.navactions.fieldset = true;
      this.callbackedit();
    } else {
      this.navactions.fieldset = false;
      this.newRecord();
    }

    if (paramss.id) {
      this.callbackEdit();
    };


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
        this.print();
        break;


      case 'close':
        this.close()
        break;



    }
  }


  edit() {
    this.navactions.navaction("view");
  }

  print() { }
  callbackedit() {

    var url = "RoleInfo/getroleinfo"

    this.http.get(url, { roleid: this.entity.roleId, }).subscribe({
      next: (res: any) => {
        if (res.status_cd == 1) {
          this.entity = res.data;
          this.pastentity = Object.assign({}, res.data);
          this.navaction.navaction('OK');
        }
      }, error: (err: any) => {
        this.spinner.hide();
        this.dialog.swal({ dialog: 'error', title: 'Error', message: err });
      }
    })
  }

  save() {
    this.spinner.show();
    if (!this.entity.roleId) {

      this.http.post('RoleInfo/insert', this.entity).subscribe({
        next: (res: any) => {
          if (res.status_cd == 1) {

            this.entity = res.data;
            this.dialog.swal({ dialog: "success", title: "Success", message: "Record is saved sucessfully" });
            this.navactions.navaction("OK");
          }

          this.spinner.hide()

        }, error: (err: any) => {
          this.spinner.hide()
          this.dialog.swal({ dialog: 'error', title: 'Error', message: err.message })
        }
      })
    }
    else {
      this.http.put('RoleInfo/update', this.entity, { roleid: this.entity.roleId }).subscribe({
        next: (res: any) => {

          if (res.status_cd == 1) {
            this.entity = res.data;
            this.dialog.swal({ dialog: "success", title: "Success", message: "Record is Update sucessfully" });
            this.navactions.navaction("OK");
          }

          this.spinner.hide()
        }, error: (err: any) => {
          this.dialog.swal({ dialog: 'error', title: 'Error', message: err })
        }
      })
    }
    this.navactions.navaction('new');

  }



  callbackEdit() {

  }
  states = [];

  newRecord() {
    this.entity = <RoleObj>{};
    this.reference = {};

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



}
