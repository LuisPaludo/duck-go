import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Urls } from 'src/app/utils/urls';
/**
 * LoginApiService - Serviço Angular que facilita a comunicação com a API relacionada ao login e reenvio de e-mails.
 *
 * Métodos:
 * - `Login(userData)`: Realiza uma solicitação POST para a API para autenticar o usuário com os dados fornecidos.
 * - `resendEmail(userData)`: Realiza uma solicitação POST para a API para reenviar o e-mail de verificação com base no e-mail fornecido.
 *
 * Dependências:
 * - `http`: Cliente HTTP do Angular utilizado para fazer solicitações à API.
 *
 * Este serviço centraliza a lógica de chamada à API relacionada ao login e ao reenvio de e-mails de confirmação.
 */
@Injectable({
  providedIn: 'root',
})
export class LoginApiService {
  private urls: Urls = new Urls();

  constructor(private http: HttpClient) {}

  Login(userData): Observable<any> {
    const postData = {
      username: '',
      email: userData.email,
      password: userData.senha,
    };

    return this.http.post(this.urls.login, postData);
  }

  resendEmail(userData): Observable<any> {
    const postData = {
      email: userData.email,
    };

    return this.http.post(this.urls.resend, postData);
  }
}
