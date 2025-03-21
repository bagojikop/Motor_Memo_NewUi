declare global {
    interface Date {
      toShortString(format?: string): string;
    }
  }
  
  // Add the toShortString method to the Date prototype
  if (!Date.prototype.toShortString) {
    Date.prototype.toShortString = function (format: string = 'dd-MM-yyyy'): string {
      const pad = (num: number) => (num < 10 ? '0' + num : num.toString());
  
      const day = pad(this.getDate());
      const month = pad(this.getMonth() + 1); // Month is 0-indexed
      const year = this.getFullYear();
  
      return format
        .replace(/dd/g, day)
        .replace(/MM/g, month)
        .replace(/yyyy/g, year.toString());
    };
  }
  
  // Extend the String prototype to parse a date string and format it
  declare global {
    interface String {
      toShortString(format?: string): string | null;
    }
  }
  
  // Add the toShortString method to the String prototype
  if (!String.prototype.toShortString) {
    String.prototype.toShortString = function (format: string = 'dd-MM-yyyy'): string | null {
      const dateStr = this.toString(); // Convert the string to a regular string
      const parts = dateStr.split('-');
  
      if (parts.length !== 3) return null; // Ensure the format is correct
  
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
      const day = parseInt(parts[2], 10);
  
      const date = new Date(year, month, day); // Create Date object
      return date.toShortString(format); // Format the date using the Date prototype method
    };
  }
  
  export { };
  