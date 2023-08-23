import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProfileApiService } from './api/profile-api.service';
import { User } from './models/user';
import { ApiPointsService } from 'src/app/home/api/api-points.service';
import { UserHistory } from 'src/app/home/models/history';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  public user: User;
  public total_points: number;
  private userSubscription: Subscription;

  constructor(
    public profileApi: ProfileApiService,
    private pointsApi: ApiPointsService
  ) {}

  ngOnInit(): void {
    this.profileApi.getUser().subscribe({
      next: (data: User) => {
        this.user = data;
      },
      complete: () => {
        this.profileApi.userData$.subscribe({
          next: (data) => {
            if (data) {
              this.user = data;
            }
          },
        });
      },
    });

    this.pointsApi.getUserHistory().subscribe({
      next: (data: UserHistory[]) => {
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
}
