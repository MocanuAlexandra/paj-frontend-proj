import { FormControl, ValidationErrors } from '@angular/forms';

export class AddEditValidators {
  public static pagesValidator(pages: FormControl): ValidationErrors | null {
    if (pages?.value <= 0) {
      return { pagesMin: true };
    }
    return null;
  }

  public static ratingValidator(rating: FormControl): ValidationErrors | null {
    if (rating?.value <= 0) {
      return { invalidRating: true };
    }
    if (rating?.value > 5) {
      return { invalidRating: true };
    }
    return null;
  }

  public static dateValidator(date: FormControl): ValidationErrors | null {
    // Regular expression to match the date format
    const DATE_REGEXP = /^\d{4}-\d{2}-\d{2}$/;

    if (date && !DATE_REGEXP.test(date.value)) {
      return { invalidDate: true };
    }

    const [year, month, day] = date.value.split('-').map(Number);

    // Check if the month is valid
    if (month < 1 || month > 12) {
      return { invalidDate: true };
    }

    // Check if the day is valid for the given month and year
    const maxDays = new Date(year, month, 0).getDate();
    if (day < 1 || day > maxDays) {
      return { invalidDate: true };
    }

    return null;
  }
}
