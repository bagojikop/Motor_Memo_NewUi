import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { MyProvider } from '../../services/provider';


@Component({
  standalone:true,
  selector: 'app-dialogs',
  template: ''
})

export class DialogsComponent implements OnInit {

  constructor(public router: Router, public provider: MyProvider) { }

  ngOnInit() {
  }

  async swal(param: any) {

    switch (param.dialog) {
      case 'confirm':
        return new Promise((resolve, reject) => {
          Swal.fire({
            title: param.title,
            text: param.message,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'

          }).then(res => {
            resolve(res.value);
          })


        })
        break;

      case 'success':
        return new Promise((resolve, reject) => {
          Swal.fire({
            title: param.title,
            text: param.message,
            icon: 'success',
            showCancelButton: false,
            showConfirmButton: false
          }).then(res => {
            resolve(res.value);
          })

          setTimeout(() => {
            Swal.close();
          }, 2000);
        })
        break;




      case 'error':
        return new Promise((resolve, reject) => {
          Swal.fire({
            title: param.title,
            text: param.message,
            icon: 'error',
          }).then(res => {
            resolve(res.value);
          })
        })

        break;

      case 'Warning':
        return new Promise((resolve, reject) => {
          Swal.fire({
            title: param.title,
            text: param.message,
            icon: 'warning',
          }).then(res => {
            resolve(res.value);
          })
        })
        break;


      default:

    }
  }




}
