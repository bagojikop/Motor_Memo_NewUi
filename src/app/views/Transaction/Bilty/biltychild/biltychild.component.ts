import { CommonModule, DatePipe, Location } from '@angular/common';
import { http, Master, NavbarActions } from '../../../../assets/services/services';
import { Component, ViewChild, inject, ChangeDetectorRef, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { MyProvider } from '../../../../assets/services/provider';
import { DialogsComponent } from '../../../../assets/pg/dialogs/dialogs.component';
import { ReportDictionory } from '../../../../../../assets/service/interfaces';
import { v4 as uuidv4 } from 'uuid'
import { FormsModule, NgForm } from '@angular/forms';
declare var $: any;
import "../../../../../app/assets/services/datePrototype";
import { NgSelectModule } from '@ng-select/ng-select';
import { DssInputComponent } from '../../../../assets/mydirective/dss-input/dss-input.component';
import { MydirectiveModule } from '../../../../assets/mydirective/mydirective.module';
import { ngselectComponent } from '../../../../assets/pg/ngselect/ngselect.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { NavactionsComponent } from '../../../../assets/pg/navactions/navactions.component';
import { CurrencyMaskDirective } from '../../../../assets/mydirective/currencyMask/currency-mask.directive';
import { NumberOnlyDirective, DTFormatDirective } from '../../../../assets/mydirective/mydirective.directive';
import { finDateDirective } from '../../../../assets/mydirective/findate/findate.directive';
import { ArraySortPipe } from '../../../../assets/pipes/inrcrdr.pipe';
import { PdfReaderComponent } from '../../../../assets/pdf-reader/pdf-reader.component';

@Component({
  selector: 'app-biltychild',
  templateUrl: './biltychild.component.html',
  styleUrl: './biltychild.component.scss',
  imports: [FormsModule, CommonModule, DTFormatDirective, finDateDirective, NumberOnlyDirective, PdfReaderComponent, CurrencyMaskDirective, ngselectComponent, NgSelectModule, DssInputComponent, MydirectiveModule, NgxPaginationModule, NavactionsComponent],
  providers: [DatePipe, DialogsComponent, PdfReaderComponent, Master, ArraySortPipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BiltychildComponent {
  @ViewChild("biltychild") biltychild: NgForm;
  entity: any = {};

  page: number = 1;
  pageSize: number = 2;
  totalItems: number = 0;
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
  selectedVehicle: string = '';
  Orderlist: any;
  bilty:any={}
  canEdit: boolean = false;

  isReceiverClicked: boolean = true;

  isSenderClicked: boolean = true;
  SenderisClicked: boolean = true
  ReceiverisClicked: boolean = true
  parameters: any[] = [];
  rptMode: boolean = false;
  pdfSrc: string;
  myServiceUrl: string;
  myReportDictionory: ReportDictionory = <ReportDictionory>{};

  private cd = inject(ChangeDetectorRef);

  constructor(
    public location: Location,
    public http: http,
    private datepipe: DatePipe,
    private dialog: DialogsComponent,
    private spinner: NgxSpinnerService,
    public provider: MyProvider,
    public navactions: NavbarActions,
    public master: Master
  ) {
    this.entity = {};
    this.entity.biltyAudit = {}
    this.entity.biltyDetails = {}
    this.entity.biltyCommodities = {}
    this.entity.biltyGstDetails = {}
    this.stateParams = this.location.getState();
    this.mode = this.stateParams.action;
    this.entity.vchId = this.stateParams.id;
  }
 
  cmod: any = {};
  gst: any = {}
  exp: any = {};
  other: any = {};

  freightTypeList: any = [];
  ngOnInit(): void {

    setInterval(() => {
      this.windowrespo();
    }, 1000)

    this.entity = {};
    this.gst = {}
    this.entity.biltyAudit = {};
    this.entity.biltyDetails = {};
    this.entity.biltyGstDetails = {}
    this.entity.biltyCommodities = []
    this.entity.totalcharges = 0;

    this.exp = { action: 0 };


    this.freightTypeList = [
      {
        "id": 0,
        "name": "Paid"
      },
      {
        "id": 1,
        "name": "To Pay"
      },
      {
        "id": 2,
        "name": "To Way Build"
      }
    ]


    let paramss: any = this.location.getState();
    this.navactions.navaction(paramss.action);
    this.entity.vchId = paramss.id;


    this.reference = []
    if (this.entity.vchId) {
      this.navactions.fieldset = true;
      this.callbackedit();
    } else {
      this.navactions.fieldset = false;
      this.newRecord();
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
        this.biltyprint();
        this.ngview = true;
        break;

      case 'close':
        this.close();
        break;
    }

  }

  gstdefault() {
    this.entity.biltyGstDetails.igst = this.entity.biltyGstDetails.cgst = this.entity.biltyGstDetails.sgst = this.entity.biltyGstDetails.cess = 0;
  }

  
    
      biltyprint() {
        this.myServiceUrl = "BiltyReport";
        
        this.myReportDictionory = {
          reportCacheId: uuidv4(),
          reportParams: [
            {
              key: "vch_id", value: this.entity.vchId,
            },
            {
              key: "firm_id", value: this.provider.companyinfo.company?.firmCode,
    
            }]
        };
        this.rptMode = true;
      }
  

  igstAmont: number = 0
  gstamt() {
    if (Number(this.entity.biltyGstDetails.igst)) {
      this.entity.biltyGstDetails.igstAmt = (this.entity.TotalFreight * Number(this.entity.biltyGstDetails.igst)) / 100
      this.entity.biltyGstDetails.totalAmt=this.entity.TotalFreight+this.entity.biltyGstDetails.igstAmt;
    }
    else if (Number(this.entity.biltyGstDetails.cgst)) {
      this.entity.biltyGstDetails.cgstAmt = (this.entity.TotalFreight * Number(this.entity.biltyGstDetails.cgst)) / 100
      this.entity.biltyGstDetails.totalAmt=this.entity.TotalFreight+this.entity.biltyGstDetails.cgstAmt;
    }
    else if (Number(this.entity.biltyGstDetails.sgst)) {
      this.entity.biltyGstDetails.sgstAmt = (this.entity.TotalFreight * Number(this.entity.biltyGstDetails.sgst)) / 100
      this.entity.biltyGstDetails.totalAmt=this.entity.TotalFreight+this.entity.biltyGstDetails.sgstAmt;
    }
    else {
      this.entity.biltyGstDetails.cessAmt = (this.entity.TotalFreight * Number(this.entity.biltyGstDetails.cess)) / 100
      this.entity.biltyGstDetails.totalAmt=this.entity.TotalFreight+this.entity.biltyGstDetails.cessAmt;
    }
  }

 




  edit() {
    this.navactions.navaction("view");

    this.callbackedit();
  }

  save() {
    Object.keys(this.biltychild.form.controls).forEach(key => {
      const control = this.biltychild.form.controls[key];
      if (control.invalid) {
        console.log(`Invalid Field: ${key}`, control.errors);
      }
    });

    if (this.biltychild.valid) {
      this.spinner.show();
      if (!this.entity.vchId) {
        if (!this.entity.biltyAudit.createdUser)
          this.entity.biltyAudit.createdUser = this.provider.companyinfo.userinfo.username;


        this.entity.firmId = this.provider.companyinfo.company?.firm.firmCode,
          this.entity.divId = this.provider.companyinfo.company.divId;
        this.bilty=this.entity;
        this.http.post('Bilty/insert', this.bilty, 2).subscribe({
          next: (res: any) => {
            if (res.status_cd == 1) {

              this.entity.vchId = res.data.vchId;

              if (!this.entity.biltyAudit) {
                this.entity.biltyAudit = {};
              }
              if (!this.entity.biltyDetails) {
                this.entity.biltyDetails = {};
              }

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
        this.entity.firmId = this.provider.companyinfo.company?.firm.firmCode,
          this.entity.divId = this.provider.companyinfo.company.divId;
        this.entity.biltyAudit.modifiedUser = this.provider.companyinfo.userinfo.username;
        this.http.put('Bilty/update', this.master.cleanObject(this.entity, 2), { id: this.entity.vchId }).subscribe({
          next: (res: any) => {
            this.spinner.hide()
            if (res.status_cd == 1) {
              this.entity.vchId = res.data.vchId;
              if (!this.entity.biltyAudit) {
                this.entity.biltyAudit = {};
              }
              if (!this.entity.biltyDetails) {
                this.entity.biltyDetails = {};
              }
               if (!this.entity.biltyGstDetails) {
                this.entity.biltyGstDetails = {};
              }

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
  undo() {
    this.entity = this.pastentity;

    this.callbackedit();
  }
  
  close() {
    this.location.back();
  }
  callbackedit() {
    this.spinner.show();
    var url = "Bilty/edit"
    this.http.get(url, { id: this.entity.vchId }).subscribe({
      next: (res: any) => {
        if (res.status_cd == 1) {
          this.entity = res.data;

          this.entity.biltyAudit = this.entity.biltyAudit || {};
          this.entity.biltyGstDetails = this.entity.biltyGstDetails || {};
          this.entity.biltyDetails = this.entity.biltyDetails || {};

          this.entity.biltyAudit.createdDt = this.entity.biltyAudit.createdDt ?? this.datepipe.transform(this.entity.biltyAudit.createdDt, 'yyyy-MM-dd')
          this.entity.biltyAudit.modifiedDt = this.entity.biltyAudit.modifiedDt ?? this.datepipe.transform(this.entity.biltyAudit.modifiedDt, 'yyyy-MM-dd');

     

          this.pastentity = Object.assign({}, this.entity);

        
        }
        this.spinner.hide();
        this.additinOfFreight();
       

        this.totalDebit();
        this.isReceiverClicked = false;
        this.isSenderClicked = false;
        this.SenderisClicked = false
        this.ReceiverisClicked = false
      }, error: (err: any) => {
        this.spinner.hide();
        this.dialog.swal({ dialog: 'error', title: 'Error', message: err });
      }
    })
   }
  newRecord() {
    this.pastentity = JSON.parse(JSON.stringify(this.entity))

    this.entity = {};
    this.entity.biltyAudit = {};
    this.entity.biltyDetails = {};
    this.entity.biltyCommodities = []
    this.entity.biltyGstDetails = {}
    this.entity.biltyNo = 0;
    this.entity.freightType = 0;
    this.entity.totalcharges = 0;
    const today = new Date();
    const finYearEnd = new Date(this.provider.companyinfo.finyear.tdt);

   
    if (today >= finYearEnd) {
      this.entity.vchDate = finYearEnd.toISOString().split('T')[0];
    } else {
      this.entity.vchDate = today.toISOString().split('T')[0];
    }
    
    this.gstdefault();
  }

  getVehicles() {
    if (!this.entity.vehicleNo || this.entity.vehicleNo.length < 4) {
      return;
    }
    $('#exampleModal').modal('show');
    var param = {
      PageNumber: 1,
      PageSize: 10,
      Keys: [{ key: 'vehicleNo', value: this.entity.vehicleNo || 0 }]
    }
    this.http.post('Vehicle/vehiclelist', param).subscribe({
      next: (res: any) => {
        if (res.status_cd == 1) {
          this.reference = res.data;

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
  windowrespo() {
    if (window.innerWidth <= 767) {
      this.status = true;
    } else {
      this.status = false;
    }
  }

  onPageChange(newPage?: number): void {
    if (newPage !== this.page) {
      //@ts-ignore
      this.page = newPage;
      this.commanfunction();
    }
  }

  onserchvender() {
    var param = {
      PageNumber: this.page || 1,
      PageSize: this.pageSize,
      Keys: [{
        key: 'name', value: this.onserchinput
      }]
    };

    this.reference = [];

    this.http.post('Vendor/getList', param).subscribe({
      next: (res: any) => {
        if (res.status_cd === 1) {
          this.reference = res.data;
          this.filteredSenders = this.reference
          if (res.pageDetails) {
            this.totalItems = res.pageDetails.totalItems;
            this.totalCount = res.pageDetails.totalCount;
          }
        } else {
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

  receivclick(v) {
    this.entity.biltyDetails.receiverName = v.name;
    this.entity.biltyDetails.receiverMobileNo = v.mobileNo
    this.entity.biltyDetails.receiverGstin = v.gstinNo
    this.entity.biltyDetails.receiverAddress = v.address
    this.entity.biltyDetails.receiverPin = v.pincode
    this.entity.receiverStateId = v.state
    this.entity.biltyDetails.receiverMail = v.emailId
    this.entity.receiveraccout = v?.accCodeNavigation

    this.isReceiverClicked = false;
    this.ReceiverisClicked = false
    $('#Modal').modal('hide');
  }

  Senderclick(v) {
    this.entity.biltyDetails.senderName = v.name
    this.entity.biltyDetails.senderGstin = v.gstinNo
    this.entity.biltyDetails.senderMobileNo = v.mobileNo
    this.entity.biltyDetails.senderAddress = v.address
    this.entity.biltyDetails.senderMail = v.emailId
    this.entity.senderStateId = v.state
    this.entity.biltyDetails.senderPin = v.pincode
    this.entity.senderaccount = v?.accCodeNavigation


    this.isSenderClicked = false;
    this.SenderisClicked = false
    $('#SenderModal').modal('hide');
  };

  SenderSavefun() {
    this.dialog.swal({
      dialog: 'confirm',
      title: 'Confirm Save',
      message: 'Do you want to save this record?',
    }).then((result: any) => {
      if (result) {
        const venderData = {
          name: this.entity.biltyDetails.senderName,
          gstinNo: this.entity.biltyDetails.senderGstin,
          mobileNo: this.entity.biltyDetails.senderMobileNo,
          address: this.entity.biltyDetails.senderAddress1,
          pincode: this.entity.biltyDetails.senderPin,
          StateCode: this.entity.biltyDetails.senderStateId,
          emailId: this.entity.biltyDetails.senderMail,
          accCode: null,
          createdUser: this.provider.companyinfo.userinfo.username,
          createdDt: new Date().toISOString(),
        };

        this.http.post('Vendor/insert', venderData).subscribe({
          next: (res: any) => {
            if (res.status_cd == 1) {
              this.dialog.swal({ dialog: "success", title: "Success", message: "Record is saved successfully" });
              this.SenderisClicked = false
            }
          },
          error: (err: any) => {
            this.spinner.hide();
            this.dialog.swal({ dialog: 'error', title: 'Error', message: err.message });
          }
        });
      }
    });
  }
  sendergstinfun() {
    this.http.get('Vendor/GstinbyInfo', {
      gstin: this.entity.biltyDetails.senderGstin || "",
      mobileno: this.entity.biltyDetails.senderMobileNo || "",
    }).subscribe({
      next: (res: any) => {
        if (res.status_cd == 1) {

          if (res.data) {
            this.SenderisClicked = false
            this.isSenderClicked = false;
            this.entity.biltyDetails.senderGstin = res.data.gstinNo ||= {};
            this.entity.biltyDetails.senderMobileNo = res.data.mobileNo
            this.entity.biltyDetails.senderName = res.data.name
            this.entity.biltyDetails.senderAddress1 = res.data.address
            this.entity.biltyDetails.senderPin = res.data.pincode
            this.entity.senderStateId = res.data.state ||= {};
            this.entity.biltyDetails.senderMail = res.data.emailId;
            this.entity.senderaccount = res.data?.accCodeNavigation
          } else {

            this.SenderisClicked = true
            this.isSenderClicked = true;


          }
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
  Senderfuncion() {
    $('#SenderModal').modal('show');
    this.commanfunction();
  }

  onserchinput: string
  filteredSenders = [];
  totalCount: number = 0;

  commanfunction() {
    var param = {
      PageNumber: this.page || 1,
      PageSize: this.pageSize,
      Keys: []
    };

    this.reference = [];

    this.http.post('Vendor/getList', param).subscribe({
      next: (res: any) => {
        if (res.status_cd === 1) {
          this.reference = res.data;
          this.filteredSenders = this.reference
          if (res.pageDetails) {
            this.totalItems = res.pageDetails.totalItems;
            this.totalCount = res.pageDetails.totalCount;
          }
        } else {
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
  ReceiverSavefun() {

    this.dialog.swal({
      dialog: 'confirm',
      title: 'Confirm Save',
      message: 'Do you want to save this record?',
    }).then((result: any) => {

      if (result) {
        const venderData = {
          name: this.entity.biltyDetails.receiverName,
          gstinNo: this.entity.biltyDetails.receiverGstin,
          mobileNo: this.entity.biltyDetails.receiverMobileNo,
          address: this.entity.biltyDetails.receiverAddress,
          pincode: this.entity.biltyDetails.receiverPin,
          stateCode: this.entity.biltyDetails.receiverStateId,
          emailId: this.entity.biltyDetails.receiverMail,
          ewayNo: this.entity.biltyDetails.ewayNo,
          createdUser: this.provider.companyinfo.userinfo.username,
          createdDt: new Date().toISOString(),
        };

        this.http.post('Vendor/insert', venderData).subscribe({
          next: (res: any) => {
            if (res.status_cd == 1) {

              this.dialog.swal({ dialog: "success", title: "Success", message: "Record is saved successfully" });
              this.ReceiverisClicked = false
            }
            this.spinner.hide();
          },
          error: (err: any) => {

            this.spinner.hide();
            this.dialog.swal({
              dialog: 'error',
              title: 'Error',
              message: err.message
            });
          }
        });
      }
    }).catch((error: any) => {
      console.error("Dialog error:", error);
    });
  }
  Recevergstin() {


    this.http.get('Vendor/GstinbyInfo', {
      gstin: this.entity.biltyDetails.receiverGstin || "",
      mobileno: this.entity.biltyDetails.receiverMobileNo || "",


    }).subscribe({
      next: (res: any) => {
        if (res.status_cd == 1) {
          if (res.data) {
            this.isReceiverClicked = false;
            this.ReceiverisClicked = false;
            this.entity.biltyDetails.receiverGstin = res.data.gstinNo;
            this.entity.biltyDetails.receiverMobileNo = res.data.mobileNo;
            this.entity.biltyDetails.receiverName = res.data.name;
            this.entity.biltyDetails.receiverAddress = res.data.address;
            this.entity.biltyDetails.receiverPin = res.data.pincode;
            this.entity.receiverStateId = res.data.state;
            this.entity.biltyDetails.receiverMail = res.data.emailId;
            this.entity.receiveraccout = res.data?.accCodeNavigation;
          } else {
            this.isReceiverClicked = true;
            this.ReceiverisClicked = true;


          }
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
  receiverfuncion() {
    $('#Modal').modal('show');
    this.commanfunction();
  }
  calculateFreight() {
    const weight = this.cmod.chrgWeight || 0;
    const rate = this.cmod.rate || 0;
    this.cmod.freight = weight * rate;
  }
  calculateAmounts() {
    let total = this.entity.totaldebitadd || 0;


    if (this.entity.freightType == 0 || this.entity.freightType == 2) {

      this.entity.biltyDetails.senderAmount = total;
      this.entity.biltyDetails.receiverAmount = 0;
    } else if (this.entity.freightType == 1) {

      this.entity.biltyDetails.receiverAmount = total;
      this.entity.biltyDetails.senderAmount = 0;
    }
  }

  totalDebit() {
    this.entity.totaldebitadd = Number(this.entity.totalothercharges || 0) + Number(this.entity.TotalFreight);
    this.calculateAmounts()
  }

  addgstTablerow() {
    if (this.cmod.commodity && this.cmod.uom && this.cmod.qty && this.cmod.chrgWeight && this.cmod.actWeight && this.cmod.rate && this.cmod.freight) {

      if (this.rowIndex == null) {
        this.entity.biltyCommodities.push(this.cmod);
      }
      else {
        this.entity.biltyCommodities[this.rowIndex] = this.cmod;
      }
      this.cmod = {};
      this.rowIndex = null;
      this.additinOfFreight()
      this.totalDebit()
      this.gstamt();
    }
  }

  additinOfFreight() {
    var sumArray = this.entity.biltyCommodities
      .map(item => item.freight || 0);


    var sumValue = sumArray.reduce(function (pValue, cValue) {
      return Number(pValue) + Number(cValue)

    });
    this.entity.TotalFreight = sumValue;
    this.totalDebit()
    this.gstamt()
  }

  editgstTablerow(obj, index) {
    this.rowIndex = index;
    this.cmod = Object.assign({}, obj);
  
  }
  deletegstTablerow(index) {

    var params = {

      dialog: 'confirm',
      title: "warning",
      message: "Do you want to delete record"
    }
    this.dialog.swal(params).then(data => {
      if (data == true) {
        this.entity.biltyCommodities.splice(index, 1); 
        this.additinOfFreight()
        this.gstamt();
      }
    })
  }
}
