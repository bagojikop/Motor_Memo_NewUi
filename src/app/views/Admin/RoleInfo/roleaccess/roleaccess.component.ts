import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogsComponent } from '../../../../assets/pg/dialogs/dialogs.component';
import { MyProvider } from '../../../../assets/services/provider';
import { CommonModule, DatePipe, Location } from '@angular/common';
import { http, Master, NavbarActions } from '../../../../assets/services/services';
import { validation } from '../../../../assets/services/services';
import { FormsModule } from '@angular/forms';
import { ArraySortPipe } from '../../../../assets/pipes/inrcrdr.pipe';

declare var $: any;
interface roleAccessObj {

  a: number
  e: number
  d: number
  l: number
  p: number
  b: number
  o: number
  r: number

  roleInfo: roleInfo
}

interface roleInfo {
  roleId: number
  roleName: string

}
@Component({
  selector: 'app-roleaccess',
  templateUrl: './roleaccess.component.html',
  styleUrls: ['./roleaccess.component.scss'],
  imports: [FormsModule, CommonModule],
  providers: [DialogsComponent, validation, DatePipe, Master, ArraySortPipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RoleaccessComponent {
  entity: any;
  reference: any = {};
  stateparams: any;
  mode: 0;
  pastentity: any = {};
  rowIndex: number;
  loading: boolean = false;
  param: any;
  roleAccessForm: any;
  list = [];

  isChecked: boolean = false;
  roleInfo: roleInfo[];
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
    this.list = []

    this.Init();

  }
  ngAfterViewInit(): void {

  }
  Init() {

    this.spinner.show();
    this.http.get('UserRoleAuth/list').subscribe({
      next: (res: any) => {

        this.list = res.data;

        this.spinner.hide();


      }, error: (err: any) => {

        this.spinner.hide();
        this.dialog.swal({ dialog: 'error', title: 'Error', message: err });
      }
    })

  }




  save() {

    this.spinner.show();
    this.http.post('UserRoleAuth/insert', this.list).subscribe({
      next: (res: any) => {
        if (res.status_cd == 1) {


          this.dialog.swal({ dialog: "success", title: "Success", message: "Record is saved sucessfully" });
        }
        this.spinner.hide()

      }, error: (err: any) => {
        this.spinner.hide()
        this.dialog.swal({ dialog: 'error', title: 'Error', message: err })
      }
    })
  }


  close() {
    this.location.back();
  }
}

