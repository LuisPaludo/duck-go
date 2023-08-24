import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiPointsService } from 'src/app/home/api/api-points.service';
import { Prizes } from '../models/prizes';
import { Urls } from 'src/app/utils/urls';

@Injectable({
  providedIn: 'root',
})
export class PrizesService {

  private urls:Urls = new Urls();

  isGetting: boolean = false;
  isPosting: boolean = false;

  constructor(private http: HttpClient, private apiPoints: ApiPointsService) {}

  getPrizes(): Observable<Prizes[]> {
    if (this.isGetting) {
      return of([]);
    }

    this.isGetting = true;

    const httpHeaders = this.apiPoints.generateHeaders();

    return this.http.get<Prizes[]>(this.urls.prizeUrl, {
      headers: httpHeaders,
    });
  }

  redeemPrize(id:number): Observable<any> {
    if (this.isPosting) {
      return
    }

    this.isPosting = true;

    const httpHeaders = this.apiPoints.generateHeaders();

    const postData = {
      prize: id,
    }

    return this.http.post(this.urls.redeemUrl,postData,{
      headers: httpHeaders,
    })

  }
}
