import { Component, OnInit } from '@angular/core';
import { LocationApiService } from './api/location-api.service';
/**
 * LocationsComponent - Componente para listar e detalhar locais.
 *
 * Propriedades:
 * - `locations`: Uma lista que armazena todos os locais retornados pela API.
 * - `location`: Guarda as informações do local selecionado pelo usuário.
 * - `showAll`: Flag que determina se a lista completa de locais ou os detalhes de um único local devem ser exibidos.
 *
 * Métodos:
 * - `ngOnInit()`: É usado para chamar o método `getLocations()`.
 * - `getLocations()`: Consulta o serviço `LocationApiService` para obter todos os locais disponíveis e armazena a resposta em `locations`.
 * - `redirect(id)`: Usado para exibir detalhes de um local específico com base em seu ID. Atualiza a propriedade `location` e altera
 * a flag `showAll` para `false`.
 * - `goBack()`: Retorna à exibição da lista completa de locais e limpa qualquer detalhe de local selecionado.
 *
 * Este componente é responsável por interagir com o `LocationApiService` para obter dados dos locais, e controlar a exibição entre uma
 * lista geral de locais e os detalhes de um local específico.
 */
@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.css'],
})
export class LocationsComponent implements OnInit {
  locations: any;
  location: any;
  showAll: boolean = true;

  constructor(public apiLocation: LocationApiService) {}

  ngOnInit(): void {
    this;
    this.getLocations();
  }

  getLocations = () => {
    this.apiLocation.loading = true;
    this.apiLocation.getAllLocations().subscribe({
      next: (data) => {
        this.locations = data;
        this.apiLocation.loading = false;
      },
      error: (e) => (this.apiLocation.loading = false),
      complete: () => {},
    });
  };

  redirect(id) {
    this.showAll = false;
    this.location = this.locations[id - 1];
  }

  goBack() {
    this.showAll = true;
    this.location = null;
  }
}
