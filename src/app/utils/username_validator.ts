import { AbstractControl } from '@angular/forms';

export class usernameValidator {
  static username(control: AbstractControl): { [key: string]: boolean } | null {
    var username:string = control.value;
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

    if (username.indexOf(' ') > 0 || specialChars.test(username)) {
      return { username: true };
    }

    return null;
  }
}
