import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'lib-currencyMask',
  imports:[FormsModule,CommonModule],
  template: `<input [(ngModel)]="entity.name" CurrencyMask Fraction="2">`,
})
export class CurrencyMaskComponent {
  entity:any={};
}
