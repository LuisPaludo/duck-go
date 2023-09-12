import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Urls } from 'src/app/utils/urls';
/**
 * PartnerService - Serviço para interagir com a API relacionada a parceiros.
 *
 * Propriedades:
 * - `urls`: Objeto da classe Urls que armazena diferentes URLs de endpoints para chamadas à API.
 * - `loading`: Flag booleana que indica se uma solicitação HTTP está em andamento.
 *
 * Métodos:
 * - `getPartner(slug: string)`: Retorna um `Observable` que emite os detalhes do parceiro baseado em seu identificador único (slug).
 *
 * Este serviço é primariamente usado para obter informações sobre um parceiro específico do backend.
 */
@Injectable({
  providedIn: 'root',
})
export class PartnerService {
  public urls: Urls = new Urls();
  public loading: boolean = false;

  constructor(private http: HttpClient) {}

  getPartner(slug: string): Observable<any> {
    const fullUrl = this.urls.partner + slug;

    return this.http.get(fullUrl);
  }
}
