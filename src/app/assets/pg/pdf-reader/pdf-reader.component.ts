import { Component, ElementRef, OnInit, ViewChild, EventEmitter, Input, OnChanges, Output, SimpleChanges, AfterViewInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { PDFDocumentProxy, PdfViewerComponent } from 'ng2-pdf-viewer';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { saveAs } from 'file-saver';
import { ReportDictionory, MailNav, WappNav } from '../../../assets/services/interfaces';
import { http } from '../../services/services';
import Swal from 'sweetalert2';
import { NgxSpinner, NgxSpinnerService } from 'ngx-spinner';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

declare var $: any;
@Component({
  selector: 'app-pdf-reader',
  standalone:true,
   imports:[FormsModule,CommonModule],
  templateUrl: './pdf-reader.component.html',
  styleUrls: ['./pdf-reader.component.scss'],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class PdfReaderComponent implements OnInit {
  @ViewChild(PdfViewerComponent) private pdfComponent: any = PdfViewerComponent;
  private pdf: PDFDocumentProxy;
  pdfFindController: any;
  currentPage: number = 1;

  @Input() dictionory: ReportDictionory;
  @Input() isShow: boolean = false;
  @Output() isShowChange = new EventEmitter<boolean>();
  @Input() serviceUrl: string;
  @Input() docName: string;
  @Input() mail: MailNav;
  @Input() wapp: WappNav;
  @Input() AuthoriseToken: string;
  @Input() ReportTitle: string

  constructor(private el: ElementRef, private loading: NgxSpinnerService, private http: http) {

  }

  @ViewChild('pdfViewer') pdfViewer: ElementRef;
  // pdfSrc = "https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf";
  pdfSrc: string

  ref: any = {};

  ngOnInit(): void {
    this.ref.currentPage = 1;
    this.ref.totalnumber = 0;
    this.ref.zoomnumber = 1;
    this.ref.zoom = 100;
    this.mail = <MailNav>{};
    this.wapp = <WappNav>{};
    this.mail.fileType = "PDF";

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (Object.keys(changes['dictionory'].currentValue).length > 0) {
      this.getReport();
    }
  }

  preno() {
    var numOne = parseInt(this.ref.currentPage);
    numOne = isNaN(numOne) ? 1 : numOne;
    if (numOne > 1)
      numOne--;
    this.ref.currentPage = numOne;

  }

  getCurrentPage() {
    if (this.ref.totalnumber) {

    }
  }


  nextno() {
    var numOne = parseInt(this.ref.currentPage);
    var totalno = parseInt(this.ref.totalnumber);

    numOne = isNaN(numOne) ? 0 : numOne;
    if (numOne < totalno)
      numOne++;
    this.ref.currentPage = numOne;

  }

  minzoom() {
    var value = Number(this.ref.zoom);

    if (value > 50) {
      value = value - 10;
    }
    this.ref.zoomnumber = Number(value) / Number(100);
    this.ref.zoom = value;
  }


  zoom() {
    var value = Number(this.ref.zoom);
    if (value > 50 && value < 200) {
      this.ref.zoomnumber = Number(value) / Number(100);
      this.ref.zoom = value;
    } else {
      this.ref.zoomnumber = 1;
      this.ref.zoom = 100;
    }
  }

  maxzoom() {
    var value = parseInt(this.ref.zoom);
    if (value < 200) {

      value = value + 10;
    }
    this.ref.zoomnumber = Number(value) / Number(100);
    this.ref.zoom = value;
  }


  print() {
    this.pdf.getData().then((u8) => {
      let blob = new Blob([u8.buffer], {
        type: 'application/pdf'
      });

      const blobUrl = window.URL.createObjectURL((blob));
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = blobUrl;
      document.body.appendChild(iframe);
      //@ts-ignore
      iframe.contentWindow.print();
    });
  }

  afterLoadComplete(event) {
    this.ref.totalnumber = event.numPages;
    this.pdf = event;

  }


  isLoaded(pdf: any) {
    this.ref.isPdfLoaded = true;
    this.pdf = pdf;
  }



  search(stringToSearch: string) {
    this.pdfComponent.eventBus.dispatch('find', {
      query: stringToSearch,
      type: 'again',
      caseSensitive: false,
      findPrevious: undefined,
      highlightAll: true,
      phraseSearch: true
    });
  }


  saveAsPdf(): void {
    this.pdf.getData().then((u8) => {
      let blob = new Blob([u8.buffer], {
        type: 'application/pdf'
      });

      const blobUrl = window.URL.createObjectURL((blob));
      saveAs(blob, this.docName + '.pdf');
    })
  }

  getReportName(filename, exportType) {
    let ext = "PDF";
    switch (exportType.toUpperCase()) {
      case "WORD":
        ext = "docx";
        break;
      case "EXCEL":
        ext = "xlsx";
        break;
      case "HTML":
        ext = "html";
        break;
      case "IMAGE":
        ext = "png";
        break;
    }
    return filename + "." + ext;
  }
  exportFunc(typ: string) {
    this.dictionory.exportType = typ.toUpperCase();
    this.dictionory.wapp = undefined;
    this.dictionory.mail = undefined;
    this.getReport();
  }

  mailFunc() {
    this.dictionory.wapp = undefined;
    this.dictionory.mail = this.mail;
    this.getReport().then((res: any) => {
      $("#emailto").modal("hide");
      if (res.status_cd == 1) {

        //alert("Mail Send Successfully")

        Swal.fire({
          text: "Mail Send Successfully",
          icon: "success"
        });
        this.mail = <MailNav>{};
      } else {
        // alert("Mail Failed...")

        Swal.fire({
          text: "Mail Failed...",
          icon: "error"
        });

      }
    });
  }
  wappFunc() {
    this.dictionory.mail = undefined;
    this.dictionory.wapp = this.wapp;
    this.getReport().then((res: any) => {
      $("#whatsappto").modal("hide");
      if (res.status_cd == 1) {
        // alert("Message Send Successfully")
        Swal.fire({
          text: "Message Send Successfully",
          icon: "success"
        });
        this.wapp = <WappNav>{};
      }


      else {
        //alert("Message Failed...")
        Swal.fire({
          text: "Message Failed...",
          icon: "error"
        });
      }

    });
  }
  getReport() {

    return new Promise((resolve, reject) => {

      this.loading.show();
      this.http.post(this.serviceUrl, this.dictionory).subscribe((res: any) => {
        this.loading.hide();
       
          if (!this.dictionory.wapp && !this.dictionory.mail) {
            const data = this.base64ToArrayBuffer(res.data.arrayBuffer.fileContents)

            if (res.data.fileType.toUpperCase() == "PDF") {
              const byteArray = new Uint8Array(data);

              // Convert the byte array to a Blob
              const blob = new Blob([byteArray], { type: 'application/pdf' });

              // Create a URL for the Blob
              this.pdfSrc = URL.createObjectURL(blob);
             
            }
            // this.pdfSrc = this.arrayBuffer.castInbase64(res.data.arrayBuffer);
            else {
            
              const blob = new Blob([data], { type: 'application/octet-stream' });
              saveAs(blob, this.getReportName(this.docName, res.data.fileType));
            }
          }
        
        
        resolve(res);
      }, error => {
        this.loading.hide();
        let errorObj = {

          status_cd: 0,
          errors: {
            message: error
          }

        }
        this.loading.hide();

        reject(errorObj);
      })
    })

  }
  private base64ToArrayBuffer(base64: string): Uint8Array {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  closeForm() {
    this.isShowChange.emit(false);
  }

}
