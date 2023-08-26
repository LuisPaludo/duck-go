import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phone',
})
export class PhonePipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    if (!value) {
      return value;
    }

    let formatted = value;

    if (value.length === 10) {
      // Formato para (XXX) XXX-XXXX
      formatted = `(${value.substr(0, 3)}) ${value.substr(3, 3)}-${value.substr(
        6
      )}`;
    } else if (value.length === 11) {
      // Formato para (XX) XXXXX-XXXX
      formatted = `(${value.substr(0, 2)}) ${value.substr(2, 5)}-${value.substr(
        7
      )}`;
    }

    return formatted;
  }
}
