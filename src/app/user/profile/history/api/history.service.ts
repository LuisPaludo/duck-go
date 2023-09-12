import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Urls } from 'src/app/utils/urls';
/**
 * HistoryService - Serviço Angular responsável por comunicar-se com a API e obter o histórico do usuário.
 *
 * Propriedades:
 * - `loading`: Um indicador booleano que sinaliza quando o serviço está realizando uma operação de busca. Pode ser usado para exibir
 * animações de carregamento ou feedbacks ao usuário.
 *
 * Métodos:
 * - `getUserHistory()`: Retorna um Observable que se resolve com o histórico do usuário quando a solicitação à API é concluída.
 *
 * Dependências:
 * - `http`: Serviço HttpClient do Angular usado para fazer solicitações HTTP.
 *
 * O `HistoryService` é um serviço Angular criado para abstrair a lógica de comunicação com o backend relacionada ao histórico do usuário. Ele se comunica
 * diretamente com a API, usando o HttpClient para obter os dados do histórico do usuário.
 *
 *
 */
@Injectable({
  providedIn: 'root',
})
export class HistoryService {
  private urls: Urls = new Urls();
  public loading: boolean = false;

  constructor(private http: HttpClient) {}

  getUserHistory(): Observable<any> {
    return this.http.get(this.urls.history);
  }
}
