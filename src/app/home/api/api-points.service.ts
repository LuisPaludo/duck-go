import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  Subscription,
  of,
  throwError,
} from 'rxjs';
import { GeoPoint } from '../models/GeoPoint';
import { PointData } from '../models/PointData';
import { UserHistory } from '../models/history';
import { HistoryPost } from '../models/historypost';
import { Urls } from 'src/app/utils/urls';

@Injectable({
  providedIn: 'root',
})
export class ApiPointsService {
  private urls: Urls = new Urls();

  public userHistorySubject = new BehaviorSubject<UserHistory[]>(null);
  public userHistory$ = this.userHistorySubject.asObservable();

  public getPointSuccess: boolean = false;
  public manyGetPoints: boolean = false;
  public awayFromPoint: boolean = false;

  postRequest: boolean = false;
  isLoading: boolean = false;
  isSaving: boolean = false;
  isGettingPoints: boolean = false;

  public locationName: string;
  public locationDescription: string;
  public locationPhoto: string;
  public locationPoints: number;

  user: GeoPoint;
  center: GeoPoint;

  constructor(private http: HttpClient) {}

  verifyQRCode(qrIdNumber: string, coords: GeolocationCoordinates) {
    if (this.isLoading) {
      return;
    }

    this.postRequest = true;
    this.isLoading = true;

    const VerifiedHttpHeaders = this.generateHeaders();

    let fullUrl = this.urls.searchUrl + qrIdNumber;

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
              this.savePoints(points, locationName);
              this.locationPhoto = locationData[0].photo;
            } else {
              this.awayFromPoint = true;
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

  savePoints(points: number, name: string): void {
    if (this.isSaving) {
      return;
    }

    this.isSaving = true;

    const VerifiedHttpHeaders = this.generateHeaders();

    const postData: HistoryPost = new HistoryPost();

    postData.points = points;
    postData.description = 'Ponto Turístico -> ' + name;

    this.http
      .post(this.urls.historyUrl, postData, {
        headers: VerifiedHttpHeaders,
      })
      .subscribe({
        next: (info: HistoryPost) => {
          this.locationPoints = info.points;
          this.locationDescription = info.description;
          // this.locationName = info.
          this.getPointSuccess = true;
          this.isSaving = false;
        },
        error: (e) => {
          this.isSaving = false;
          if (e.status === 429) {
            this.manyGetPoints = true;
          }
        },
      });
  }

  getUserHistory(): Observable<any> {
    const VerifiedHttpHeaders = this.generateHeaders();

    return this.http.get(this.urls.historyUrl, {
      headers: VerifiedHttpHeaders,
    });
  }

  generateHeaders(): HttpHeaders {
    const accessToken: string = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: 'Bearer ' + accessToken,
    });
  }

  redeemUserPrize(): Observable<any> {

    return this.http.get(this.urls.baseUrl)
  }
}
