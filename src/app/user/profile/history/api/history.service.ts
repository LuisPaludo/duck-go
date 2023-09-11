import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Urls } from 'src/app/utils/urls';

@Injectable({
  providedIn: 'root',
})
export class HistoryService {
  private urls:Urls = new Urls();

  constructor(private http: HttpClient) {}

  getUserHistory(): Observable<any> {
    return this.http.get(this.urls.history);
  }
}
