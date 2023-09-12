import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PrizeResponse, Prizes } from 'src/app/prizes/models/prizes';
import { Urls } from 'src/app/utils/urls';
/**
 * UserPrizesService - Serviço responsável pela comunicação com a API para gerenciamento e obtenção de informações relacionadas aos prêmios do usuário.
 *
 * Propriedades:
 * - `loading`: Indicador booleano para o estado de carregamento das chamadas à API.
 *
 * Métodos:
 * - `getRedeemedPrizes()`: Retorna um Observable com uma lista de prêmios resgatados pelo usuário.
 * - `getCreatedPrizes()`: Retorna um Observable com uma lista de prêmios criados por um usuário parceiro.
 * - `getQrCode(prize: number)`: Busca o QR code associado a um prêmio específico.
 * - `disablePrize(prize: number)`: Desativa um prêmio especificado pelo seu ID.
 * - `activatePrize(prize: number)`: Ativa um prêmio especificado pelo seu ID.
 *
 * Dependências:
 * - `http`: Serviço HttpClient do Angular para fazer chamadas à API.
 *
 * O serviço é responsável por permitir que o componente `UserPrizesComponent` faça chamadas à API para gerenciar e obter informações sobre os prêmios.
 * Ele contém métodos para buscar prêmios resgatados, prêmios criados (se o usuário for um parceiro), QR codes associados a prêmios específicos e
 * para ativar/desativar prêmios.
 */
@Injectable({
  providedIn: 'root',
})
export class UserPrizesService {
  public loading: boolean = false;

  private urls: Urls = new Urls();

  constructor(private http: HttpClient) {}

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
