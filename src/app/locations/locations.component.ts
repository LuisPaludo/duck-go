import { Component, OnInit } from '@angular/core';
import { LocationApiService } from './api/location-api.service';
import { Router } from '@angular/router';
/**
 * LocationsComponent: Componente Angular para listar e detalhar locais.
 *
 * Descrição:
 * Este componente é responsável por listar todos os locais obtidos através do serviço LocationApiService.
 * Ele também fornece uma maneira de navegar para a página de detalhes de um local específico através de seu slug.
 *
 * Métodos:
 * - `ngOnInit()`: Método de ciclo de vida do Angular chamado após a criação do componente.
 *                 Verifica se os locais já foram carregados pelo serviço; se não, chama `getLocations()`.
 * - `getLocations()`: Consulta o serviço LocationApiService para obter todos os locais disponíveis.
 *                     Controla o estado de carregamento e armazena os locais recebidos no serviço.
 * - `redirect(slug: string)`: Navega para a página de detalhes de um local específico usando seu slug como parâmetro.
 *
 * Objetivo:
 * O objetivo deste componente é ser a interface entre o usuário e o serviço de API de locais. Ele lista os locais disponíveis e
 * permite ao usuário selecionar um local específico, redirecionando-o para a página de detalhes desse local.
 */
@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.css'],
})
export class LocationsComponent implements OnInit {
  constructor(public apiLocation: LocationApiService, private router: Router) {}

  ngOnInit(): void {
    if (!this.apiLocation.locations) {
      this.getLocations();
    }
  }

  getLocations = () => {
    this.apiLocation.loading = true;
    this.apiLocation.getAllLocations().subscribe({
      next: (data) => {
        this.apiLocation.loading = false;
        this.apiLocation.locations = data;
      },
      error: (e) => (this.apiLocation.loading = false),
      complete: () => {},
    });
  };

  redirect(slug: string) {
    this.router.navigate(['locais', slug]);
    window.scroll(0, 0);
  }
}
