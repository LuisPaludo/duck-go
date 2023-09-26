import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { passwordValidator } from 'src/app/utils/password_validator';
import { LoginApiService } from '../../api/login-api.service';
/**
 * ConfirmComponent - Componente para redefinição de senha
 *
 * Este componente é responsável pela confirmação e redefinição da senha do usuário
 * através de um token e ID codificado em base64 recebidos pela URL.
 *
 * Métodos:
 * ngOnInit(): Este método é invocado automaticamente quando o componente é inicializado.
 *   Ele decodifica o ID do usuário e o token da URL, e inicializa o formulário para a redefinição de senha.
 *
 * resetConfirm(): É chamado quando o usuário tenta confirmar a redefinição de senha.
 *   Se o formulário for válido, ele chama a API para redefinir a senha.
 *   Dependendo da resposta da API, ele atualiza as variáveis `success` e `hasError` para refletir o status da operação.
 *
 * Propriedades:
 * uidb64: Armazena o ID do usuário decodificado.
 * token: Armazena o token recebido pela URL.
 * hasError: Indica se ocorreu um erro ao tentar redefinir a senha.
 * changing: Indica se a senha está em processo de redefinição.
 * success: Indica se a senha foi redefinida com sucesso.
 * form: É o FormGroup que representa o formulário de redefinição de senha.
 */
@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css'],
})
export class ConfirmComponent implements OnInit {
  uidb64: string;
  token: string;
  hasError: boolean = false;
  changing: boolean = false;
  success:boolean = false;

  form!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private apiLogin: LoginApiService
  ) {}

  ngOnInit(): void {
    this.uidb64 = atob(this.route.snapshot.paramMap.get('uidb64'));
    this.token = this.route.snapshot.paramMap.get('token');

    this.form = this.formBuilder.group({
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
  }

  resetConfirm(): void {
    if (this.form.valid) {
      this.changing = true;
      this.apiLogin
        .resetConfirm(this.form.getRawValue(), this.uidb64, this.token)
        .subscribe({
          next: (data) => {
            this.success = true;
          },
          error: (e) => {
            this.changing = false;
            this.hasError = true;
          },
        });
    }
  }
}
