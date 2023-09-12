import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Urls } from 'src/app/utils/urls';
/**
 * CreatePrizeService - Serviço Angular responsável pela criação de prêmios e gerenciamento de categorias de prêmios.
 *
 * Propriedades:
 * - `urls`: Armazena as URLs usadas para as requisições ao servidor.
 * - `loading`: Indica se uma requisição está em andamento.
 *
 * Métodos:
 * - `getCategory()`: Retorna um observable que contém as categorias de prêmios.
 * - `createPrize(prizeData)`: Envia os dados do prêmio para o servidor para criação do prêmio.
 *
 * Dependências:
 * - `http`: Cliente HTTP para realizar requisições.
 *
 * Este serviço é utilizado principalmente para interagir com o back-end em relação à criação de prêmios e obtenção de categorias de prêmios.
 */
@Injectable({
  providedIn: 'root',
})
export class CreatePrizeService {

  private urls: Urls = new Urls();

  public loading:boolean = false;

  constructor(private http:HttpClient) {}

  getCategory():Observable<any> {

    return this.http.get(this.urls.prizeCategory)
  }

  createPrize(prizeData): Observable<any> {

    const postData = {
      name: prizeData.nome,
      description: prizeData.descricao,
      cost_in_points: prizeData.pontos,
      times_to_be_used: prizeData.unidades,
      expiry_date: prizeData.expiracao,
      category: prizeData.categoria,
    };

    return this.http.post(this.urls.prize,postData)
  }
}
