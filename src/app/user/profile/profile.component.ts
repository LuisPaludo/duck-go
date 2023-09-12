import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProfileApiService } from './api/profile-api.service';
import { User } from './models/user';
import { ApiPointsService } from 'src/app/home/api/api-points.service';
import { UserHistory } from 'src/app/home/models/history';
import { AuthenticationService } from 'src/app/api/authentication-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  public user: User;
  public total_points: number;
  private userSubscription: Subscription;

  public partnerPage:boolean = false;

  constructor(
    public profileApi: ProfileApiService,
    private pointsApi: ApiPointsService,
    private api: AuthenticationService,
    private router:Router,
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
              if(data.partner_company_name_slug) {
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

  navigateToPartner():void {
    const slug = this.user.partner_company_name_slug;
    this.router.navigate(['parceiros',slug])
  }
}
