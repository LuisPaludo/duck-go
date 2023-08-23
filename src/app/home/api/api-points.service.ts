import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  Subscription,
  of,
  throwError,
} from 'rxjs';
import { ApiService } from 'src/app/api/api.service';
import { GeoPoint } from '../models/GeoPoint';
import { PointData } from '../models/PointData';
import { UserHistory } from '../models/history';
import { HistoryPost } from '../models/historypost';

@Injectable({
  providedIn: 'root',
})
export class ApiPointsService {
  private searchUrl: string = 'http://127.0.0.1:8000/turistic-points/?search=';
  private historyUrl: string = 'http://127.0.0.1:8000/history/';

  public userHistorySubject = new BehaviorSubject<UserHistory[]>(null);
  public userHistory$ = this.userHistorySubject.asObservable();

  public getPointSuccess:boolean = false;
  public manyGetPoints:boolean = false;

  postRequest: boolean = false;
  isLoading: boolean = false;
  isSaving: boolean = false;
  isGettingPoints: boolean = false;

  public locationName:string;
  public locationDescription:string;
  public locationPhoto:string;
  public locationPoints:number;

  user: GeoPoint;
  center: GeoPoint;

  constructor(private http: HttpClient, private api: ApiService) {}

  verifyQRCode(qrIdNumber: number, coords: GeolocationCoordinates) {
    if (this.isLoading) {
      return;
    }

    this.postRequest = true;
    this.isLoading = true;

    const VerifiedHttpHeaders = this.generateHeaders();

    let fullUrl = this.searchUrl + qrIdNumber;

    this.http
      .get(fullUrl, {
        headers: VerifiedHttpHeaders,
      })
      .subscribe({
        next: (locationData: PointData[]) => {
          if (locationData.length !== 0) {
            const points = locationData[0].points;
            const locationName = locationData[0].name;

            this.center = {
              latitude: locationData[0].coordinates_lat,
              longitude: locationData[0].coordinates_long,
            };

            this.user = {
              latitude: coords.latitude,
              longitude: coords.longitude,
            };

            const result = this.isWithinRadius(this.user, this.center, 1000);

            if (result) {
              this.locationName = locationData[0].name;
              this.locationDescription = locationData[0].description;
              this.locationPhoto = locationData[0].photo;
              // this.locationPoints = locationData[0].points;

              this.savePoints(points, 0, 'add', locationName);

              // this.getUserHistory().subscribe({
              //   next: (userData: UserHistory[]) => {
              //     let total_points = 0;
              //     if (userData.length !== 0) {
              //       total_points = userData[userData.length - 1].total_points;
              //     }

              //   },
              // });
            }
          } else {
            console.error('Código inválido');
          }

          this.postRequest = false;
          this.isLoading = false;
        },
        error: (e) => {
          this.isLoading = false;

          if (e.status === 401) {
          } else {
            console.error('Não foi possível acessar o link');
          }
        },
        complete: () => {
          this.center = null;
          this.user = null;
        },
      });
  }

  isWithinRadius(user: GeoPoint, center: GeoPoint, radius = 100): boolean {
    const EARTH_RADIUS = 6371000;

    function haversineDistance(point1: GeoPoint, point2: GeoPoint): number {
      const dLat = toRad(point2.latitude - point1.latitude);
      const dLon = toRad(point2.longitude - point1.longitude);

      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(point1.latitude)) *
          Math.cos(toRad(point2.latitude)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);

      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return EARTH_RADIUS * c;
    }

    function toRad(value: number): number {
      return (value * Math.PI) / 180;
    }

    return haversineDistance(user, center) <= radius;
  }

  savePoints(
    points: number,
    total_points: number,
    action: string,
    name: string
  ): void {
    if (this.isSaving) {
      return;
    }

    this.isSaving = true;

    const VerifiedHttpHeaders = this.generateHeaders();

    if (action === 'add') {
      total_points = points + total_points;
    } else if (action === 'reduce') {
      if (total_points < points) {
        this.isSaving = false;
        throwError(() =>
          console.error('Usuário não posui pontos suficientes para a operação.')
        );
      }
      total_points = total_points - points;
    }

    const postData: HistoryPost = new HistoryPost();

    postData.points = points;
    postData.description = 'Ponto Turístico -> ' + name;

    this.http
      .post(this.historyUrl, postData, {
        headers: VerifiedHttpHeaders,
      })
      .subscribe({
        next: (info:HistoryPost) => {
          this.locationPoints = info.points;
          this.getPointSuccess = true;
          this.isSaving = false;
        },
        error: (e) => {
          this.isSaving = false;
          if(e.status === 429) {
            this.manyGetPoints = true;
          }
        },
      });
  }

  getUserHistory(): Observable<any> {
    const VerifiedHttpHeaders = this.generateHeaders();

    return this.http.get(this.historyUrl, {
      headers: VerifiedHttpHeaders,
    });
  }

  generateHeaders(): HttpHeaders {
    const accessToken: string = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: 'Bearer ' + accessToken,
    });
  }
}
