import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  Observable,
  ReplaySubject,
  catchError,
  map,
  of,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { Urls } from '../utils/urls';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  // Flag de chamada do logout
  private logoutInProgress: boolean = false;
  // Flag de chamada do refresh
  public refreshTokenInProgress: boolean = false;
  // Flag de indentificação de falha no refresh
  public refreshFailed = false;

  // Um ReplaySubject que irá lembrar e emitir o último valor (neste caso, o token) para qualquer
  // novo observador que se inscrever. Ele é usado principalmente para lidar com atualizações simultâneas de token.
  private refreshTokenSubject: ReplaySubject<any> = new ReplaySubject(1);
  // Um ReplaySubject que informa se o usuário está ou não autenticado.
  public userAuthenticated: ReplaySubject<boolean> = new ReplaySubject<boolean>(
    1
  );

  // Um BehaviorSubject que armazena o token atual do usuário. Ele inicializa com o token armazenado no localStorage.
  public currentToken: BehaviorSubject<string | null> = new BehaviorSubject<
    string | null
  >(localStorage.getItem('token'));

  // Outro ReplaySubject que informa se o usuário é ou não um "parceiro".
  public isPartner: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);
  public isPartner$ = this.isPartner.asObservable();

  // Intância da classe de cosntantes Urls
  private urls: Urls = new Urls();

  // O construtor inicializa uma instância de HttpClient para fazer chamadas à API e Router para navegação.
  constructor(private http: HttpClient, private router: Router) {}

  // Aceita um accessToken como argumento
  verifyToken(accessToken: string): Observable<any> {
    // Cria um objeto com o token e faz uma chamada POST para verificar o token.
    const postData = {
      token: accessToken,
    };
    // Retorna um Observable da resposta
    return this.http.post(this.urls.verify, postData);
  }

  refreshToken(): Observable<any> {
    // Se o processo de atualização de token não estiver em andamento, ele inicia o processo.
    if (!this.refreshTokenInProgress) {
      // Seta a Flag de chamda do refresh
      this.refreshTokenInProgress = true;

      // Pega o token de atualização do localStorage
      const refreshToken: string = localStorage.getItem('refresh');
      // Cria um objeto
      const postData = {
        refresh: refreshToken,
      };
      // Faz uma chamada POST para atualizar o token.
      return this.http.post(this.urls.refresh, postData).pipe(
        // Se a chamada for bem-sucedida, ele armazena o novo token e notifica os observadores. Se falhar, ele faz logout local.
        // tap é usado para armazenar tokens e atualizar algumas propriedades após uma chamada HTTP bem-sucedida.
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
      // Se a atualização do token já estiver em andamento, ele apenas retorna o refreshTokenSubject.
      return this.refreshTokenSubject.asObservable();
    }
  }

  // Armazena tokens no localStorage e atualiza o BehaviorSubject currentToken.
  private storeTokens(tokens: any) {
    localStorage.setItem('token', tokens.access);
    // Notifique os observadores sobre o novo token
    this.currentToken.next(tokens.access);
  }

  // Verifica se o usuário está autenticado com base no token atual.
  // Quando você tenta acessar isAuthenticated, em vez de simplesmente retornar
  //  um valor de propriedade, o código dentro do método getter é executado e o valor resultante é retornado
  get isAuthenticated(): Observable<boolean> {
    return this.currentToken.pipe(
      // switchMap é usado para mudar de um fluxo que emite tokens para um fluxo que faz chamadas HTTP baseadas nesses token
      switchMap((token) => {
        // Se o token existir, ele tenta verificar o token.
        if (token) {
          return this.verifyToken(token);
        }
        // Caso contrário, ele retorna false.
        return of(false);
      }),
      catchError((e) => {
        // Se a verificação falhar com erro 401, ele retorna false
        if (e.status === 401) {
          return of(false);
        } else {
          return of(true);
        }
      })
    );
  }

  logout(): void {
    // Se o processo de logout não estiver em andamento, ele inicia o processo.
    if (this.logoutInProgress) {
      return;
    }
    this.logoutInProgress = true;

    // Faz uma chamada POST para a API de logout.
    this.http.post(this.urls.logout, '').subscribe({
      next: () => {
        // Limpa o localStorage, atualiza os observadores e navega para a rota raiz.
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

  // Um método auxiliar para fazer logout localmente, sem fazer uma chamada à API.
  // Limpa o localStorage, atualiza os observadores e navega para a rota raiz.
  localLogout(): void {
    localStorage.clear();
    this.currentToken.next(null);
    this.logoutInProgress = false;
    this.userAuthenticated.next(false);
    this.isPartner.next(false);
    this.router.navigate(['']);
  }
}
