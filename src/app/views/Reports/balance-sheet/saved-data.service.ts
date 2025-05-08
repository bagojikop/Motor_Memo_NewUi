import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SavedDataService {
  private storedDate: string | null = null;

  constructor() { }

  setSavedDate(date: string) {
    this.storedDate = date;
  }

  getSavedDate(): string | null {
    return this.storedDate;
  }

  clearSavedDate() {
    this.storedDate = null;
  }
}
