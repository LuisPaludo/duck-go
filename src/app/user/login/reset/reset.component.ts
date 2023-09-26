import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginApiService } from '../api/login-api.service';
import { Router } from '@angular/router';
/**
 * ResetComponent - Componente  para redefinição de senha
 *
 * Este componente é responsável por fornecer a funcionalidade de reset de senha para os usuários.
 * Permite que os usuários insiram seu e-mail e recebam um link para redefinir sua senha.
 *
 * Métodos:
 * ngOnInit(): Invocado quando o componente é inicializado. Ele define e inicializa o formulário para inserir o e-mail.
 *
 * redirect(): Navega o usuário de volta para a página de login.
 *
 * send(): É chamado quando o usuário tenta enviar o e-mail para redefinição de senha.
 *   Se o e-mail for válido, faz uma chamada API para enviar o e-mail de redefinição. Atualiza as variáveis
 *   de estado de acordo com o sucesso ou fracasso da chamada.
 *
 * Propriedades:
 * reset: Representa o formulário para inserção do e-mail.
 * sendEmail: Indica se o e-mail de redefinição foi enviado.
 * resendIncorrect: Indica se ocorreu um erro ao tentar reenviar o e-mail.
 * resendSuccess: Indica se o e-mail foi reenviado com sucesso.
 * buttonSend: Indica se o botão de enviar está ativo.
 * buttonBack: Indica se o botão de voltar está ativo.
 */
@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css'],
})
export class ResetComponent implements OnInit {
  reset!: FormGroup;

  sendEmail: boolean = false;
  resendIncorrect: boolean = false;
  resendSuccess: boolean = false;
  buttonSend: boolean = false;
  buttonBack: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private apiLogin: LoginApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.reset = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  redirect() {
    this.router.navigate(['/login']);
  }

  send() {
    if (this.reset?.valid) {
      this.buttonSend = true;
      this.buttonBack = true;
      this.apiLogin.reset(this.reset.getRawValue()).subscribe({
        next: () => {
          this.resendSuccess = true;
          this.buttonBack = false;
        },
      });
    } else {
      this.reset.markAllAsTouched();
    }
  }
}
