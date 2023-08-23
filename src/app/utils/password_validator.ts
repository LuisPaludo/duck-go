import { AbstractControl } from '@angular/forms';

export class passwordValidator {
  static password(control: AbstractControl): { [key: string]: boolean } | null {
    var password: string = control.value;
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

    if (password.indexOf(' ') > 0 || !specialChars.test(password) || password.length < 8 ) {
      return { username: true };
    }

    return null;
  }
}
