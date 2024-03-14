import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

export class CredentialsValidators {
  public static emailValidator(email: FormControl): ValidationErrors | null {
    // Regular expression to match the email format
    const EMAIL_REGEXP = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/i;

    if (email && !EMAIL_REGEXP.test(email.value)) {
      return { invalidEmail: true };
    }

    return null;
  }

  public static passwordConfirmationValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const passwordValue = group.get('password')?.value;
      const confirmPasswordValue = group.get('confirmPassword')?.value;
      return confirmPasswordValue === '' ||
        passwordValue === confirmPasswordValue
        ? null
        : { passwordMismatch: true };
    };
  }
}
