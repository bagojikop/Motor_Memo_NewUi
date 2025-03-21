import { CommonModule } from '@angular/common';
import { Component, Input, forwardRef, Output, EventEmitter } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
 

@Component({
  selector: 'dss-input',
  standalone:true,
  imports:[FormsModule,CommonModule,ReactiveFormsModule],
  templateUrl: './dss-input.component.html',
  styleUrls: ['./dss-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DssInputComponent),
      multi: true
    }
  ]
})
export class DssInputComponent implements ControlValueAccessor {
  @Input() ngModel!: any;
  @Input('id') id?: string;
  @Input('maxlength') maxlength?: number;
  @Input('minlength') minlength?: number;
  @Input('autocomplete') autocomplete?: string = 'off';
  @Input('name') name?: string;
  @Input('rows') rows?: number;
  @Input('cols') cols?: number;
  @Input('class') class?: string = 'form-control';
  @Input('placeholder') placeholder?: string = '';
  @Input('required') required?: boolean = false;
  @Input('Uppercase') Uppercase?: boolean = false;
  @Input('type') type?: string = 'text';
  @Input('label') label?: string;
  @Input('inputType') inputType?: string;
  @Input('Capitalize') Capitalize?: boolean = false;
  @Input('disabled') disabled?: boolean = false;
  @Input('whiteSpace') whiteSpace?: boolean = true;
  @Input() styleCase?: string = '';
  @Output() ngModelChange = new EventEmitter<any>()
  @Input('applyMargins') applyMargins: boolean = true;
  @Output() onchange =new EventEmitter<any>();
 
  private onChange = (value: any) => {  };

  _change(ngmodel){
    this.onchange.emit(ngmodel || '')
  }



  private onTouched = () => { };

  writeValue(value: any): void {
    if (value) {
      this.ngModel = value ?? '';
       this.onChange(this.ngModel);
      this.ngModelChange.emit(this.ngModel);
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }


  onKeyDown(event: KeyboardEvent): void {

    const input = (event.target as HTMLInputElement).value;
    // Prevent space character if whiteSpace is true
    if (this.whiteSpace == false && event.key === ' ') {
      event.preventDefault(); // Prevent the space from being entered
    }

    const allowedKeys = [
      'Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'
    ];

    // Prevent typing when maxlength is reached
    if (this.type === 'number' && this.maxlength && input.length >= this.maxlength && !allowedKeys.includes(event.key)) {
      event.preventDefault();  // Stop the keypress if maxlength is reached
    }
  }

  onInputChange(event: any): void {
    var input = event.target.value;

    //if uppercase = true
    if (this.styleCase === 'u') {
      input = input.toUpperCase();
    }

    if (this.styleCase === 'c') {
      input = input.replace(/\b\w/g, (char) => char.toUpperCase());
    }
    if (this.type === 'number') {
      // Prevent the user from entering more than maxlength digits
      if (this.maxlength && input.length > this.maxlength) {
        input = input.slice(0, this.maxlength);  // Trim to maxlength
      }
    }

    this.ngModel = input;
    this.ngModelChange.emit(input)
  }
}
