import { DatePipe } from "@angular/common";
import { AfterViewInit, ChangeDetectorRef, Directive, ElementRef, HostListener, OnInit } from "@angular/core";
import { MyProvider } from "../../services/provider";
 

@Directive({ selector: '[finDate]', standalone:true, })

export class finDateDirective implements AfterViewInit {
  customdate: any;
  sdt;
  edt;
  constructor(public el: ElementRef,private dc:ChangeDetectorRef, public provider: MyProvider, public datepipe: DatePipe) {

    this.sdt = datepipe.transform(this.provider.companyinfo.finyear.fdt, 'yyyy-MM-dd');
    this.edt = datepipe.transform(this.provider.companyinfo.finyear.tdt, 'yyyy-MM-dd');

    this.el.nativeElement.setAttribute('min', this.sdt)
    this.el.nativeElement.setAttribute('max', this.edt)
  }


    ngAfterViewInit(): void {
      this.customdate = this.el.nativeElement.value;
      //this.el.nativeElement.attributes.required = true;
  
      if (this.customdate <= this.sdt) {
        this.el.nativeElement.value = this.sdt;

      }
      else if (this.customdate >= this.edt) {
        this.el.nativeElement.value = this.edt;
      }

       this.dc.detectChanges()
    }



  @HostListener('focusout', ['$event']) focusout(el) {
    this.customdate = this.el.nativeElement.value;
    //this.el.nativeElement.attributes.required = true;

    if (this.customdate <= this.sdt) {
      this.el.nativeElement.value = this.sdt;
    }
    else if (this.customdate >= this.edt) {
      this.el.nativeElement.value = this.edt;
    }
    this.dc.detectChanges()
  }


}
