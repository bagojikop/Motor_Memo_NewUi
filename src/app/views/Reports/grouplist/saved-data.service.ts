import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SavedDataService {
  private storedData: any = null; 
  private navigatedFromCellClick: boolean = false;


  constructor() {}

  // Method to store data
  setData(data: any) {
    this.storedData = data;
  }

  // Method to retrieve stored data
  getData() {
    return this.storedData;
  }
  setNavigatedFromCellClick(value: boolean): void {
    this.navigatedFromCellClick = value;
  }

  getNavigatedFromCellClick(): boolean {
    return this.navigatedFromCellClick;
  }

  // Method to clear stored data when necessary
  clearData() {
    this.storedData = null;
  }
}
