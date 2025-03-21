
import { CommonModule } from '@angular/common';
import { Component,AfterViewInit, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AgRendererComponent, ICellRendererAngularComp } from 'ag-grid-angular';
import { IAfterGuiAttachedParams } from 'ag-grid-community';
 
declare var $: any;


@Component({
  selector: 'app-button-renderer',
  imports:[FormsModule,CommonModule],
  template: `
  
    <button type="button" id="edit"
     class="btn text-primary p-0 px-1 text-center border-1"
      data-bs-toggle="tooltip" data-bs-placement="bottom" title="view"
     (click)="onClick($event)">
   <i  id='edit' class="fas fa-eye"></i>
    </button>

    <button type="button" id ="del" class="btn text-danger text-center p-0 px-1 ms-2 border-1"
    data-bs-toggle="tooltip" data-bs-placement="bottom" title="remove"
    (click)="onClick($event)">
   <i id='del' class="fa fa-trash" ></i>
  </button>
    `
})

export class ActBtnComponent implements ICellRendererAngularComp,AfterViewInit {

  params;
  label: string;

  agInit(params): void {
    this.params = params;
    this.label = this.params.label || null;
  }

  refresh(params?: any): boolean {
    return true;
  }

  onClick($event) {

    switch ($event.target.id) {
      case 'edit':
        $event.action = "edit";
        break;
      case 'del':
        $event.action = "delete";
        break;

    }



    if (this.params.onClick instanceof Function) {
      // put anything into params u want pass into parents component

      const params = {
        event: $event,
        rowData: this.params.node.data
        // ...something
      }
      this.params.onClick(params);

    }
  }



  ngAfterViewInit(): void {
    //$("[data-bs-toggle='tooltip']").tooltip();
  }
}


@Component({
  template: `
  <button [style]="{'backgroundColor':bgColor}" >{{status}}</button>
  `
})
export class statusBtnComponent implements ICellRendererAngularComp {
  status;
  params;
  bgColor;
  label: string;


  agInit(params): void {
    this.status = this.status;
    this.label = this.params.label || null;
  }

  refresh(params?: any): boolean {
    return true;
  }


}




@Component({
 imports:[FormsModule,CommonModule],
 standalone:true,
  template: `
   <input type="checkbox" [(ngModel)]="params.value" (change)="this.refresh(this.params)">
  `
})
export class AgGridCheckboxComponent implements ICellRendererAngularComp {
  
   params: any={};

  agInit(params: any): void {
    this.params = params;
  }

  afterGuiAttached(params?: IAfterGuiAttachedParams): void {
  }

  refresh(params: any): boolean {
    params.data.amount++;
    params.data.selected = params.value
    console.log(params.value);
    params.api.refreshCells(params);
    return false;
  }

}






@Component({
   standalone:true,
   imports:[FormsModule,CommonModule],
   schemas:[CUSTOM_ELEMENTS_SCHEMA],
  template:`<ng-select  appendTo="body" [items]="cities"
  bindLabel="name"
  placeholder="Select city"
  [(ngModel)]="selectedCity">
</ng-select>` 
})

