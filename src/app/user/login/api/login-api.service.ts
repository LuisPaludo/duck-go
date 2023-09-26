import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Urls } from 'src/app/utils/urls';
/**
 * LoginApiService - Serviço para autenticação e gerenciamento de senha.
 *
 * Este serviço centraliza as chamadas de API relacionadas à autenticação, como login, reenvio de e-mail,
 * redefinição de senha e confirmação de redefinição de senha. Utiliza o HttpClient para fazer as requisições HTTP.
 *
 * Métodos:
 * Login(userData): Faz uma chamada à API para autenticar o usuário com e-mail e senha fornecidos.
 *
 * resendEmail(userData): Faz uma chamada à API para reenviar um e-mail de confirmação para o usuário.
 *
 * reset(userData): Faz uma chamada à API para iniciar o processo de redefinição de senha, enviando um e-mail ao usuário com instruções.
 *
 * resetConfirm(userData, uid, token): Faz uma chamada à API para confirmar e completar a redefinição de senha
 *   usando os dados fornecidos, incluindo a nova senha, repetição da senha, uid e token.
 *
 * Propriedades:
 * urls: Uma instância da classe Urls que mantém os URLs de endpoint para as chamadas de API.
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

  reset(userData): Observable<any> {
    const postData = {
      email: userData.email,
    };

    return this.http.post(this.urls.resetPassword, postData);
  }

  resetConfirm(userData, uid:string, token:string): Observable<any> {
    const postData = {
      new_password1: userData.new,
      new_password2: userData.repeat,
      uid: uid,
      token: token,
    };

    return this.http.post(this.urls.reserPasswordConfirm, postData);
  }
}
