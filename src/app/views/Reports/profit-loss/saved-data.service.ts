import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SavedDataService {
  private storedDate: string | null = null;
  private navigatedFromCellClick: boolean = false; // Flag for navigation source

  constructor() { }

  setSavedDate(date: string) {
    this.storedDate = date;
  }

  getSavedDate(): string | null {
    return this.storedDate;
  }

  setNavigatedFromCellClick(value: boolean): void {
    this.navigatedFromCellClick = value;
  }

  getNavigatedFromCellClick(): boolean {
    return this.navigatedFromCellClick;
  }

  clearSavedDate() {
    this.storedDate = null;
  }
}
