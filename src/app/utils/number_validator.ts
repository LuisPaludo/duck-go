import { AbstractControl } from '@angular/forms'

export class NumberValidator {
    static number(control: AbstractControl): { [key: string]: boolean } | null {

        if (!Number(control.value)) {
            return { number: true }
        }

        return null
    }
}