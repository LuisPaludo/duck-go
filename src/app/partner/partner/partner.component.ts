import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PartnerService } from './api/partner.service';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from 'src/app/user/profile/models/user';
/**
 * PartnerComponent - Componente responsável por exibir detalhes de um parceiro específico.
 *
 * Propriedades:
 * - `slug`: Uma string que armazena o identificador único (slug) do parceiro a ser buscado.
 * - `partner`: Representa o objeto do parceiro, que é do tipo `User`, contendo informações detalhadas sobre o mesmo.
 * - `baseUrl`: URL base usada para chamadas à API e/ou recursos.
 *
 * Métodos:
 * - `ngOnInit()`: Aqui, o identificador único do parceiro é recuperado,e uma chamada à API é feita para obter detalhes do parceiro.
 * Se o parceiro não for encontrado, o usuário é redirecionado para uma página 'not-found'.
 *
 * Dependências:
 * - `route`: Fornece informações sobre a rota associada à instância do componente.
 * - `router`: Fornece capacidades de navegação.
 * - `apiPartner`: Serviço para interagir com a API relacionada aos parceiros.
 *
 * Este componente é usado para exibir detalhes sobre um parceiro específico baseado em seu identificador único.
 */
@Component({
  selector: 'app-partner',
  templateUrl: './partner.component.html',
  styleUrls: ['./partner.component.css'],
})
export class PartnerComponent implements OnInit {
  private slug: string;

  public partner: User;

  public baseUrl: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public apiPartner: PartnerService
  ) {}

  ngOnInit(): void {
    this.apiPartner.loading = true;
    this.slug = this.route.snapshot.paramMap.get('slug');
    this.baseUrl = this.apiPartner.urls.baseUrl;
    this.apiPartner.getPartner(this.slug).subscribe({
      next: (data: User) => {
        this.partner = data;
        this.apiPartner.loading = false;
      },
      error: (e) => {
        this.apiPartner.loading = false;
        if (e instanceof HttpErrorResponse && e.status === 404) {
          this.router.navigate(['not-found']);
        }
      },
    });
  }
}
