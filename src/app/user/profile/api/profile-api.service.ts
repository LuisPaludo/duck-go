import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  Subscription,
  catchError,
  tap,
  throwError,
} from 'rxjs';
import { User } from '../models/user';
import { Urls } from 'src/app/utils/urls';
/**
 * ProfileApiService - Serviço que gerencia a comunicação entre o frontend e a API para informações do perfil do usuário.
 *
 * Propriedades:
 * - `userDataSubject`: Um `BehaviorSubject` que mantém o estado atual dos dados do usuário.
 * - `userData$`: Um `Observable` que expõe os dados do usuário.
 * - `isLoadingSubject`: Um `BehaviorSubject` que mantém o estado atual do carregamento.
 * - `isLoading$`: Um `Observable` que expõe o estado do carregamento.
 * - `user`: Uma propriedade que contém a instância atual do usuário.
 * - `loading`: Um indicador booleano para controlar o estado de carregamento.
 * - `userVerifiedSubscription`: Uma assinatura para acompanhar o estado de verificação do usuário.
 *
 * Métodos:
 * - `getUser()`: Busca informações do usuário atual autenticado.
 *                Este método só pode ser chamado se uma requisição anterior não estiver em andamento.
 *                Caso contrário, lança um erro.
 * - `destroy()`: Desinscreve-se da assinatura `userVerifiedSubscription` para evitar vazamentos de memória.
 *
 * Dependências:
 * - `http`: Serviço Angular para realizar solicitações HTTP.
 *
 * O `ProfileApiService` é essencial para gerenciar informações relacionadas ao perfil do usuário, como a aquisição de dados do usuário.
 * Ele também mantém um estado local dos dados do usuário e o estado de carregamento, que pode ser observado em outros lugares da aplicação.
 */
@Injectable({
  providedIn: 'root',
})
export class ProfileApiService {
  private urls: Urls = new Urls();

  public userDataSubject = new BehaviorSubject<User>(null);
  public userData$ = this.userDataSubject.asObservable();

  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.isLoadingSubject.asObservable();

  public user: User = null;

  public loading = false;

  private userVerifiedSubscription: Subscription;

  constructor(private http: HttpClient) {}

  getUser(): Observable<User> {
    if (this.isLoadingSubject.value) {
      return throwError(() =>
        console.error('Aquisição de dados do usuário em andamento')
      );
    }

    const accessToken: string = localStorage.getItem('token');
    const verifiedHttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + accessToken,
    });

    this.isLoadingSubject.next(true);

    return this.http
      .get<User>(this.urls.user, { headers: verifiedHttpHeaders })
      .pipe(
        tap((user) => {
          this.userDataSubject.next(user);
          this.isLoadingSubject.next(false);
          this.user = user;
        }),
        catchError((error) => {
          this.isLoadingSubject.next(false);
          return throwError(() => error);
        })
      );
  }

  destroy() {
    if (this.userVerifiedSubscription) {
      this.userVerifiedSubscription.unsubscribe();
    }
  }
}
