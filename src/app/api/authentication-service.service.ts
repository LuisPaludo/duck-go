import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, ReplaySubject, catchError, map, of, switchMap, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private logoutInProgress: boolean = false;
  private verificationInProgress: boolean = false;
  public refreshTokenInProgress: boolean = false;
  public refreshFailed = false;
  private refreshTokenSubject: ReplaySubject<any> = new ReplaySubject(1);

  public userAuthenticated: ReplaySubject<boolean> =
    new ReplaySubject<boolean>(1);
  public currentToken: BehaviorSubject<string | null> = new BehaviorSubject<
    string | null
  >(localStorage.getItem('token'));

  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  private verifyUrl: string = 'http://127.0.0.1:8000/accounts/token/verify/';
  private refreshUrl: string = 'http://127.0.0.1:8000/accounts/token/refresh/';
  private logoutUrl: string = 'http://127.0.0.1:8000/accounts/logout/';

  constructor(private http: HttpClient, private router: Router) {}

  verifyToken(accessToken: string): Observable<any> {

    const postData = {
      token: accessToken,
    };

    return this.http.post(this.verifyUrl, postData, {
      headers: this.httpHeaders,
    });
  }

  refreshToken(): Observable<any> {
    if (!this.refreshTokenInProgress) {
      this.refreshTokenInProgress = true;
      const refreshToken: string = localStorage.getItem('refresh');

      const postData = {
        refresh: refreshToken,
      };
      console.log('Tentou dar refresh')
      return this.http
        .post(this.refreshUrl, postData, {
          headers: this.httpHeaders,
        })
        .pipe(
          tap((tokens) => {
            this.storeTokens(tokens);
            this.refreshTokenSubject.next(tokens);
            this.refreshTokenInProgress = false;
            this.refreshFailed = false;
          }),
          catchError((error) => {
            this.refreshTokenInProgress = false;
            console.log('Caiu aqui')
            this.localLogout();
            return throwError(() => error)
          })
        );
    } else {
      return this.refreshTokenSubject.asObservable();
    }
  }

  private storeTokens(tokens: any) {
    localStorage.setItem('token', tokens.access);
    this.currentToken.next(tokens.access); // Notifique os observadores sobre o novo token
  }

  get isAuthenticated(): Observable<boolean> {
    return this.currentToken.pipe(
      switchMap((token) => {
        if (token) {
          return this.verifyToken(token);
        }
        return of(false);
      }),
      catchError(() => of(false))
    );
  }

  logout(): void {
    if (this.logoutInProgress) {
      return;
    }
    this.logoutInProgress = true;

    this.http
      .post(this.logoutUrl, '', {
        headers: this.httpHeaders,
      })
      .subscribe({
        next: () => {
          localStorage.clear();
          this.currentToken.next(null);
          this.logoutInProgress = false;
          this.userAuthenticated.next(false);
          this.router.navigate(['']);
        },
        error: (e) => {
          console.log('erro no logout')
        },
      });
  }

  localLogout():void {
    localStorage.clear();
    this.currentToken.next(null);
    this.logoutInProgress = false;
    this.userAuthenticated.next(false);
    this.router.navigate(['']);
  }
}
