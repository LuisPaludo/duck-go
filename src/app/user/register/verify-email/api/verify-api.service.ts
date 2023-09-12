import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Urls } from 'src/app/utils/urls';
/**
 * VerifyApiService
 *
 * Serviço Angular para gerenciar a verificação de e-mails.
 *
 * Propriedades:
 * - urls: Instância da classe 'Urls' que contém endereços URL de endpoints da API.
 *
 * Métodos:
 * - constructor(http: HttpClient): Inicializa o serviço com acesso ao cliente HTTP do Angular.
 *
 * - verify(verificationKey: string): Observable<any>
 *     Realiza uma chamada HTTP POST para verificar um e-mail usando uma chave de verificação.
 *     Entrada: verificationKey - Chave utilizada para verificar a autenticidade do endereço de e-mail.
 *     Saída: Um Observable que emite a resposta da chamada de API.
 *
 * Observação:
 * Este serviço é responsável por interagir com uma API externa para confirmar a autenticidade
 * de endereços de e-mail com base em chaves de verificação fornecidas.
 */
@Injectable({
  providedIn: 'root',
})
export class VerifyApiService {
  private urls: Urls = new Urls();

  constructor(private http: HttpClient) {}

  verify(verificationKey: string): Observable<any> {
    const postData = {
      key: verificationKey,
    };

    return this.http.post(this.urls.verifyEmail, postData);
  }
}
