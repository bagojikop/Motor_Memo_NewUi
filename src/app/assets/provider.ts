
import { HttpClient } from '@angular/common/http';
import { Injectable,OnInit } from '@angular/core';


@Injectable({
  providedIn: 'root'
})

export class MyProvider implements OnInit {
  server;
  serverapi;
  reportserver;
  token;
  companyinfo: any = {
    company: {firmStateCode:27,gstur:0},
    accounts: [],
    branches: [],
    finyear:{},
    user:{},
    userinfo: {},
    modules:{},
    settings:[],
    database:'motormemo.db',
    id:null
  };



  ShareData: any = {
    audit: {}
  };

  constructor(private http: HttpClient) { 
   
  }
  
  ngOnInit(): void {
    this.http.get('assets/app-config.json').subscribe({
      next: (config:any) => {
        this.token = config.tokenapi;
        this.server = config.api;
        this.serverapi = this.server;
        this.reportserver = config.ssrs + "/";
      }, error: err => {
        alert("Something Went wrong");
      }
    });
  }
  

   setConfig() {
    
  } 
}

