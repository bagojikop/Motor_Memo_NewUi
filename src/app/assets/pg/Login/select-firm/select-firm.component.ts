import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogsComponent } from '../../../../assets/pg/dialogs/dialogs.component';
import { MyProvider } from '../../../../assets/services/provider';
import { CommonModule, DatePipe, Location } from '@angular/common';
import { http, Master, NavbarActions } from '../../../../assets/services/services';
import { FormsModule } from '@angular/forms';
import { ArraySortPipe } from '../../../pipes/inrcrdr.pipe';
import { DssInputComponent } from '../../../mydirective/dss-input/dss-input.component';
import { NgSelectModule } from '@ng-select/ng-select';



@Component({
  selector: 'app-select-firm',
  templateUrl: './select-firm.component.html',
  styleUrls: ['./select-firm.component.scss'],
  imports: [FormsModule, CommonModule,  NgSelectModule],
  providers: [DialogsComponent,Master, ArraySortPipe, DatePipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class SelectFirmComponent {
  entity: any;
  reference: any = {};
  branchFirm: any;
  yearFirm: any;

  loading: boolean = false;
  Firms = [];
  Branches = [];
  FinYears = [];
  constructor(private http: http,
    private spinner: NgxSpinnerService,
    private navaction: NavbarActions,
    private provider: MyProvider,

    private dialog: DialogsComponent,
    private location: Location,
    private router: Router,
    private Master: Master,
    private datepipe: DatePipe,
    public navactions: NavbarActions,) {

  }



  ngOnInit(): void {
    this.entity = {};
    this.reference = {};
    this.Firms = [];
    this.FinYears = [];

    this.Init()
  }

  async Init() {
    return new Promise<void>((resolve, reject) => {
      this.loading = true;
      this.http.get('Firm/list').subscribe({
        next: (res: any) => {
          if (res.status_cd == 1) {
            this.Firms = res.data;
            this.entity.firmCode = res.data[0].firmCode;
            this.entity.firm = res.data[0];
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


  firm(index) {

    this.entity.firm = index.firm;
    var param = {
      firmCode: index.firmCode
    }
    return new Promise<void>((resolve, reject) => {
      this.loading = true;
      this.http.get('Firm/list').subscribe({
        next: (res: any) => {
          if (res.status_cd == 1) {
            this.Firms = res.data;
            this.entity.firmCode = res.data[0].firmCode;
            this.entity.firm = res.data[0];
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


  branch(index) {
    {
      var param = {
        firmCode: index.firmCode
      }
      this.loading = true;
      this.http.get('FinYears/lists', param).subscribe({
        next: (res: any) => {
          if (res.status_cd === 1) {

            this.FinYears = res.data.sort((a: any, b: any) => {
              return b.divId - a.divId;
            });

            if (this.FinYears.length > 0) {
              // this.entity.divId = this.FinYears[0].divId;
            }
            this.loading = false;
          } else {
            this.loading = false;
            this.dialog.swal({ dialog: 'error', title: 'Error', message: res.errors.exception.Message });
          }
          this.spinner.hide();
        },
        error: (err: any) => {
          this.spinner.hide();
          this.dialog.swal({ dialog: 'error', title: 'Error', message: err.message });
        }
      });


    }
  }


  onClear(field: string): void {
    this.loading = false; // Ensure loader is turned off
    switch (field) {
      case 'firm':
        this.entity.firmCode = null;
        this.entity.firm = null;
        this.FinYears = []; // Clear related Financial Year data
        this.entity.divId = null;
        break;

      case 'year':
        this.entity.divId = null;
        break;

      default:
        break;
    }
  }


  Submit() {
    this.provider.companyinfo.company = this.entity;

    var years = this.entity.divId.match(/.{1,4}/g);

    this.provider.companyinfo.finyear = {
      fdt: years[0] + '-04-01',
      tdt: years[1] + '-03-31'
    }
    this.provider.companyinfo.company.userinfo = {}
    this.entity.username = "Gaurav"
    this.provider.companyinfo.company.userinfo.username = this.entity.username;
    this.router.navigate(['home']);
  }

}