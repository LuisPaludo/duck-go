import { AbstractControl } from '@angular/forms'

export class CepValidator {
    static cep(control: AbstractControl): { [key: string]: boolean } | null {
        
        var cep: string = control.value.replace(/\./g, '').replace(/\-/g, '');   

        if(cep.length != 8){
            return { cep : true}
        }

        return null
    }
}