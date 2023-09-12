import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProfileApiService } from './api/profile-api.service';
import { User } from './models/user';
import { ApiPointsService } from 'src/app/home/api/api-points.service';
import { UserHistory } from 'src/app/home/models/history';
import { AuthenticationService } from 'src/app/api/authentication-service.service';
import { Router } from '@angular/router';
/**
 * ProfileComponent - Componente que exibe e gerencia informações do perfil de um usuário.
 *
 * Propriedades:
 * - `user`: Um modelo que contém informações detalhadas sobre o usuário.
 * - `total_points`: Uma variável que representa os pontos totais do usuário.
 * - `userSubscription`: Uma assinatura para acompanhar as atualizações relacionadas às informações do usuário.
 * - `partnerPage`: Um indicador para determinar se o usuário pertence a uma página de parceiro.
 *
 * Métodos:
 * - `ngOnInit()`: Carrega os dados do perfil do usuário ao iniciar o componente. Ele também carrega o histórico de pontos do usuário.
 * - `ngOnDestroy()`: Desinscreve-se de observáveis quando o componente é destruído para evitar vazamentos de memória.
 * - `navigateToPartner()`: Navega para a página do parceiro associada ao usuário.
 *
 * Dependências:
 * - `profileApi`: Serviço que facilita a comunicação com a API de perfil.
 * - `pointsApi`: Serviço que lida com informações relacionadas aos pontos do usuário.
 * - `api`: Serviço que facilita a comunicação com a API de autenticação.
 * - `router`: Serviço de roteamento Angular usado para navegação entre páginas/componentes.
 *
 * O componente `ProfileComponent` permite que os usuários visualizem e gerenciem suas informações de perfil.
 * Ele também exibe os pontos totais do usuário e determina se o usuário pertence a uma página de parceiro.
 * Dependendo das informações do usuário, o componente também pode redirecionar para a página do parceiro.
 */
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  public user: User;
  public total_points: number;
  private userSubscription: Subscription;

  public partnerPage: boolean = false;

  constructor(
    public profileApi: ProfileApiService,
    private pointsApi: ApiPointsService,
    private api: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.profileApi.loading = true;
    this.profileApi.getUser().subscribe({
      next: (data: User) => {
        this.user = data;
        this.profileApi.loading = false;
      },
      complete: () => {
        this.profileApi.userData$.subscribe({
          next: (data) => {
            if (data) {
              this.user = data;
              if (data.partner_company_name_slug) {
                this.partnerPage = true;
              }
              this.api.isPartner.next(data.is_partner);
              if (data.is_partner) {
                localStorage.setItem('isPartner', 'true');
              }
            }
          },
        });
      },
    });
    this.profileApi.loading = true;
    this.pointsApi.getUserHistory().subscribe({
      next: (data: UserHistory[]) => {
        this.profileApi.loading = false;
        if (data.length === 0) {
          this.total_points = 0;
        } else {
          this.total_points = data[data.length - 1].total_points;
        }
      },
      complete: () => {},
    });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  navigateToPartner(): void {
    const slug = this.user.partner_company_name_slug;
    this.router.navigate(['parceiros', slug]);
  }
}
