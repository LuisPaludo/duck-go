import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthenticationService } from 'src/app/api/authentication-service.service';
import { ApiPointsService } from 'src/app/home/api/api-points.service';
import { PrizeResponse, Prizes } from 'src/app/prizes/models/prizes';
import { Urls } from 'src/app/utils/urls';

@Injectable({
  providedIn: 'root',
})
export class CouponsApiService {
  private isGetting: boolean = false;

  private urls: Urls = new Urls();

  constructor(
    private http: HttpClient,
    private apiPoints: ApiPointsService,
    private api: AuthenticationService
  ) {}

  getRedeemedPrizes(): Observable<PrizeResponse[]> {
    const httpHeaders = this.apiPoints.generateHeaders();

    return this.http.get<PrizeResponse[]>(this.urls.redeemedUrl, {
      headers: httpHeaders,
    });
  }

  getCreatedPrizes(): Observable<Prizes[]> {
    const httpHeaders = this.apiPoints.generateHeaders();

    return this.http.get<Prizes[]>(this.urls.partnerPrizes, {
      headers: httpHeaders,
    });
  }

  getQrCode(prize: number): Observable<any> {
    const httpHeaders = this.apiPoints.generateHeaders();

    const fullUrl = this.urls.qrCodeUrl + prize;

    return this.http.get<any>(fullUrl, {
      headers: httpHeaders,
    });
  }

  disablePrize(prize: number): Observable<any> {
    const httpHeaders = this.apiPoints.generateHeaders();

    const fullUrl = this.urls.prizeUrl + prize + '/';

    const patchData = {
      disabled: true,
    };

    return this.http.patch<any>(fullUrl, patchData, {
      headers: httpHeaders,
    });
  }

  activatePrize(prize: number): Observable<any> {
    const httpHeaders = this.apiPoints.generateHeaders();

    const fullUrl = this.urls.prizeUrl + prize + '/';

    const patchData = {
      disabled: false,
    };

    return this.http.patch<any>(fullUrl, patchData, {
      headers: httpHeaders,
    });
  }
}
