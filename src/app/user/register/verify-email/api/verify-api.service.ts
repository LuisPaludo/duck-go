import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VerifyApiService {
  verifyUrl: string =
    'http://127.0.0.1:8000/accounts/registration/verify-email/';

  constructor(private http:HttpClient) {}

  verify(verificationKey:string):Observable<any> {

    const postData = {
      key: verificationKey,
    }

    return this.http.post(this.verifyUrl, postData)
  }
}
