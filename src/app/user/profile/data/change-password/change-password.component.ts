import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { passwordValidator } from 'src/app/utils/password_validator';
import { UserDataApiService } from '../api/user-data-api.service';
import { HttpErrorResponse } from '@angular/common/http';
/**
 * ChangePasswordComponent
 *
 * Este componente permite que os usuários alterem sua senha atual.
 *
 * Métodos:
 * 1. ngOnInit(): É o método de inicialização do ciclo de vida do componente.
 *    Aqui, o formulário 'change' é inicializado com validações necessárias.
 *
 * 2. cancel(): Navega o usuário de volta para a tela 'perfil/dados'.
 *
 * 3. changePassword(): Aciona o serviço de API para alterar a senha do usuário.
 *    Se o pedido for bem-sucedido, ele limpa o formulário.
 *    Se houver erros na resposta, ele verifica se os erros estão relacionados
 *    à nova senha sendo igual à antiga ou à senha antiga sendo incorreta.
 *
 * 4. subscribeForms(): Adiciona um observador para o campo 'repeat' do formulário.
 *    Verifica se o valor deste campo é igual ao campo 'new' e define um erro
 *    se eles não forem iguais.
 *
 * Propriedades:
 * - change: FormGroup que representa o formulário de alteração de senha.
 * - changing: Um booleano que indica se uma operação de mudança de senha está em andamento.
 * - samePassword: Um booleano que indica se a nova senha é a mesma que a senha antiga.
 * - oldIncorrect: Um booleano que indica se a senha antiga fornecida é incorreta.
 * - success: Um booleano que indica se a operação de mudança de senha foi bem-sucedida.
 */
@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
})
export class ChangePasswordComponent implements OnInit {
  change!: FormGroup;
  changing: boolean = false;
  samePassword: boolean = false;
  oldIncorrect: boolean = false;
  success:boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private apiUserData: UserDataApiService
  ) {}

  ngOnInit(): void {
    this.change = this.formBuilder.group({
      old: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
          passwordValidator.password,
        ],
      ],
      new: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
          passwordValidator.password,
        ],
      ],
      repeat: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
          passwordValidator.password,
        ],
      ],
    });

    this.subscribeForms();
  }

  cancel(): void {
    this.router.navigate(['perfil/dados']);
  }

  changePassword(): void {
    if (this.change.valid) {
      this.oldIncorrect = false;
      this.samePassword = false;
      this.changing = true;
      this.apiUserData.changePassword(this.change.getRawValue()).subscribe({
        next: (data) => {
          this.change.get('old')?.setValue('');
          this.change.get('new')?.setValue('');
          this.change.get('repeat')?.setValue('');
          this.changing = false;
          this.success = true;
          this.samePassword = false;
          this.oldIncorrect = false;
        },
        error: (e) => {
          if (e instanceof HttpErrorResponse) {
            if (e.status === 400) {
              const errors = e.error;
              this.change.get('old')?.setValue('');
              this.change.get('new')?.setValue('');
              this.change.get('repeat')?.setValue('');
              if (errors.new_password1) {
                this.samePassword = true;
              }
              if (errors.old_password) {
                this.oldIncorrect = true;
              }
            }
          }
          this.changing = false;
        },
      });
    } else {
      this.change.markAllAsTouched();
    }
  }

  subscribeForms(): void {
    this.change.get('repeat')?.valueChanges.subscribe((valor) => {
      let senha = this.change.get('new').value;
      if (valor != senha) {
        this.change.get('repeat')?.setErrors({ incorrect: true });
        return;
      }
    });
  }
}
