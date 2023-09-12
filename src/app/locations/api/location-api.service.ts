import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Urls } from 'src/app/utils/urls';

@Injectable({
  providedIn: 'root',
})
export class LocationApiService {
  private urls:Urls = new Urls();

  httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  public loading:boolean = false;

  constructor(private http: HttpClient) {}

  getAllLocations(): Observable<any> {
    return this.http.get(this.urls.locations, {
      headers: this.httpHeaders,
    });
  }

  getLocation(locationId): Observable<any> {
    return this.http.get(this.urls.touristAttaction + locationId, {
      headers: this.httpHeaders,
    });
  }
}
