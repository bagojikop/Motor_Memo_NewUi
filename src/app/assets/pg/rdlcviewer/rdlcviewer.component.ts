import { Component, OnInit,Input, Output, EventEmitter, AfterViewInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {SafeResourceUrl, DomSanitizer} from '@angular/platform-browser'

import { MyProvider } from '../../services/provider';
import {CommonModule, formatDate} from '@angular/common';
import { fromEvent } from 'rxjs';
import { FormsModule } from '@angular/forms';

declare var $: any;


// export interface reportViewrModel {
//   trustedUrl: string;
//   params: [];
// }


@Component({
  standalone:true,
  imports:[FormsModule,CommonModule],
  selector: 'app-rdlcviewer',
  templateUrl: './rdlcviewer.component.html',
  styleUrls: ['./rdlcviewer.component.scss'],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})

export class RdlcviewerComponent   implements  OnInit,AfterViewInit {
  @Input() title='';
  @Input() trustedUrl: string;
  @Input() params:any= [];
  @Input() width='';
  @Input() height='';
  @Input() ison:boolean;

  @Output() closemodalfn = new EventEmitter<boolean>();
  rpturl:SafeResourceUrl;
  currentdate;
  bsspinner:boolean=false;
  constructor(public provider: MyProvider,
               private sanitizer: DomSanitizer,
            
              ) {}

  ngOnInit(): void {
    this.bsspinner=true;
    var currDate = formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss', 'en-US');
    this.currentdate = "currDate=" + currDate;

    for (var i = 0; i < this.params.length; i++) {
      this.currentdate += "&" + this.params[i].key + "=" + this.params[i].value
    }
    //@ts-ignore
    document.getElementById('ssrsiframe').style.height=this.height;

    this.rpturl= this.sanitizer.bypassSecurityTrustResourceUrl(this.provider.reportserver + this.trustedUrl+'?'+this.currentdate);
     
  }

  onload(){
    this.bsspinner=false;
  }


  closemodal()
  {
    this.closemodalfn.emit(false);
  }

   ngAfterViewInit(): void {
    const iframe = document.getElementById('ssrsiframe');
    //@ts-ignore
    fromEvent(iframe, 'load').subscribe(() => {
      this.bsspinner=false;
    });
   }
 
}
