import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VerifyApiService } from './api/verify-api.service';
/**
 * VerifyEmailComponent
 *
 * Componente responsável por verificar a validade de uma chave de confirmação de e-mail.
 *
 * Propriedades:
 * - isLoading: Indica se a verificação está em andamento. Inicialmente definido como 'true'.
 * - hasError: Indica se ocorreu um erro durante a verificação. Inicialmente definido como 'false'.
 *
 * Métodos:
 * - constructor(activeRout: ActivatedRoute, verifyApi: VerifyApiService):
 *     Inicializa o componente com acesso ao roteamento ativo (para ler parâmetros da URL)
 *     e ao serviço VerifyApiService (para realizar a chamada de API para verificação).
 *
 * - ngOnInit(): Método de ciclo de vida do Angular chamado após a criação do componente.
 *     1. Lê a chave de verificação da URL.
 *     2. Faz uma chamada ao serviço VerifyApiService para verificar a chave.
 *     3. Atualiza as propriedades isLoading e hasError com base na resposta da API.
 *
 * Observação:
 * Este componente é utilizado para tratar situações em que o usuário clica em um link de confirmação enviado
 * ao seu e-mail para verificar a autenticidade do endereço de e-mail fornecido.
 */
@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css'],
})
export class VerifyEmailComponent implements OnInit {
  isLoading: boolean = true;
  hasError: boolean = false;

  constructor(
    private activeRout: ActivatedRoute,
    private verifyApi: VerifyApiService
  ) {}

  ngOnInit(): void {
    const key = this.activeRout.snapshot.params['key'];

    this.verifyApi.verify(key).subscribe({
      next: () => {
        this.isLoading = false;
      },
      error: (e) => {
        this.isLoading = false;
        this.hasError = true;
      },
    });
  }
}
