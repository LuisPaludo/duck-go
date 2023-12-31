import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GeoPoint } from '../models/GeoPoint';
import { PointData } from '../models/PointData';
import { UserHistory } from '../models/history';
import { HistoryPost } from '../models/historypost';
import { Urls } from 'src/app/utils/urls';
/**
 * ApiPointsService - Serviço para gerenciar e interagir com pontos de usuários e recompensas baseadas em localização.
 *
 * Propriedades:
 * 1. `userHistorySubject` - Contém os dados do histórico do usuário como um observable.
 * 2. Indicadores para gerenciar o estado da aplicação, por exemplo, `isLoading`, `postRequest`, `isSaving`, `isGettingPoints` etc.
 * 3. Detalhes da localização como `locationName`, `locationDescription`, `locationPhoto` e `locationPoints`.
 * 4. `user` e `center` - Representam a geolocalização atual do usuário e a geolocalização do ponto turístico atual, respectivamente.
 *
 * Métodos:
 * 1. `verifyQRCode(qrIdNumber: string, coords: GeolocationCoordinates)` - Verifica um QR code escaneado em um endpoint da API,
 *    verifica a proximidade do usuário a um ponto turístico e concede pontos se estiver suficientemente perto.
 *
 * 2. `isWithinRadius(user: GeoPoint, center: GeoPoint, radius = 100): boolean` - Verifica se o usuário está dentro de um raio
 *    especificado (padrão é 100 metros) de um ponto turístico, usando a fórmula de haversine para calcular a distância entre duas geolocalizações.
 *
 * 3. `savePoints(points: number, name: string): void` - Salva os pontos no histórico do usuário após visitar um ponto turístico.
 *
 * 4. `getUserHistory(): Observable<any>` - Busca o histórico de pontos do usuário de um endpoint da API.
 *
 * 5. `redeemUserPrize(code: string): Observable<any>` - Permite ao usuário Parceiro resgatar um prêmio de um usuário convencional usando um código.
 *
 * 6. `checkUserPrize(code: string): Observable<any>` - Verifica se o código de prêmio do usuário é válido.
 *
 * Este serviço facilita principalmente as interações entre o usuário e os pontos turísticos em um sistema baseado em recompensas.
 */
@Injectable({
  providedIn: 'root',
})
export class ApiPointsService {
  private urls: Urls = new Urls();

  public getPointSuccess: boolean = false;
  public manyGetPoints: boolean = false;
  public awayFromPoint: boolean = false;
  public checkPrize: boolean = false;
  public invalidCode: boolean = false;

  public notPrizePartner: boolean = false;
  public invalidPrize: boolean = false;
  public expiredPrize: boolean = false;
  public invalidUserCode: boolean = false;

  isSaving: boolean = false;

  public locationName: string;
  public locationDescription: string;
  public locationPhoto: string;
  public locationPoints: number;

  public waitingResult: boolean = false;

  user: GeoPoint;
  center: GeoPoint;

  constructor(private http: HttpClient) {}

  verifyTouristAttractionQrCode(
    qrIdNumber: string,
    userCoords: GeolocationCoordinates
  ) {
    if (this.waitingResult) {
      return;
    }

    this.waitingResult = true;

    let fullUrl = this.urls.touristAttaction + qrIdNumber;

    this.http.get(fullUrl).subscribe({
      next: (locationData: PointData[]) => {
        if (locationData.length !== 0) {
          const points = locationData[0].points;
          const locationName = locationData[0].name;

          this.center = {
            latitude: locationData[0].coordinates_lat,
            longitude: locationData[0].coordinates_long,
          };

          this.user = {
            latitude: userCoords.latitude,
            longitude: userCoords.longitude,
          };

          const result = this.isWithinRadius(this.user, this.center);

          if (result) {
            this.savePoints(points, locationName).subscribe({
              next: (info: HistoryPost) => {
                this.locationPoints = info.points;
                this.locationDescription = info.description;
                this.getPointSuccess = true;
                this.isSaving = false;
                this.waitingResult = false;
              },
              error: (e) => {
                this.isSaving = false;
                this.waitingResult = false;

                if (e.status === 429) {
                  this.manyGetPoints = true;
                }
              },
            });
            this.locationPhoto = locationData[0].photo;
          } else {
            this.awayFromPoint = true;
            this.waitingResult = false;
          }
        } else {
          this.invalidCode = true;
          this.waitingResult = false;
        }
      },
      error: (e) => {
        this.waitingResult = false;
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

  savePoints(points: number, name: string): Observable<any> {
    if (this.isSaving) {
      return;
    }

    this.isSaving = true;

    const postData: HistoryPost = new HistoryPost();

    postData.points = points;
    postData.description = 'Ponto Turístico -> ' + name;

    return this.http.post(this.urls.history, postData);
  }

  getUserHistory(): Observable<any> {
    return this.http.get(this.urls.history);
  }

  redeemUserPrize(code: string): Observable<any> {
    const postData = {
      code: code,
    };
    return this.http.post(this.urls.recover, postData);
  }

  checkUserPrize(code: string): Observable<any> {
    const postData = {
      code: code,
    };
    return this.http.post(this.urls.check, postData);
  }
}
