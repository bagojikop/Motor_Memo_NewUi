import { Component, Input, Output,EventEmitter, OnInit, OnChanges, SimpleChanges, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, AfterViewInit, inject } from '@angular/core';
import { NavbarActions, UserPermissions } from '../../services/services';
import { MyProvider } from '../../services/provider';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({ 
   
  schemas:[CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA],
  imports:[FormsModule,CommonModule],
  selector: 'app-masternav',
  templateUrl: './masternav.component.html',
  styleUrls: ['./masternav.component.scss'],
})
export class MasternavComponent implements OnInit,AfterViewInit {
  isRcm:boolean=false;
  status: boolean = false;
  @Input() PrintPrv:boolean;
  @Input() title:string;
  @Input() isDoc:boolean=false;
  @Input() docInfo?:any={};
   
  @Output() myfn=new EventEmitter();
  @Output() document=new EventEmitter<any>();
  @Output() Rcm= new EventEmitter<boolean>()

    userAccess:any={};
    userAccessCtrl = inject(UserPermissions);

  constructor(public navactions:NavbarActions,private router:Router, public provider:MyProvider){ }

 
  ngOnInit(): void {
    if(this.router.url == "/purchaseinvoicechild")
    {
      this.isRcm=true;
    }
  }
  

  getisRCM(event)
  {
      this.Rcm.emit(event);
  }

  newRecord()
  {
    this.navactions.fieldset=false;
    this.navactions.new1=true;
    this.navactions.save1=false;
    this.navactions.edit1=true;
    this.navactions.print1=true;
    this.navactions.document1=true;
    this.navactions.undo1=false;
    this.myfn.emit('new');
  }

  
  ngAfterViewInit(): void {
    this.userAccess= this.userAccessCtrl.getInfo();
  }

  edit()
  {
    this.myfn.emit('edit');
    this.navactions.fieldset=false;
    this.navactions.save1 = false;
    this.navactions.print1 = true;
    this.navactions.edit1 = true;
    this.navactions.new1=true;
    this.navactions.undo1=false
    this.navactions.document1=false;
    this.navactions.isRcmDisabled=false;
  }

  documents(){
    this.navactions.save1 = false;
    this.myfn.emit('document') 
  }

  mainsave()
  {
    this.navactions.undo1=true;
    this.navactions.save1=true;
    this.navactions.edit1=false;
    this.navactions.print1=false;
    this.navactions.new1=false;
    this.navactions.document1=false;
    this.myfn.emit('save')
  }

  undo()
  {
    this.navactions.edit1=false;
    this.navactions.print1=true;
    this.navactions.new1=false;
    this.navactions.document1=true;
    this.navactions.undo1=true;
    this.navactions.fieldset=true;
    
    this.myfn.emit('undo'); 
  }

  close()
  {
    this.myfn.emit('close');
  }


  print()
  {
    this.myfn.emit('print');
  }
  docrec(index){
    this.document.emit(index)
  }
}
