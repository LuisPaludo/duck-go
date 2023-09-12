import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginApiService } from '../api/login-api.service';
import { Router } from '@angular/router';
/**
 * ResendEmailComponent - Componente responsável por gerenciar o reenvio de e-mails de confirmação.
 *
 * Propriedades:
 * - `resend`: FormGroup que contém os controles do formulário para reenviar o e-mail.
 * - `sendEmail`: Um sinalizador para verificar se o e-mail foi enviado.
 * - `resendIncorrect`: Um sinalizador para verificar se ocorreu um erro ao reenviar o e-mail.
 * - `resendSuccess`: Um sinalizador para verificar se o reenvio do e-mail foi bem-sucedido.
 * - `buttonSend`: Um sinalizador para desabilitar o botão de envio após o clique.
 * - `buttonBack`: Um sinalizador para desabilitar o botão de voltar após o clique.
 *
 * Métodos:
 * - `send()`: Chama o serviço `apiLogin` para reenviar o e-mail. Ele atualiza os sinalizadores com base na resposta da API.
 * - `redirect()`: Redireciona o usuário de volta para a página de login.
 *
 * Dependências:
 * - `formBuilder`: Serviço do Angular para criar formulários reativos.
 * - `apiLogin`: Serviço que facilita a comunicação com a API relacionada ao login e reenvio de e-mails.
 * - `router`: Serviço de roteamento do Angular para navegar entre componentes.
 *
 * O componente permite que os usuários que não confirmaram seu e-mail possam solicitar o reenvio do e-mail de confirmação.
 * O usuário fornece seu e-mail e, ao enviar o formulário, o componente interage com a API usando o serviço `apiLogin`.
 * Após o envio bem-sucedido, o usuário recebe feedback visual.
 */
@Component({
  selector: 'app-resend-email',
  templateUrl: './resend-email.component.html',
  styleUrls: ['./resend-email.component.css'],
})
export class ResendEmailComponent implements OnInit {
  resend!: FormGroup;

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
    this.resend = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  send() {
    if (this.resend?.valid) {
      this.buttonSend = true;
      this.buttonBack = true;
      this.apiLogin.resendEmail(this.resend.getRawValue()).subscribe({
        next: () => {
          this.resendSuccess = true;
          this.buttonBack = false;
        },
      });
    } else {
      this.resend.markAllAsTouched();
    }
  }

  redirect() {
    this.router.navigate(['/login']);
  }
}
