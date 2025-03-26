import { HostListener, ElementRef, Input, Output, EventEmitter, Directive, OnInit, Inject, LOCALE_ID, Renderer2, forwardRef, ChangeDetectorRef, SimpleChanges, OnChanges } from '@angular/core';

import { DecimalPipe, formatDate, TitleCasePipe, DatePipe } from '@angular/common';
import { DOC_ORIENTATION, NgxImageCompressService } from 'ngx-image-compress';
import { MyProvider } from '../../assets/services/provider';
import { Sort } from '../sort';
import { AbstractControl, NG_VALIDATORS, NgModel, ValidationErrors, Validator, Validators } from '@angular/forms';



@Directive({
  selector: '[nospecialChar]',
  standalone: false,
})
export class InputRestrictionDirective {
  inputElement: ElementRef;

  indRegex = '[\u0600-\u06FF]';

  constructor(public el: ElementRef) {
    this.inputElement = el;
  }

  @HostListener('keypress', ['$event']) onInput(value: string) {
    this.noSpecialChars(event);
  }

  noSpecialChars(event) {

    const e = <KeyboardEvent>event;

    if (e.key === 'Tab' || e.key === 'TAB') {
      return;
    }
    let k;

    k = event.keyCode;  // k = event.charCode;  (Both can be used)

    if ((k > 64 && k < 91) || (k > 96 && k < 123) || k === 8 || k === 32 || (k >= 48 && k <= 57)) {
      return;
    }

    const ch = String.fromCharCode(e.keyCode);

    const regEx = new RegExp(this.indRegex);

    if (regEx.test(ch)) {
      return;
    }

    e.preventDefault();
  }
}

import {
  NG_VALUE_ACCESSOR, ControlValueAccessor
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { event } from 'jquery';




@Directive({ selector: '[minmaxvalidater]', standalone: false })
export class minmaxDirective {
  mindate: Date;
  constructor(public el: ElementRef, public provider: MyProvider) { }
  @HostListener('focusout', ['$event']) onLoad(value) {
    this.mindate = this.el.nativeElement.value;

    var sdt = this.el.nativeElement.min;
    var edt = this.el.nativeElement.max;

    if (this.mindate >= sdt && this.mindate <= edt) {

      this.el.nativeElement.classList.remove('is-invalid');
      this.el.nativeElement.classList.remove('ng-invalid');

      this.el.nativeElement.classList.add('is-valid');
      this.el.nativeElement.classList.add('ng-valid');

    } else {
      this.el.nativeElement.classList.remove('is-valid');
      this.el.nativeElement.classList.remove('ng-valid');

      this.el.nativeElement.classList.add('is-invalid');
      this.el.nativeElement.classList.add('ng-invalid');
    }
  }
}


@Directive({ selector: '[numdot]', standalone: false })
export class SpecialwithnumDirective {

  constructor() { }

  @HostListener('focus', ['$event']) focus(event: any) {
    event.srcElement.value = event.srcElement.value.toString().replace(0, "");
  }

  @HostListener('focusout', ['$event']) focusout(event: any) {
    event.srcElement.value = event.srcElement.value || 0;
  }

  @HostListener('keypress', ['$event']) onKeyPress(event) {
    const pattern = /^[0-9]*\.?[0-9]*$/;
    return new RegExp(pattern).test(event.key);
  }

}


@Directive({
  selector: '[ngModel][uppercase]',
  providers: [NgModel],
  standalone: true,
  host: {
    '(ngModelChange)': 'onInputChange($event)'
  }
})
export class UppercaseDirective {

  constructor(private model: NgModel) { }

  onInputChange(event: string) {
    const newValue = event.toUpperCase();

    if (this.model.valueAccessor) {
      this.model.valueAccessor.writeValue(newValue);
    }
  }
}






@Directive({
  selector: '[ngModel][capitalize]',
  providers: [NgModel],
  standalone: false,
  host: {
    '(ngModelChange)': 'onInputChange($event)'
  }
})
export class capitalizeDirective {
  constructor(private model: NgModel, private titlecase: TitleCasePipe) { }

  onInputChange(event) {
    var newValue = this.titlecase.transform(event);

    if (this.model.valueAccessor) {
      this.model.valueAccessor.writeValue(newValue);
    }
    //this.model.viewToModelUpdate(newValue);
  }
}

@Directive({
  selector: '[minMax]',
  standalone: false,
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => MinMaxNumberDirective),
    multi: true
  }]
})
export class MinMaxNumberDirective implements Validator {

  @Input('minMax') minMax: { min: number, max: number };

  constructor() { }

  validate(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value !== null && (isNaN(value) || value < this.minMax.min || value > this.minMax.max)) {
      control.setValue(value, { emitEvent: false }); // Manually set the input box's value without emitting an event
      return { minMax: true };
    }
    return null;
  }

}


@Directive({
  selector: '[ngModel][decimal]',
  providers: [NgModel],
  standalone: true,
  host: {
    '(change)': 'onInputChange($event)',
    '(keydown)': 'numberOnly($event)'
  }
})
export class decimalDirective implements OnChanges {

