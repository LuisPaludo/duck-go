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
export class UserPrizesService {
  private isGetting: boolean = false;

  private urls: Urls = new Urls();

  constructor(
    private http: HttpClient,
    private apiPoints: ApiPointsService,
    private api: AuthenticationService
  ) {}

  getRedeemedPrizes(): Observable<PrizeResponse[]> {
    return this.http.get<PrizeResponse[]>(this.urls.redeem);
  }

  getCreatedPrizes(): Observable<Prizes[]> {
    return this.http.get<Prizes[]>(this.urls.partnerPrizes);
  }

  getQrCode(prize: number): Observable<any> {
    const fullUrl = this.urls.qrCode + prize;

    return this.http.get<any>(fullUrl);
  }

  disablePrize(prize: number): Observable<any> {
    const fullUrl = this.urls.prize + prize + '/';

    const patchData = {
      disabled: true,
    };

    return this.http.patch<any>(fullUrl, patchData);
  }

  activatePrize(prize: number): Observable<any> {
    const fullUrl = this.urls.prize + prize + '/';

    const patchData = {
      disabled: false,
    };

    return this.http.patch<any>(fullUrl, patchData);
  }
}
