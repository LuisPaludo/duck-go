import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AuthenticationService } from './api/authentication-service.service';
import { ApiPointsService } from './home/api/api-points.service';

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
