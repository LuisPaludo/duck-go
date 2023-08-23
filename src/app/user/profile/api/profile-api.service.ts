import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription, catchError, tap, throwError } from 'rxjs';
import { ApiService } from 'src/app/api/api.service';
import { User } from '../models/user';
import { Urls } from 'src/app/utils/urls';

@Injectable({
  providedIn: 'root',
})
export class ProfileApiService {

  private urls:Urls = new Urls();

  public userDataSubject = new BehaviorSubject<User>(null);
  public userData$ = this.userDataSubject.asObservable();

  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.isLoadingSubject.asObservable();

  public user: User = null;

  private isLoading = false;

  private userVerifiedSubscription: Subscription;

  constructor(private http: HttpClient, public api: ApiService) {}

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
      .get<User>(this.urls.userUrl, { headers: verifiedHttpHeaders })
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
