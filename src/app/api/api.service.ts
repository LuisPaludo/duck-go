import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import {
  BehaviorSubject,
  Observable,
  catchError,
  last,
  map,
  of,
  throwError,
} from 'rxjs';
import { Router } from '@angular/router';
import { UserDataApiService } from '../user/profile/data/api/user-data-api.service';
import { ProfileApiService } from '../user/profile/api/profile-api.service';
import { User } from '../user/profile/models/user';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  // verifyUrl: string = 'http://127.0.0.1:8000/accounts/token/verify/';
  // refreshUrl: string = 'http://127.0.0.1:8000/accounts/token/refresh/';
  // logoutUrl: string = 'http://127.0.0.1:8000/accounts/logout/';

  // httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  // private userVerified = new BehaviorSubject<boolean>(false);
  // private isAccessInProgress: boolean = false;
  // private isRefreshInProgress: boolean = false;
  // private logoutRequested: boolean = false;

  // private lastVerified: Date | null = null;
  // private cacheDuration: number = 0.9 * 60 * 1000; // 1 minutos
  // public user: User;

  // constructor(private http: HttpClient, private router: Router) {}

  // access(): void {
  //   if (this.isCacheStillValid()) {
  //     return;
  //   }

  //   if (this.isAccessInProgress) {
  //     console.error('Há uma verificação em andamento');
  //     return;
  //   }

  //   const accessToken: string = localStorage.getItem('token');
  //   if (!accessToken) {
  //     console.error('Não existem token armazenado no sistema');
  //     return;
  //   }

  //   this.isAccessInProgress = true;

  //   this.http
  //     .post(this.verifyUrl, accessToken, {
  //       headers: this.httpHeaders,
  //     })
  //     .subscribe({
  //       next: () => {
  //         console.info('Verificação feita com sucesso');
  //         this.lastVerified = new Date();
  //         this.isVerifiedTrue();
  //         this.isAccessInProgress = false;
  //         if (this.logoutRequested) {
  //           this.logout();
  //         }
  //       },
  //       error: (error) => {
  //         this.isAccessInProgress = false;
  //         if (error.status === 401 && !this.isRefreshInProgress) {
  //           console.error('Token não autenticado -> Chamando o refresh');
  //           this.isVerifiedFalse();
  //           this.refresh();
  //         } else {
  //           console.error('Token inválido e Refresh Token inválidos');
  //           this.isVerifiedFalse();
  //           this.router.navigate(['login']);
  //         }
  //       },
  //     });
  // }

  // refresh(): void {
  //   if (this.isRefreshInProgress) {
  //     console.error('Refresh já está em andamento');
  //     return;
  //   }

  //   const refreshToken: string = localStorage.getItem('refresh');

  //   if (!refreshToken) {
  //     this.isVerifiedFalse();
  //     console.error('Token de refresh não existe');
  //     return;
  //   }

  //   this.isRefreshInProgress = true;

  //   this.http
  //     .post(this.refreshUrl, refreshToken, {
  //       headers: this.httpHeaders,
  //     })
  //     .subscribe({
  //       next: (data: any) => {
  //         console.info('Refresh feito com sucesso');
  //         this.isRefreshInProgress = false;
  //         localStorage.setItem('token', JSON.stringify({ token: data.access }));
  //         this.isUserVerified();
  //       },
  //       error: (error) => {
  //         console.error('Refresh Token Inválido');
  //         this.isRefreshInProgress = false;
  //         this.isVerifiedFalse();
  //         this.router.navigate(['login']);
  //       },
  //     });
  // }

  // isUserVerified(): Observable<boolean> {
  //   if (this.isCacheStillValid()) {
  //     return of(true);
  //   } else {
  //     this.access();
  //     return this.userVerified.asObservable();
  //   }
  // }

  // isVerifiedTrue() {
  //   localStorage.setItem('isVerified', JSON.stringify({ isVerified: true }));
  //   this.userVerified.next(true);
  // }

  // isVerifiedFalse() {
  //   localStorage.setItem('isVerified', JSON.stringify({ isVerified: false }));
  //   this.userVerified.next(false);
  // }

  // performLogout(): void {
  //   let cache = this.isCacheStillValid();

  //   if (!cache) {
  //     console.error('Token inválido, logout cancelado.');
  //     return;
  //   }

  //   this.logoutRequested = false;

  //   const accessToken: string = JSON.parse(localStorage.getItem('token')).token;
  //   if (!accessToken) {
  //     console.error('Token de acesso inválido');
  //     return;
  //   }

  //   let VerifiedHttpHeaders = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     Authorization: 'Bearer ' + accessToken,
  //   });

  //   this.http
  //     .post(this.logoutUrl, '', { headers: VerifiedHttpHeaders })
  //     .subscribe({
  //       next: () => {
  //         console.info('Logout Realizado com suscesso');

  //         this.logoutRequested = false;
  //         this.isVerifiedFalse();
  //         localStorage.clear();
  //         this.router.navigate(['login']);
  //         this.lastVerified = null;
  //         this.user = null;
  //       },
  //       error: (error) => {
  //         console.error('Erro ao tentar fazer logout:', error);
  //       },
  //     });
  // }

  // logout(): void {
  //   if (this.isCacheStillValid()) {
  //     this.performLogout();
  //   } else {
  //     this.logoutRequested = true;
  //     this.isUserVerified().subscribe((isVerified) => {
  //       if (isVerified) {
  //         console.info('usuário verificado, chamando o logout');
  //         this.performLogout();
  //       } else {
  //         console.error('Não foi possível verificar o usuário');
  //       }
  //     });
  //   }
  // }

  // isCacheStillValid(): boolean {
  //   if (!this.lastVerified) {
  //     console.info('cache invalido');
  //     return false;
  //   }

  //   if (!localStorage.getItem('token')) {
  //     console.info('cache invalido');
  //     return false;
  //   }

  //   if (!localStorage.getItem('refresh')) {
  //     console.info('cache invalido');
  //     return false;
  //   }

  //   const now = new Date();
  //   const time_left = now.getTime() - this.lastVerified.getTime();

  //   console.info(
  //     'Duração do cache -> ' +
  //       this.cacheDuration +
  //       ' Falta -> ' +
  //       time_left +
  //       ' ? ' +
  //       (time_left <=
  //       this.cacheDuration)
  //   );
  //   return time_left <= this.cacheDuration;
  // }
}
