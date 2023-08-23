import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginApiService {
  loginUrl: string = 'http://127.0.0.1:8000/accounts/login/';
  resendUrl: string =
    'http://127.0.0.1:8000/accounts/registration/resend-email/';

  httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) {}

  Login(userData): Observable<any> {
    const postData = {
      username: '',
      email: userData.email,
      password: userData.senha,
    };

    return this.http.post(this.loginUrl, postData, {
      headers: this.httpHeaders,
    });
  }

  resendEmail(userData): Observable<any> {
    const postData = {
      email: userData.email,
    };

    return this.http.post(this.resendUrl, postData, {
      headers: this.httpHeaders,
    });
  }
}
