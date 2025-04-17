/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

(window as any).pdfWorkerSrc = '/pdfjs-dist/build/pdf.worker.min.mjs'

 
bootstrapApplication(AppComponent, appConfig)
  .catch(err => console.error(err));

