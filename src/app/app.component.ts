import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from './api/authentication-service.service';
import { ApiPointsService } from './home/api/api-points.service';
/**
 * AppComponent - Componente Angular principal que gerencia a autenticação e navegação.
 *
 * Propriedades:
 * - `userVerified`: Um indicador que mostra se o usuário está autenticado.
 * - `subscription`: Uma assinatura para eventos de roteamento.
 * - `verification`: Uma assinatura para verificar o status de autenticação do usuário.
 * - `isPartner`: Um indicador que mostra se o usuário é um parceiro.
 *
 * Métodos:
 * - `ngOnInit()`: Inicializa e verifica o status de autenticação do usuário. Ele também se inscreve para eventos de roteamento
 *                 para verificar o status do parceiro e gerenciar dados relacionados ao sistema de leitura de pontos.
 * - `logout()`: Efetua logout do usuário usando o serviço de autenticação.
 * - `ngOnDestroy()`: Desinscreve-se dos eventos de roteamento ao destruir o componente.
 *
 * Dependências:
 * - `api`: Serviço que facilita a comunicação com a API de autenticação.
 * - `router`: Serviço de roteamento Angular para escutar eventos de navegação.
 * - `apiPoints`: Serviço que lida com a leitura de pontos.
 *
 * O AppComponent é o componente principal que monitora a autenticação do usuário,
 * o status do parceiro e gere os pontos lidos. Ele também permite que os usuários efetuem logout e
 * se atualiza conforme a navegação do usuário por diferentes rotas na aplicação.
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'duck-go';

  userVerified: boolean = false;
  private subscription: Subscription;
  private verification: Subscription;

  public isPartner: boolean = false;

  constructor(
    private api: AuthenticationService,
    private router: Router,
    private apiPoints: ApiPointsService
  ) {}

  ngOnInit() {
    // Verifica se o usuário está autenticado
    this.api.isAuthenticated.subscribe({
      next: (isVerified) => {
        this.userVerified = isVerified;
      },
    });

    // Toda vez que uma tela for alterada
    this.subscription = this.router.events.subscribe((ev) => {
      if (ev instanceof NavigationEnd) {
        // Verifica se o usuário é um parceiro no cache
        this.isPartner = localStorage.getItem('isPartner') === 'true';
        // Anula variáveis do sistema de leitura de pontos
        this.apiPoints.manyGetPoints = false;
        this.apiPoints.getPointSuccess = false;

        this.verification = this.api.userAuthenticated.subscribe({
          next: (isVerified) => {
            if (isVerified) {
              this.userVerified = true;
              this.api.isPartner$.subscribe({
                next: (isPartner) => {
                  this.isPartner = isPartner;
                },
              });
            } else {
              this.userVerified = false;
            }
          },
          complete: () => {
            this.verification.unsubscribe();
          },
        });
      }
    });
  }

  logout() {
    this.api.logout();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
