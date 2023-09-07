import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Urls } from 'src/app/utils/urls';

@Injectable({
  providedIn: 'root',
})
export class PartnerService {
  public urls: Urls = new Urls();

  constructor(private http: HttpClient) {}

  getPartner(slug: string): Observable<any> {
    const fullUrl = this.urls.partner + slug;

    return this.http.get(fullUrl);
  }
}
