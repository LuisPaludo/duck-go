import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  Observable,
  ReplaySubject,
  catchError,
  of,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { Urls } from '../utils/urls';
/**
 * AuthenticationService - Serviço responsável por autenticar, gerenciar e validar tokens de usuários.
 *
 * Propriedades:
 * - `logoutInProgress` e `refreshTokenInProgress`: Indicadores para verificar se as operações de logout ou atualização de token estão em andamento.
 * - `refreshFailed`: Indicador para verificar se a operação de atualização de token falhou.
 * - `refreshTokenSubject`: Usado para armazenar o token atualizado e emitir quando concluído.
 * - `userAuthenticated`: Sinaliza se o usuário está autenticado.
 * - `currentToken`: Guarda o token atual do usuário.
 * - `isPartner`: Indica se o usuário é um parceiro.
 * - `isPartner$`: Observable do status de parceiro do usuário.
 * - `urls`: URLs utilizadas nas requisições HTTP.
 *
 * Métodos:
 * - `verifyToken(accessToken: string)`: Verifica a validade do token fornecido contra um endpoint.
 * - `refreshToken()`: Solicita um novo token de acesso usando o token de atualização armazenado. Se a operação de atualização já estiver em andamento,
 *    retorna um observable do token atualizado.
 * - `storeTokens(tokens: any)`: Armazena tokens no armazenamento local e atualiza o token atual.
 * - `isAuthenticated`: Verifica se o usuário está autenticado com base na validade do token atual.
 * - `logout()`: Realiza logout do usuário, limpando o armazenamento local e reiniciando as variáveis de estado.
 * - `localLogout()`: Realiza logout local sem chamar o endpoint de logout.
 *
 * O principal objetivo deste serviço é fornecer funcionalidades de autenticação, como login, logout, verificação e atualização de token.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private logoutInProgress: boolean = false;
  public refreshTokenInProgress: boolean = false;
  public refreshFailed = false;

  private refreshTokenSubject: ReplaySubject<any> = new ReplaySubject(1);
  public userAuthenticated: ReplaySubject<boolean> = new ReplaySubject<boolean>(
    1
  );

  public currentToken: BehaviorSubject<string | null> = new BehaviorSubject<
    string | null
  >(localStorage.getItem('token'));

  public isPartner: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);
  public isPartner$ = this.isPartner.asObservable();

  private urls: Urls = new Urls();

  constructor(private http: HttpClient, private router: Router) {}

  verifyToken(accessToken: string): Observable<any> {
    const postData = {
      token: accessToken,
    };
    return this.http.post(this.urls.verify, postData);
  }

  refreshToken(): Observable<any> {
    if (!this.refreshTokenInProgress) {
      this.refreshTokenInProgress = true;

      const refreshToken: string = localStorage.getItem('refresh');
      const postData = {
        refresh: refreshToken,
      };
      return this.http.post(this.urls.refresh, postData).pipe(
        tap((tokens) => {
          this.storeTokens(tokens);
          this.refreshTokenSubject.next(tokens);
          this.refreshTokenInProgress = false;
          this.refreshFailed = false;
        }),
        catchError((error) => {
          this.refreshTokenInProgress = false;
          this.localLogout();
          return throwError(() => error);
        })
      );
    } else {
      return this.refreshTokenSubject.asObservable();
    }
  }

  private storeTokens(tokens: any) {
    localStorage.setItem('token', tokens.access);
    this.currentToken.next(tokens.access);
  }

  get isAuthenticated(): Observable<boolean> {
    return this.currentToken.pipe(
      switchMap((token) => {
        if (token) {
          return this.verifyToken(token);
        }
        return of(false);
      }),
      catchError((e) => {
        if (e.status === 401) {
          return of(false);
        } else {
          return of(true);
        }
      })
    );
  }

  logout(): void {
    if (this.logoutInProgress) {
      return;
    }
    this.logoutInProgress = true;

    this.http.post(this.urls.logout, '').subscribe({
      next: () => {
        localStorage.clear();
        this.currentToken.next(null);
        this.logoutInProgress = false;
        this.userAuthenticated.next(false);
        this.isPartner.next(false);
        this.router.navigate(['']);
      },
      error: (e) => {
        console.log('erro no logout');
      },
    });
  }

  localLogout(): void {
    localStorage.clear();
    this.currentToken.next(null);
    this.logoutInProgress = false;
    this.userAuthenticated.next(false);
    this.isPartner.next(false);
    this.router.navigate(['']);
  }
}
