import { Directive, ElementRef, HostListener, AfterViewInit, Input, forwardRef, Renderer2, LOCALE_ID } from '@angular/core';
import { CurrencyMaskService } from './currency-mask.service';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';


const noop = () => { };
declare var $: any;

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CurrencyMaskDirective),
  multi: true
};
/*
* Custom Directive for Currency Mask
* The main requirements that drove the creation of this custom directive currency mask are:
* 1. Currency Mask had to be easy to implement across application. Directive control was used to accomplish that and everything is under one Module that can be easily imported.
* 2. Formatted value should be composed of: US dollar currency symbol '$' + value + 2 decimal point precision.
* 3. When user focus on the input, it should remove all formatting and only keep the decimal amount with the precision. If the input is blank and:
*   a. The user types "100" then unfocus, it should display $100.00
*   b. The user types "100.10" then unfocus, it should display $100.10
*   c. The user types ".25" then unfocus, it should display $0.25
* 4. User shouldn't be able to type anything that isn't numbers or decimal separator "."
* 5. Optional parameter for allowing negative numbers added. On Edit mode the the indicative of negative number is the minus "-" sign, but when
*     formatted we surround the value with parenthesis. So on input -300.12 will display as ($300.12).
*/
@Directive({
  selector: '[CurrencyMask]',
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR ]
})
 
export class CurrencyMaskDirective implements AfterViewInit, ControlValueAccessor {
  private el: HTMLInputElement;
  // Keeps track of the value without formatting
  private innerValue: any;
  private showsymbol:boolean;
  private allowNegative:boolean;
  // Optional Parameter to allow for negative number interaction
  @Input('isneg')
  isneg:string;
  @Input('fraction')
  fraction: string = "2";
  @Input('currency')
  currency: string="" ;
  @Input('symbol')
  symbol: string ;
  
  constructor(private elementRef: ElementRef,  private renderer: Renderer2, private currencyMaskService: CurrencyMaskService) {
    this.el = elementRef.nativeElement;
    
  
  }

  // Placeholders for the callbacks which are later providesd
  // by the Control Value Accessor
  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (a: any) => void = noop;

  // set getter
  get value(): any {
    return this.innerValue;
  }

  // set accessor including call the onchange callback
  set value(v: any) {
    if (v !== this.innerValue) {
      this.innerValue = v;
      this.onChangeCallback(v);
    }
  }

  // From ControlValueAccessor interface
  writeValue(value: any) {
    // if (value && value !== this.innerValue) {
    //   this.setValue(value);
    //   if (value) {
    //     this.renderer.setAttribute(this.elementRef.nativeElement, 'value', value);
    //   }
    //   this.innerValue = value;
    // }

    if (value !== this.innerValue) {
      this.el.value = this.currencyMaskService.transform(value, this.allowNegative,Number(this.fraction),this.currency,this.showsymbol);
      if (value) {
        this.renderer.setAttribute(this.elementRef.nativeElement, 'value', value);
      }
      this.innerValue = value;
    }
  }

  // From ControlValueAccessor interface
  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  // From ControlValueAccessor interface
  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }

  ngAfterViewInit() {
    this.el.style.textAlign = 'right';
    this.showsymbol=this.symbol==undefined ?false :true;
    this.allowNegative=this.isneg==undefined ?false :true;
  }

  // On Focus remove all non-digit or decimal separator values
  @HostListener('focus', ['$event.target.value'])
  onfocus(value) {
    //this.el.value = this.currencyMaskService.parse(value, this.allowNegative);
    if (value == 0)
      this.el.value = "";
  }

 

  // On Blue remove all symbols except last . and set to currency format
  @HostListener('blur', ['$event.target.value'])
  onBlur(value) {
    this.onTouchedCallback();
    value = value == "" ? 0 : value;
    this.el.value = this.currencyMaskService.transform(value, this.allowNegative,Number(this.fraction),this.currency,this.showsymbol);
    this.innerValue = this.currencyMaskService.parse(this.el.value,Number(this.fraction), this.allowNegative);
     this.onChangeCallback(this.innerValue);
    if (this.innerValue) {
     this.renderer.setAttribute(this.elementRef.nativeElement, 'value', this.innerValue);
    // this.onTouchedCallback();
    // this.setValue(value);
    // if (this.innerValue) {
    //   this.renderer.setAttribute(this.elementRef.nativeElement, 'value', this.innerValue);
    // }

  }
}

  // On Change remove all symbols except last . and set to currency format
  @HostListener('change', ['$event.target.value'])
  onChange(value) {
    this.el.value = this.currencyMaskService.transform(value, this.allowNegative,Number(this.fraction),this.currency,this.showsymbol);
    this.innerValue = this.currencyMaskService.parse(this.el.value, Number(this.fraction), this.allowNegative);
    this.onChangeCallback(this.innerValue);
    if (this.innerValue) {
      this.renderer.setAttribute(this.elementRef.nativeElement, 'value', this.innerValue);
    }
    // this.onTouchedCallback();
    // this.setValue(value);
    // if (this.innerValue) {
    //   this.renderer.setAttribute(this.elementRef.nativeElement, 'value', this.innerValue);
    // }
  }

  // Prevent user to enter anything but digits and decimal separator
  @HostListener('keypress', ['$event'])
  onKeyPress(e) {
    const key = e.which || e.keyCode || 0;



    if (key === 46 && parseInt(this.fraction, 10) === 0) {
      e.preventDefault();

    }
    if (key === 46 &&   this.el.value.indexOf('.') >= 0) {
      e.preventDefault();

    }
    if ($.inArray(key, [8, 9, 27, 13,46]) !== -1 ||
      // Allow: Ctrl+A, Command+A
      (key === 65 && (e.ctrlKey === true || e.metaKey === true)) || key === 109) {
        return;
    }
    else

    //&& (e.keyCode < 96 || e.keyCode > 105)
    if (!this.allowNegative) {
      if (e.altKey || e.shiftKey || (((key < 48 || key > 57)))) {
        e.preventDefault();

      }

    } else {
      if (key !== 45) {
        if (e.altKey || e.shiftKey || (((key < 48 || key > 57)))) {
          e.preventDefault();

        }
      }

    }
     
  }
  // onKeyPress(event) {
  //   const key = event.which || event.keyCode || 0;
  //   if (key === 45 && !this.allowNegative) {
  //     event.preventDefault();
  //   } else if (key === 45 && this.allowNegative) {
  //     // allow negative numbers
  //   } else if (key !== 46 && key > 31 && (key < 48 || key > 57)) {
  //     event.preventDefault();
  //   }
  // }
  
}
