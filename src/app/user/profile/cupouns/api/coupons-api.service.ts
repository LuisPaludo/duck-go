import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiPointsService } from 'src/app/home/api/api-points.service';
import { PrizeResponse, Prizes } from 'src/app/prizes/models/prizes';

@Injectable({
  providedIn: 'root',
})
export class CouponsApiService {
  private isGetting: boolean = false;
  private redeemedUrl: string = 'http://127.0.0.1:8000/resgatar/';
  private qrCodeUrl: string = 'http://127.0.0.1:8000/qr-code/?prize=';

  constructor(private http: HttpClient, private apiPoints: ApiPointsService) {}

  getRedeemedPrizes(): Observable<PrizeResponse[]> {
    const httpHeaders = this.apiPoints.generateHeaders();

    return this.http.get<PrizeResponse[]>(this.redeemedUrl, {
      headers: httpHeaders,
    });
  }

  getQrCode(prize:number): Observable<any> {
    const httpHeaders = this.apiPoints.generateHeaders();

    const fullUrl = this.qrCodeUrl + prize;

    return this.http.get<any>(fullUrl, {
      headers: httpHeaders,
    });
  }
}
