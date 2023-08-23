import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HistoryService {
  private historyUrl: string = 'http://127.0.0.1:8000/history/';
  
  constructor(private http: HttpClient) {}

  getUserHistory(): Observable<any> {
    const VerifiedHttpHeaders = this.generateHeaders();

    return this.http.get(this.historyUrl, {
      headers: VerifiedHttpHeaders,
    });
  }

  generateHeaders(): HttpHeaders {
    const accessToken: string = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: 'Bearer ' + accessToken,
    });
  }
}
