import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Urls } from 'src/app/utils/urls';

@Injectable({
  providedIn: 'root',
})
export class VerifyApiService {

  private urls: Urls = new Urls();

  constructor(private http: HttpClient) {}

  verify(verificationKey: string): Observable<any> {
    const postData = {
      key: verificationKey,
    };

    return this.http.post(this.urls.verifyEmailUrl, postData);
  }
}
