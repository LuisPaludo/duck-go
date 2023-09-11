import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Urls } from 'src/app/utils/urls';

@Injectable({
  providedIn: 'root',
})
export class LoginApiService {

  private urls: Urls = new Urls();

  httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

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
