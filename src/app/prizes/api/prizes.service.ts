import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiPointsService } from 'src/app/home/api/api-points.service';
import { Prizes } from '../models/prizes';
import { Urls } from 'src/app/utils/urls';
/**
 * PrizesService - Serviço responsável por interagir com as APIs relacionadas aos prêmios.
 *
 * Propriedades:
 * - `urls`: Instância contendo URLs utilizadas nas requisições.
 * - `isGetting`: Flag que indica se uma operação de obtenção de prêmios está em andamento.
 * - `isPosting`: Flag que indica se uma operação de postagem (ex: resgatar prêmio) está em andamento.
 * - `loading`: Flag que indica se qualquer operação está em andamento (pode ser usado para mostrar/ocultar um indicador de carregamento).
 *
 * Métodos:
 * - `getPrizes()`: Retorna um Observable contendo uma lista de prêmios disponíveis. Se `isGetting` for verdadeiro, retorna um Observable vazio.
 * - `redeemPrize(id: number)`: Tenta resgatar um prêmio com base em seu ID. Retorna void se `isPosting` for verdadeiro.
 *
 * Dependências:
 * - `http`: HttpClient para fazer requisições à API.
 * - `apiPoints`: Serviço que gerencia os pontos do usuário (não é explicitamente usado neste trecho fornecido).
 *
 * Este serviço é utilizado principalmente para interagir com a API, seja para obter a lista de prêmios disponíveis ou para resgatar um prêmio específico.
 */
@Injectable({
  providedIn: 'root',
})
export class PrizesService {
  private urls: Urls = new Urls();

  isGetting: boolean = false;
  isPosting: boolean = false;

  public loading: boolean = false;

  constructor(private http: HttpClient, private apiPoints: ApiPointsService) {}

  getPrizes(): Observable<Prizes[]> {
    if (this.isGetting) {
      return of([]);
    }

    this.isGetting = true;

    return this.http.get<Prizes[]>(this.urls.prize);
  }

  redeemPrize(id: number): Observable<any> {
    if (this.isPosting) {
      return;
    }

    this.isPosting = true;

    const postData = {
      prize: id,
    };

    return this.http.post(this.urls.redeem, postData);
  }
}
