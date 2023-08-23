import { AbstractControl } from '@angular/forms'

export class SelectValidator {
    static select(control: AbstractControl): { [key: string]: boolean } | null {

        if (!Number(control.value)){
            return {select: true}
        }

       return null
    }
}