import { AbstractControl } from '@angular/forms';

export class MinOneWeek {
  static minOneWeek(control: AbstractControl): { [key: string]: boolean } | null {
    if (!control.value) {
      return null
    }

    const inputDate = new Date(control.value);
    const currentDate = new Date();
    const oneWeekLater = new Date(
      currentDate.setDate(currentDate.getDate() + 6)
    );

    const isValid = inputDate >= oneWeekLater;

    if(!isValid) {
      return { minOneWeek: true};
    }

    return null;
  }
}