export class selectComponent implements ICellRendererAngularComp {
cities = [
        {id: 1, name: 'Vilnius'},
        {id: 2, name: 'Kaunas'},
        {id: 3, name: 'Pavilnys', disabled: true},
        {id: 4, name: 'Pabradė'},
        {id: 1, name: 'Vilnius'},
        {id: 2, name: 'Kaunas'},
        {id: 3, name: 'Pavilnys', disabled: true},
        {id: 4, name: 'Pabradė'},
        {id: 1, name: 'Vilnius'},
        {id: 2, name: 'Kaunas'},
        {id: 3, name: 'Pavilnys', disabled: true},
        {id: 4, name: 'Pabradė'},
        {id: 1, name: 'Vilnius'},
        {id: 2, name: 'Kaunas'},
        {id: 3, name: 'Pavilnys', disabled: true},
        {id: 4, name: 'Pabradė'},
        {id: 1, name: 'Vilnius'},
        {id: 2, name: 'Kaunas'},
        {id: 3, name: 'Pavilnys', disabled: true},
        {id: 4, name: 'Pabradė'},
        {id: 1, name: 'Vilnius'},
        {id: 2, name: 'Kaunas'},
        {id: 3, name: 'Pavilnys', disabled: true},
        {id: 4, name: 'Pabradė'},
        {id: 1, name: 'Vilnius'},
        {id: 2, name: 'Kaunas'},
        {id: 3, name: 'Pavilnys', disabled: true},
        {id: 4, name: 'Pabradė'},
        {id: 1, name: 'Vilnius'},
        {id: 2, name: 'Kaunas'},
        {id: 3, name: 'Pavilnys', disabled: true},
        {id: 4, name: 'Pabradė'},
        {id: 1, name: 'Vilnius'},
        {id: 2, name: 'Kaunas'},
        {id: 3, name: 'Pavilnys', disabled: true},
        {id: 4, name: 'Pabradė'},
        {id: 1, name: 'Vilnius'},
        {id: 2, name: 'Kaunas'},
        {id: 3, name: 'Pavilnys', disabled: true},
        {id: 4, name: 'Pabradė'},
        {id: 1, name: 'Vilnius'},
        {id: 2, name: 'Kaunas'},
        {id: 3, name: 'Pavilnys', disabled: true},
        {id: 4, name: 'Pabradė'},
        {id: 1, name: 'Vilnius'},
        {id: 2, name: 'Kaunas'},
        {id: 3, name: 'Pavilnys', disabled: true},
        {id: 4, name: 'Pabradė'},
        {id: 1, name: 'Vilnius'},
        {id: 2, name: 'Kaunas'},
        {id: 3, name: 'Pavilnys', disabled: true},
        {id: 4, name: 'Pabradė'},
        {id: 1, name: 'Vilnius'},
        {id: 2, name: 'Kaunas'},
        {id: 3, name: 'Pavilnys', disabled: true},
        {id: 4, name: 'Pabradė'},
        {id: 1, name: 'Vilnius'},
        {id: 2, name: 'Kaunas'},
        {id: 3, name: 'Pavilnys', disabled: true},
        {id: 4, name: 'Pabradė'},
        {id: 1, name: 'Vilnius'},
        {id: 2, name: 'Kaunas'},
        {id: 3, name: 'Pavilnys', disabled: true},
        {id: 4, name: 'Pabradė'},
        {id: 1, name: 'Vilnius'},
        {id: 2, name: 'Kaunas'},
        {id: 3, name: 'Pavilnys', disabled: true},
        {id: 4, name: 'Pabradė'},
        {id: 1, name: 'Vilnius'},
        {id: 2, name: 'Kaunas'},
        {id: 3, name: 'Pavilnys', disabled: true},
        {id: 4, name: 'Pabradė'},
        {id: 1, name: 'Vilnius'},
        {id: 2, name: 'Kaunas'},
        {id: 3, name: 'Pavilnys', disabled: true},
        {id: 4, name: 'Pabradė'},
        {id: 1, name: 'Vilnius'},
        {id: 2, name: 'Kaunas'},
        {id: 3, name: 'Pavilnys', disabled: true},
        {id: 4, name: 'Pabradė'},
        {id: 1, name: 'Vilnius'},
        {id: 2, name: 'Kaunas'},
        {id: 3, name: 'Pavilnys', disabled: true},
        {id: 4, name: 'Pabradė'},
        {id: 5, name: 'Klaipėda'}
    ];

    selectedCity : any;
  params;
  label: string;

  agInit(params): void {
    this.params = params;
    this.label = this.params.label || null;
  }

  refresh(params?: any): boolean {
    return true;
  }

  onClick($event) {
    if (this.params.onClick instanceof Function) {
      // put anything into params u want pass into parents component
      const params = {
        event: $event,
        rowData: this.params.node.data
        // ...something
      }
      this.params.onClick(params);

    }
  }
}
