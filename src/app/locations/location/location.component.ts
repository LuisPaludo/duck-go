import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocationApiService } from '../api/location-api.service';

/**
 * LocationComponent: Componente Angular para detalhar um local específico.
 *
 * Descrição:
 * Este componente é utilizado para exibir os detalhes de um local específico. O local é identificado pelo seu "slug",
 * que é passado como parâmetro na URL.
 *
 * Propriedades:
 * - `slug`: Armazena o identificador único (slug) do local a ser detalhado.
 *
 * Métodos:
 * - `ngOnInit()`: Método de ciclo de vida do Angular chamado após a criação do componente.
 *                 Responsável por obter o slug do local a partir da URL e, em seguida, buscar os detalhes deste local.
 *                 Se os locais já estiverem carregados no serviço, o local é buscado diretamente do serviço. Caso contrário,
 *                 uma chamada API é feita para obter todos os locais e depois buscar o local desejado.
 * - `goBack()`: Navega de volta para a lista completa de locais.
 *
 * Objetivo:
 * Exibir detalhes de um local específico com base em seu slug. O componente recupera os detalhes do local
 * diretamente do serviço (se já carregado) ou faz uma chamada API para obter os dados.
 */

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css'],
})
export class LocationComponent implements OnInit {
  slug: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public apiLocation: LocationApiService
  ) {}

  ngOnInit(): void {
    this.apiLocation.loading = true;
    this.slug = this.route.snapshot.paramMap.get('slug');
    if (this.apiLocation.locations) {
      this.apiLocation.loading = false;
      this.apiLocation.location = this.apiLocation.locations.find(
        (location) => location.slug_field === this.slug
      );
    } else {
      this.apiLocation.getAllLocations().subscribe({
        next: (data) => {
          this.apiLocation.locations = data;
          this.apiLocation.loading = false;
          this.apiLocation.location = this.apiLocation.locations.find(
            (location) => location.slug_field === this.slug
          );
        },
      });
    }
  }

  goBack(): void {
    this.router.navigate(['locais']);
  }
}
