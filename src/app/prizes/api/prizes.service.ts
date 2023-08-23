import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiPointsService } from 'src/app/home/api/api-points.service';
import { Prizes } from '../models/prizes';

@Injectable({
  providedIn: 'root',
})
export class PrizesService {
  private prizeUrl: string = 'http://127.0.0.1:8000/premios/';
  private redeemUrl: string = 'http://127.0.0.1:8000/resgatar/';

  isGetting: boolean = false;
  isPosting: boolean = false;

  constructor(private http: HttpClient, private apiPoints: ApiPointsService) {}

  getPrizes(): Observable<Prizes[]> {
    if (this.isGetting) {
      return of([]);
    }

    this.isGetting = true;

    const httpHeaders = this.apiPoints.generateHeaders();

    return this.http.get<Prizes[]>(this.prizeUrl, {
      headers: httpHeaders,
    });
  }

  redeemPrize(id:number): void {
    if (this.isPosting) {
      return
    }

    this.isPosting = true;

    const httpHeaders = this.apiPoints.generateHeaders();

    const postData = {
      prize: id,
    }

    this.http.post(this.redeemUrl,postData,{
      headers: httpHeaders,
    }).subscribe({
      next: (data) => {
        this.isPosting = false;
      },
      error: (e) => {
        this.isPosting = false;
        if(e instanceof HttpErrorResponse && e.status === 400) {
          console.log('Cupom já cadastrado')
        }
        if( e instanceof HttpErrorResponse && e.status === 402) {
          console.log('Usuário não possui pontos suficientes')
        }
      }
    })

  }
}