  @Output() ngModelChange: EventEmitter<any> = new EventEmitter();
  @Input() fraction: number;
  @Input() ngModel;
  @Input() isNeg: boolean = false;

  specialKeys = ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight', 'Del', 'Delete'];

  constructor(public model: NgModel, private cdRef: ChangeDetectorRef, private renderer: Renderer2, private el: ElementRef, private decimalPipe: DecimalPipe) {
    this.renderer.setStyle(this.el.nativeElement, 'textAlign', 'right');
  }


  ngOnChanges(changes: SimpleChanges): void {
    let change = changes["ngModel"];
    // let curVal = change.currentValue;
    // let prevVal = change.previousValue;

    if (change.previousValue === undefined && change.currentValue !== null) {
      this.InputChangeFn(this.ngModel);
      this.cdRef.detectChanges();

    }
  }


  onInputChange(event) {
    this.InputChangeFn(event.target.value);
    this.cdRef.detectChanges();
  }


  InputChangeFn(value) {
    if (this.fraction)
      var f: any = '1.' + this.fraction + "-" + this.fraction;
    if (value == "") {
      value = 0;
    }
    value = value? value.toString().replace(",", ""):0;
    if (value > Math.floor(value)) {
      var n = this.decimalPipe.transform(parseFloat(value).toFixed(this.fraction), f);
      this.ngModelChange.emit(n)

    } else {
      var newValue = this.decimalPipe.transform(parseFloat(value).toFixed(this.fraction), f);
      //this.ngModel.update.emit(newValue);

      this.ngModelChange.emit(newValue);


    }
  }


  numberOnly(event) {
    let value = event.target.value;

    if (!this.isNeg)
      if (event.key === "-") {
        event.preventDefault();
        return;
      }

    var regex: RegExp = new RegExp(/^-?[0-9\s,\.]*$/);

    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }

    let current: string = value;

    const position = event.target.selectionStart;

    const next: string = [current.slice(0, position), event.key == 'Decimal' ? '.' : event.key, current.slice(position)].join('');

    if (next && !String(next).match(regex)) {
      event.preventDefault();
    }
  }




  @HostListener('focus', ['$event']) onfocus(event) {

    this.ngModel = this.ngModel.toString().replace(",", "");

    if (this.ngModel == '0.00') {
      this.ngModelChange.emit('');
    }
  }



  @HostListener('focusout', ['$event']) onfocusout(event) {
    if (this.ngModel == "") {
      this.ngModelChange.emit('0.00');
    }
  }


}

@Directive({
  selector: '[numberOnly]'
})
export class NumberOnlyDirective {
  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event']) onInputChange(event: any) {
    const initialValue = this.el.nativeElement.value;

    // Replace all non-numeric characters
    this.el.nativeElement.value = initialValue.replace(/[^0-9]/g, '');

    if (initialValue !== this.el.nativeElement.value) {
      event.stopPropagation(); // Prevent further event propagation if changed
    }
  }
}


@Directive({ selector: '[ngModel] [DTpicker]', standalone: true, })

export class DTFormatDirective implements OnChanges {
  @Output() ngModelChange: EventEmitter<any> = new EventEmitter();
  @Input() ngModel;

  constructor(private datePipe: DatePipe, private cdRef: ChangeDetectorRef) { }


  ngOnChanges(changes: SimpleChanges): void {
    let change = changes["ngModel"];

    if (change.currentValue) {
      this.dateFormat(this.ngModel);

    }
  }

  dateFormat(dt) {
    let result = this.datePipe.transform(dt, 'yyyy-MM-dd');
    this.ngModelChange.emit(result);
  }

}

@Directive({
  selector: '[appTitleCase]'
})
export class TitleCaseDirective {

  constructor(private el: ElementRef) {
  }

  @HostListener('blur') onBlur() {
    if (this.el.nativeElement.value) {
      const arr: string[] = this.el.nativeElement.value.split('');
      arr[0] = arr[0].toUpperCase();
      this.el.nativeElement.value = arr.join('');
    }
  }
}

@Directive({ selector: '[imgupload]', standalone: false, })

export class imguploadDirective {

  @Output() base64image: EventEmitter<any> = new EventEmitter();

  constructor(private el: ElementRef,
    private imageCompress: NgxImageCompressService) { }

  @HostListener('change', ['$event']) change(e) {
    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    var pattern = /image-*/;
    var reader = new FileReader();
    if (!file.type.match(pattern)) {
      alert('invalid format');
      return;
    }
    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }
  _handleReaderLoaded(e) {
    let reader = e.target;
    this.imageCompress.compressFile(reader.result, DOC_ORIENTATION.Up, 50, 50).then(
      result => {

        this.base64image.emit(result);

      }
    );
  }
}


@Directive({ selector: '[noWhiteSpace]', standalone: false, })
export class noWhiteSpaceDirective {
  constructor(public el: ElementRef) { }
  @HostListener('input', ['$event']) onInput(vaue) {
    this.el.nativeElement.value = this.el.nativeElement.value.replace(/\s/g, "");
  }
}




