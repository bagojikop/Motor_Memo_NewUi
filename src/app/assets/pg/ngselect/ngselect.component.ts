
import {
  HttpClient,

} from '@angular/common/http';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,

  Output,
  Renderer2,
  SimpleChanges,
  ViewChild,
  forwardRef
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

import { MyProvider } from '../../services/provider';
import { NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ngselect',
  imports:[FormsModule,CommonModule,NgSelectModule],

  templateUrl: './ngselect.component.html',
  styleUrls: ['./ngselect.component.scss'],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    NgSelectModule,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ngselectComponent),
      multi: true,
    },
  ],
})
export class ngselectComponent implements ControlValueAccessor {
  @ViewChild('selectRef') selectRef!: NgSelectComponent;
  @Input() addNewText:boolean=false;
  @Input() ngModel: any;
  @Output() ngModelChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() change = new EventEmitter();
  @Input() apiUrl: string;
  @Input() bindLabel: string;
  @Input() bindValue: string;
  @Input() bindSubObj = [];
  @Input() name: string;
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;
  @Input() apiParams: any = {};
  @Input() multiple: boolean = false;
  @Input() nullableProperty: any;
  @Input() defaultProperty: any;
  @Input('applyMargins') applyMargins: boolean = true;
  @Input('label') label: string = '';
  @Output() onSelect = new EventEmitter<any>();

  searchTextChanged = new Subject<string>();
  items: any[] = [];
  objectsArray = [];
  pageSize: number = 10;
  currentPage: number = 1;
  searchValue: string = '';
  modelChanged: Subject<string> = new Subject<string>();

  private _value: any = '';
  private onChangeCallback: (value: any) => void = () => { };
  private onTouchedCallback: () => void = () => { };

  constructor(
    private http: HttpClient,
    private renderer: Renderer2,
    private el: ElementRef,
    private provider: MyProvider,
    private cd: ChangeDetectorRef
  ) {
    this.modelChanged
      .pipe(debounceTime(1000), distinctUntilChanged()) // debounce search input
      .subscribe((model) => this.SearchTextChanged(model));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['defaultProperty']?.currentValue) {
      if (Object.keys(this.defaultProperty).length > 0) {
        this.items = [this.defaultProperty];
        this.writeValue(this.defaultProperty[this.bindValue]);
        this.change.emit(this.defaultProperty);
      } else if (changes['apiParams']?.currentValue) {
        this.loadMore();
      }
    }
  }


  onAddTag(newTag: string) {
    const newItem = {[this.bindValue]: this.items.length + 1, [this.bindLabel]: newTag };
    this.items.push(newItem);
      // Set the new value as selected
  }


  writeValue(value: any): void {
    this._value = value;
    this.ngModel = value;
    this.ngModelChange.emit(this.ngModel);
    this.cd.markForCheck();

  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchedCallback = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  OnSearch(text: any): void {
    this.modelChanged.next(text);
  }

  SearchTextChanged(e: any): void {
    this.searchValue = e.term;

    const params = [{ key: this.bindLabel, value: e.term }];
    if (this.apiParams) this.apiParams.orelse = true;

    this.http
      .post(
        this.provider.serverapi + this.apiUrl,
        { pageNumber: 1, keys: params },
        { params: this.apiParams }
      )
      .subscribe({
        next: (data: any) => {
          this.items = data.data;
          if (this.nullableProperty) this.items.unshift(this.nullableProperty);
        },
        error: (err) => {
          alert(err.message);
        },
      });
  }

  loadMore(): void {
    const pageNumber = Math.floor(this.items.length / this.pageSize) + 1;
    if (pageNumber === 1) {
      this.items = [];
    }

    if (this.apiParams) this.apiParams.orelse = true;
    this.http
      .post(
        this.provider.serverapi + this.apiUrl,
        { pageNumber },
        { params: this.apiParams }
      )
      .subscribe({
        next: (data: any) => {
          this.items = [...this.items, ...data.data];

          const isAll = this.items.filter((s) => s[this.bindValue] === '');

          if (this.nullableProperty && isAll.length === 0) {
            this.items.unshift(this.nullableProperty);
          }

          if (this.defaultProperty && this.items.length > 0) {
            const x = this.items.find(
              (s) => s[this.bindValue] === this.defaultProperty[this.bindValue]
            );

            if (x) {
              this.writeValue(x[this.bindValue]);
            }

            this.change.emit(this.defaultProperty);
          }
        },
        error: (err) => {
          alert(err.message);
        },
      });
  }


  subRowObj(item, value) {
    return value.split('.').reduce((obj, key) => obj?.[key], item);
  }

  ShowSeperator(currindex) {
    let l = this.bindSubObj.length;
    if (currindex < l)
      return "|"
    else
      return ""
  }

  onChange(event: any) {
    this.ngModel = event[this.bindValue]; // Update the model
    this.ngModelChange.emit(this.ngModel); // Emit the updated model
    this.cd.detectChanges();
    this.change.emit(event); // Notify about the change
  }

    getCombinedLabel(item: any): string {
    let combinedLabel = item[this.bindLabel]; // Start with the main bindLabel

    // Iterate over bindSubObj to build the additional values

    if (this.bindSubObj.length > 0) {
      this.bindSubObj.forEach(sub => {
        //@ts-ignore
        const subValue = this.subRowObj(item, sub.value); // Get the nested value
        combinedLabel += subValue ? `- ${subValue}` : ''; // Append the value to the label
      });
    } 
    return combinedLabel;
  }


  OnBlur(): void {
    this.onTouchedCallback();
    this.onSelect.emit(...this.selectRef.selectedItems);
  }
}

