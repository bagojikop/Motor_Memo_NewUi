
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { NgxImageCompressService } from 'ngx-image-compress';
import { NgxSpinner, NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { MyProvider } from '../services/provider';
import { FormsModule } from '@angular/forms';
// import  from "@angular/common";
// import  from "ngx-spinner";
// import  from "@angular/common/http";
// import  from "ngx-image-compress";
// import  from "@angular/forms";

declare var $: any;

@Component({
  selector: 'app-uploadDocs',
  standalone:true,
  imports:[FormsModule,CommonModule],
  templateUrl: './upload-docs.component.html',
  styleUrls: ['./upload-docs.component.scss']
})

export class UploadImageComponent implements OnChanges {
  @ViewChild('fileUpload') fileUpload:ElementRef;
  @Output() DocResponse = new EventEmitter();
  @Input() docAttach: any;
  @Output() docAttachChange =new EventEmitter();
  @Input() btnClass: string;
  @Input() docclass: any;
  @Input() name: string;
  @Input() serverapi: string;
  @Input() disabledd:boolean=false;
  file: any;
  disabled = false;
  formdata = new FormData();
  editImag = false;
  entity:any = {}; 
  imgformatedsize: any;
  url: any;

  constructor(private datepipe: DatePipe, private spinner: NgxSpinnerService,
    private da: ChangeDetectorRef, private http: HttpClient, private imageCompress: NgxImageCompressService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    // if (changes['docAttach'].currentValue) {
    //   //if (changes['docAttach'].currentValue != changes['docAttach'].previousValue) {
    //   console.log(this.docAttach);
    //  // this.upload();
    // }
  }

  showModal() {
    $("#uploadDOC").modal('show');
    this.docAttach.filepath=null;
    this.docAttach.descr=null;
    this.docAttach.uploadedDt=null;
    this.entity.vchId=this.docAttach.vch_id;
    this.docAttach.uploadedDt = this.datepipe.transform(new Date(), 'yyyy-MM-dd');
    this.da.detectChanges();
    
  }
  selectImg() {
    this.fileUpload.nativeElement.value="";
  }


  handleFileInput(event) {
    var file = event.target.files;
    var imagecreate;
    //hiding
    this.formdata = new FormData();
    if (file[0].name.match(/.(jpg|jpeg|png|gif|pdf|docx|doc|pdf|ppt|xls)$/i)) {
      if (file[0].size >= 1000000) {
        if (file[0].name.match(/.(pdf|docx|doc|pdf|ppt|xls)$/i)) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Maximum Upload file size: 1 MB',
          });
        }
        else {
          this.compressimg(file);
          $('#PreviewImg').modal('show');
        }
      }
      else {
        this.assigndata(imagecreate, event);
      }
    }
    else {
      this.assigndata(imagecreate, event);
    }
  }
  
  assigndata(imagecreate, event) {
    imagecreate = event.target.files[0];
    this.file = event.target.files[0];
    this.docAttach.filepath = imagecreate.name;
    this.docAttach.filesize = this.formatSizeUnits(imagecreate.size);
  }
  onFileChange(event) {
    var file = event.target.files;
    if (file.length === 0) {
      return;
    }
    let fileToUpload = file[0];
    this.formdata = new FormData();
    this.formdata.append('file', fileToUpload, fileToUpload.name);
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
  async compressimg(files) {
    this.file = files[0];
    var promis = new Promise((resolve, reject) => {

      this.imgformatedsize = this.formatSizeUnits(files[0].size);
      resolve(this.imgformatedsize);

    });
    promis.then((res) => {
      this.filesreader(files[0]);
    });
  }

  filesreader(files) {
    var reader = new FileReader();
    reader.onload = (file) => {
      this.url = reader.result;
      // var file = files;
    };
    reader.readAsDataURL(files);
  }

  result: any;
  reader: any;
  changeIMGQuality(quality) {
    this.filesreader(this.file);
    this.imageCompress.compressFile(this.url, 1, quality, quality).then(result => {
      this.urltoFile(result, this.file.name, 'image/png').then((res) => {
        this.result = res;
        this.imgformatedsize = this.formatSizeUnits(res.size);
        this.reader = new FileReader();
        this.reader.onload = (event) => {
          this.url = this.reader.result;
        };
        this.reader.readAsDataURL(res);
      });
    });
  }
  urltoFile(url, filepath, mimeType) {
    return (fetch(url)
      .then((res) => { return res.arrayBuffer(); })
      .then((buf) => { return new File([buf], filepath, { type: mimeType }); }));
  }
  SaveImgResize() {
    this.docAttach.filepath = this.result.name;
    this.docAttach.filesize = this.result.size;
    this.docAttach.imagebase64 = this.url;
    $("#PreviewImg").modal('hide');
  }
  closeDocPreview() {
    this.docAttach = null;
    $('#PreviewImg').modal('hide');
  }


  upload() {
    this.spinner.show();
    this.http.post(this.serverapi + "Doc/Upload", this.formdata, { params: this.docAttach }).subscribe({
      next: (res: any) => {
        if (res.status_cd == 1) {
         this.docAttach.vchId=res.data.vchId;
          this.spinner.hide();
          $("#uploadDOC").modal('hide');
          Swal.fire({
            icon: 'success',
            text: 'Data Upload Successfully..'
          });
          this.docAttachChange.emit(null);
          this.DocResponse.emit(this.docAttach);
          // this.docAttach=null;
          // this.docAttach.vchId=res.data.vchId;
        }
        else {
          Swal.fire({
            icon: 'error',
            text: res.errors.message
          });
        }
      }, error: (err) => {
        this.spinner.hide();
        Swal.fire({
          icon: 'error',
          text: err.message
        });
        // this.dialog.swal({ dialog: 'error', title: 'Error', message: err.message })
      }
    });
  }
}