@Directive({
  selector: '[appSort]'
})
export class SortDirective {

  @Input() appSort: Array<any>;

  @Input() dataName: string;
  constructor(private renderer: Renderer2, private targetElement: ElementRef) { }

  @HostListener("click")
  sortData() {

    var sort = new Sort();

    var elem = this.targetElement.nativeElement;

    var b: any = document.getElementsByClassName('bi bi-arrow-up');

    if (b.length > 0) {

      b[0].className = 'bi bi-arrow-down';

    }

    var order = elem.getAttribute("data-order");

    var type = elem.getAttribute("data-type");


    elem.firstElementChild.className = order == 'asc' ? "bi bi-arrow-up" : "bi bi-arrow-down";

    var property = this.dataName;

    if (order === "desc") {
      this.appSort.sort(sort.startSort(property, order, type));
      elem.setAttribute("data-order", "asc");
    } else {
      this.appSort.sort(sort.startSort(property, order, type));
      elem.setAttribute("data-order", "desc");
    }

  }

}


@Directive({
  selector: "[percentage]",
  providers: [DecimalPipe]
})
export class PercentDirective {
  decimals: number = 2;
  digit: number = 3;
  @Output() sharedVarChange = new EventEmitter();
  greaterThan100: boolean = true;

  private check(value: string, decimals: number, digit: number) {
    if (decimals <= 0) {
      return String(value).match(new RegExp(/^\d+$/));
    } else {
      // `^\\-?(\\d{0,${digit}}(\\.\\d{0,${decimals}})?)$`
      var regExpString = `^\\-?(\\d{0,${digit}}(\\.\\d{0,${decimals}})?)$`;
      return String(value).match(new RegExp(regExpString, "gm"));
    }
  }

  private specialKeys = [
    "Backspace",
    "Tab",
    "End",
    "Home",
    "ArrowLeft",
    "ArrowRight",
    "Delete"
  ];

  constructor(
    private el: ElementRef,
    private decimalPipe: DecimalPipe,

    private model: NgModel
  ) { }

  ss: Subscription;

  ngOnInit() {
    let that = this;
    let toPercent: any;
    let percentStr: string;
    if (this.model.valueChanges) {
      this.model.valueChanges.subscribe(value => {
        console.log(that.model.control.pristine);
        if (that.model.control.pristine && value) {
          toPercent = value;
          let formattedValue = that.decimalPipe.transform(
            toPercent,
            `1.${that.decimals}-${that.decimals}`
          );
          percentStr = `${toPercent}.00%`;
          if (that.model.valueAccessor) {
            that.model.valueAccessor.writeValue(percentStr);
            // that.model.update.emit(toPercent);
            // that.sharedVarChange.emit(toPercent);
          }
        }
      });
    }
  }

  ngOnDestroy() {
    // this.ss.unsubscribe();
  }

  @HostListener("keydown", ["$event"]) onKeyDown(event: KeyboardEvent) {

    let selectShortcut = event.ctrlKey && event.key == "a";
    let copyShortcut = event.ctrlKey && event.key == "c";
    let pasteShortcut = event.ctrlKey && event.key == "v";
    let undoShortcut = event.ctrlKey && event.key == "z";

    let ifAnyShortcut = selectShortcut || copyShortcut || pasteShortcut || undoShortcut;
    // console.log('ifAnyShortcut', ifAnyShortcut);
    if (ifAnyShortcut || this.specialKeys.indexOf(event.key) !== -1) {
      // console.log('ifAnyShortcut', ifAnyShortcut);
      return false;
    } else {
      return true;
    }

    let current: string = this.el.nativeElement.value;
    let position: number = this.el.nativeElement.selectionStart;
    let next: string = [
      current.slice(0, position),
      event.key,
      current.slice(position)
    ].join("");
    if (next && !this.check(next, this.decimals, this.digit)) {
      // console.log('preventing deafult', event.key);
      event.preventDefault();
      return next;
    }
  }

  @HostListener("blur")
  onBlur() {
    let decimalZeroes = "0".repeat(this.decimals);
    let uiValue: any = `0.${decimalZeroes}`;
    let onBlurValue: string = this.el.nativeElement.value;
    let parsedValue: number = parseFloat(onBlurValue);

    if (!this.greaterThan100 && parsedValue > 100.0) {
      uiValue = `100.${decimalZeroes}`;
    } else if (!isNaN(parsedValue)) {
      // this.model.update.emit(parsedValue);
      uiValue = this.decimalPipe.transform(
        parsedValue,
        "1." + this.decimals + "-" + this.decimals
      );
    }
    this.el.nativeElement.value = uiValue + "%";
    this.model.control.markAsPristine();
  }

  @HostListener("focus")
  onFocus() {
    let next1: string = this.el.nativeElement.value;
    if (next1.indexOf("%") != -1) {
      this.el.nativeElement.value = next1.substring(0, next1.length - 4);
    }
  }
}

