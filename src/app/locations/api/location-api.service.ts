import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Urls } from 'src/app/utils/urls';
import { Locations } from '../models/locations';
/**
 * LocationApiService - Serviço Angular para gerenciar a interação com a API relacionada a locais.
 *
 * Propriedades:
 * - `urls`: Uma instância da classe `Urls` que contém URLs da API.
 * - `httpHeaders`: Define os cabeçalhos HTTP a serem enviados em cada requisição para a API.
 * - `loading`: Uma flag que indica se uma operação de requisição está em andamento.
 *
 * Métodos:
 * - `getAllLocations()`: Retorna um `Observable` com todos os locais disponíveis na API.
 * - `getLocation(locationId)`: Recebe um ID de local e retorna um `Observable` com detalhes sobre o local específico.
 *
 * Este serviço encapsula a lógica de chamadas HTTP relacionadas aos locais e fornece uma maneira de recuperar informações sobre locais do backend.
 */
@Injectable({
  providedIn: 'root',
})
export class LocationApiService {
  private urls: Urls = new Urls();

  httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  public loading: boolean = false;

  public locations:Locations[];
  public location:Locations;

  constructor(private http: HttpClient) {}

  getAllLocations(): Observable<Locations[]> {
    return this.http.get<Locations[]>(this.urls.locations, {
      headers: this.httpHeaders,
    });
  }

  getLocation(locationId): Observable<any> {
    return this.http.get(this.urls.touristAttaction + locationId, {
      headers: this.httpHeaders,
    });
  }
}
