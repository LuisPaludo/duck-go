import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from './api/api.service';
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

  cacheUserVerified: boolean;
  userVerified: boolean = false;
  private subscription: Subscription;
  private verification: Subscription;

  constructor(private api: AuthenticationService, private router: Router, private apiPoints: ApiPointsService) {}

  ngOnInit() {
    this.api.isAuthenticated.subscribe({
      next: (isVerified) => {
        if (isVerified) {
          this.userVerified = true;
        } else {
          this.userVerified = false;
        }
      },
    });

    this.subscription = this.router.events.subscribe((ev) => {
      if (ev instanceof NavigationEnd) {
        this.apiPoints.manyGetPoints = false;
        this.apiPoints.getPointSuccess = false;
        this.verification = this.api.userAuthenticated.subscribe({
          next: (isVerified) => {
            if (isVerified) {
              this.userVerified = true;
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
