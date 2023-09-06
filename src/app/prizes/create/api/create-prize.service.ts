import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiPointsService } from 'src/app/home/api/api-points.service';
import { Urls } from 'src/app/utils/urls';

@Injectable({
  providedIn: 'root',
})
export class CreatePrizeService {

  private urls: Urls = new Urls();

  constructor(private http:HttpClient, private apiPoints:ApiPointsService) {}

  getCategory():Observable<any> {

    return this.http.get(this.urls.prizeCategory)
  }

  createPrize(prizeData, logo): Observable<any> {

    const postData = {
      name: prizeData.nome,
      description: prizeData.descricao,
      cost_in_points: prizeData.pontos,
      times_to_be_used: prizeData.unidades,
      expiry_date: prizeData.expiracao,
      category: prizeData.categoria,
    };

    return this.http.post(this.urls.prizeUrl,postData)
  }
}
