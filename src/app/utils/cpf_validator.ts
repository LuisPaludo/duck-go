import {AbstractControl} from '@angular/forms'

export class CpfValidator {
    static cpf(control: AbstractControl): {[key: string]:boolean} | null {
        if (!control.value) {
            return null;
        }

        var cpf: string = control.value.replace(/\./g, '').replace(/\-/g, '');        
        const cpfLength:number = cpf.length;     
        

        if (!Number(cpf) || cpfLength != 11){
            return { cpf: true };
        }

        const cpfArray = cpf.split('');
        const cpfArrayAux = cpfArray.slice(0,9);

        var c1:number = 0;
        var c2:number = 0;
        var cont:number = 11;

        var dig1:number = 0;
        var dig2:number = 0;

        for(let number in cpfArrayAux){
            c1 = c1 + Number(cpfArrayAux[number])*(cont-1);
            c2 = c2 + Number(cpfArrayAux[number])*cont;
            cont -= 1;
        }

        c2 = c2 + 2*Number(cpfArray[9]);

        if(c1%11 < 2){
            dig1 = 0;
        } 
        else{
            dig1 = 11 - c1%11;
        }

        if (c2 % 11 < 2) {
            dig2 = 0;
        }
        else {
            dig2 = 11 - c2 % 11;
        }

        if (dig1 != Number(cpfArray[9]) || dig2 != Number(cpfArray[10])){
            return { cpf: true };
        }
    }
}