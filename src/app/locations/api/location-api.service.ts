import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LocationApiService {
  locationUrl: string = 'http://127.0.0.1:8000/locais/';
  httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) {}

  getAllLocations(): Observable<any> {
    return this.http.get(this.locationUrl, {
      headers: this.httpHeaders,
    });
  }

  getLocation(locationId): Observable<any> {
    return this.http.get(this.locationUrl + locationId, {
      headers: this.httpHeaders,
    });
  }
}
