import { Component, OnInit } from '@angular/core';
import { Html5Qrcode } from 'html5-qrcode';
import { ApiPointsService } from './api/api-points.service';
import { Router } from '@angular/router';
import { AuthenticationService } from '../api/authentication-service.service';
import { HttpErrorResponse } from '@angular/common/http';
/**
 * HomeComponent - Componente da tela inicial do aplicativo 'duck-go'.
 *
 * Descrição:
 * O componente serve como uma interface central para o aplicativo 'duck-go', permitindo aos usuários
 * ler códigos QR, verificar e resgatar prêmios e gerenciar permissões para câmera e geolocalização.
 *
 * Métodos:
 * - `ngOnInit`: Inicia o componente, verifica permissões e inscreve-se em observáveis.
 * - `checkPermission`: Retorna o estado atual de uma permissão específica (câmera ou geolocalização).
 * - `askCameraPermission` e `dontAllowCamera`: Manipulam a janela de solicitação de permissão da câmera.
 * - `askGeoLocationPermission` e `dontAllowGeoLocation`: Manipulam a janela de solicitação de permissão de geolocalização.
 * - `allowAndGetGeolocation`: Solicita a localização geográfica do usuário e lida com as respostas de sucesso/erro.
 * - `allowAndGetCamera`: Solicita acesso à câmera, obtém a lista de dispositivos e configura o leitor de QR.
 * - `startReading`: Inicia a leitura do código QR através da câmera.
 * - `stopReading`: Interrompe a leitura do código QR.
 * - `redeemUserPrize`: Verifica e exibe o prêmio correspondente ao código QR lido.
 * - `redirectToRegister` e `redirectToLogin`: Redirecionam o usuário para as páginas de registro e login, respectivamente.
 * - `goBack`: Redefine o estado de exibição dos prêmios e erros relacionados.
 * - `useUserPrize`: Resgata o prêmio associado ao código QR lido.
 *
 * Observações:
 * O componente interage com serviços de autenticação, pontos e roteamento para realizar as operações necessárias.
 */

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  title = 'duck-go';

  html5QrCode: Html5Qrcode;
  cameraId: string;

  isReading: boolean = false;
  askCameraPermissionWindow: boolean = false;
  askGeoLocationPermissionWindow: boolean = false;
  buttonDisabler: boolean = false;

  cameraButtonDisable: boolean = false;

  cameraPermissionName = 'camera' as PermissionName;
  geolocationPermissionName = 'geolocation' as PermissionName;

  cameraPermission: string;
  geolocationPermission: string;

  cameraCodeRead: string;
  locationRead: GeolocationCoordinates;

  permissionDenied: boolean = false;

  isVerified: boolean = false;
  promptRegister: boolean = false;
  isPartner: boolean = false;

  userPrize: any;
  usePrizeLoader: boolean = false;
  usePrizeSuccess: boolean = false;

  erroCode: boolean = false;

  constructor(
    public apiPoints: ApiPointsService,
    private api: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isPartner = localStorage.getItem('isPartner') === 'true';
    this.api.userAuthenticated.subscribe({
      next: (isVerified) => {
        if (isVerified) {
          this.isVerified = true;
        } else {
          this.isVerified = false;
        }
      },
    });

    this.api.isPartner$.subscribe({
      next: (isPartner) => {
        this.isPartner = isPartner;
      },
    });

    this.checkPermission(this.cameraPermissionName).then((permission) => {
      this.cameraPermission = permission;
      if (this.cameraPermission === 'denied') {
        this.permissionDenied = true;
      }
    });

    this.checkPermission(this.geolocationPermissionName).then((permission) => {
      this.geolocationPermission = permission;
      if (this.geolocationPermission === 'denied') {
        this.permissionDenied = true;
      }
    });
  }

  private async checkPermission(permission: PermissionName) {
    const permissionStatus = await navigator.permissions.query({
      name: permission,
    });
    return permissionStatus.state;
  }

  askCameraPermission() {
    this.askCameraPermissionWindow = true;
  }

  dontAllowCamera() {
    this.permissionDenied = true;
    this.askCameraPermissionWindow = false;
  }

  askGeoLocationPermission() {
    this.askGeoLocationPermissionWindow = true;
  }

  dontAllowGeoLocation() {
    this.askGeoLocationPermissionWindow = false;
    this.permissionDenied = true;
  }

  allowAndGetGeolocation() {
    this.buttonDisabler = true;

    const successCallback = (position: GeolocationPosition) => {
      this.checkPermission(this.geolocationPermissionName).then(() => {
        setTimeout(() => {
          this.askGeoLocationPermissionWindow = false;
          this.buttonDisabler = false;
          this.locationRead = position.coords;
          this.apiPoints.verifyTouristAttractionQrCode(
            this.cameraCodeRead,
            this.locationRead
          );
        }, 100);
      });
    };

    const errorCallback = () => {
      this.buttonDisabler = false;
      this.permissionDenied = true;
      this.askGeoLocationPermissionWindow = false;
    };

    navigator.geolocation.getCurrentPosition(successCallback, errorCallback, {
      enableHighAccuracy: true,
    });
  }

  allowAndGetCamera() {
    this.buttonDisabler = true;
    Html5Qrcode.getCameras()
      .then((devices) => {
        if (devices && devices.length) {
          this.html5QrCode = new Html5Qrcode('reader');
        }
        this.checkPermission(this.cameraPermissionName).then((permission) => {
          this.cameraPermission = permission;

          if (this.cameraPermission === 'granted') {
            this.buttonDisabler = false;
          }
          if (this.cameraPermission === 'denied') {
            this.permissionDenied = true;
          }
          this.askCameraPermissionWindow = false;
        });
      })
      .catch((err) => {
        this.permissionDenied = true;
        this.askCameraPermissionWindow = false;
        this.buttonDisabler = false;
      });
  }

  startReading() {
    if (!this.isVerified) {
      this.promptRegister = true;
      return;
    }

    this.cameraButtonDisable = true;

    this.checkPermission(this.cameraPermissionName).then((permission) => {
      this.cameraPermission = permission;
      if (this.cameraPermission != 'granted') {
        this.askCameraPermission();
        this.cameraButtonDisable = false;
        return;
      }

      Html5Qrcode.getCameras()
        .then((devices) => {
          if (devices && devices.length) {
            this.html5QrCode = new Html5Qrcode('reader');
            this.html5QrCode.start(
              { facingMode: 'environment' },
              { fps: 10, qrbox: 250 },
              (decodedText, decodedResult) => {
                this.cameraCodeRead = decodedText;

                if (
                  typeof +this.cameraCodeRead === 'number' &&
                  !this.isPartner
                ) {
                  this.stopReading();
                } else if (
                  typeof this.cameraCodeRead === 'string' &&
                  this.isPartner
                ) {
                  this.redeemUserPrize();
                }
              },
              (errorMessage) => {}
            );
            this.isReading = true;
          }
        })
        .catch((err) => {});
    });
  }

  stopReading() {
    if (this.html5QrCode.getState() === 2) {
      this.isReading = false;
      this.html5QrCode
        .stop()
        .then((ignore) => {
          this.cameraButtonDisable = false;
          if (this.cameraCodeRead) {
            if (this.geolocationPermission === 'granted') {
              this.allowAndGetGeolocation();
            } else {
              this.askGeoLocationPermission();
            }
          }
        })
        .catch((err) => {});
    }
  }

  redeemUserPrize() {
    if (this.html5QrCode.getState() === 2) {
      this.isReading = false;
      this.html5QrCode
        .stop()
        .then((ignore) => {
          this.cameraButtonDisable = false;
          if (this.cameraCodeRead) {
            this.apiPoints.waitingResult = true;
            this.apiPoints.checkUserPrize(this.cameraCodeRead).subscribe({
              next: (data) => {
                this.userPrize = data;
                this.apiPoints.checkPrize = true;
                this.apiPoints.waitingResult = false;
              },
              error: (e) => {
                this.apiPoints.waitingResult = false;
                if (e instanceof HttpErrorResponse && e.status === 406) {
                  this.apiPoints.notPrizePartner = true;
                }
                if (e instanceof HttpErrorResponse && e.status === 410) {
                  this.apiPoints.expiredPrize = true;
                }
                if (e instanceof HttpErrorResponse && e.status === 409) {
                  this.apiPoints.invalidPrize = true;
                }
                if (e instanceof HttpErrorResponse && e.status === 400) {
                  this.apiPoints.invalidUserCode = true;
                }
              },
            });
          }
        })
        .catch((err) => {
          // Stop failed, handle it.
        });
    }
  }

  redirectToRegister() {
    this.router.navigate(['register']);
  }

  redirectToLogin() {
    this.router.navigate(['login']);
  }

  goBack() {
    this.apiPoints.getPointSuccess = false;
    this.apiPoints.manyGetPoints = false;
    this.apiPoints.awayFromPoint = false;
    this.apiPoints.invalidPrize = false;
    this.apiPoints.expiredPrize = false;
    this.apiPoints.notPrizePartner = false;
    this.apiPoints.checkPrize = false;
    this.cameraCodeRead = null;
    this.usePrizeSuccess = false;
    this.apiPoints.invalidCode = false;
    this.apiPoints.invalidUserCode = false;
  }

  useUserPrize() {
    this.apiPoints.waitingResult = true;
    this.usePrizeLoader = true;
    this.apiPoints.redeemUserPrize(this.cameraCodeRead).subscribe({
      next: (data) => {
        this.apiPoints.waitingResult = false;
        this.usePrizeLoader = false;
        this.usePrizeSuccess = true;
      },
      error: (e) => {
        this.apiPoints.waitingResult = false;
        this.usePrizeLoader = false;
        if (e instanceof HttpErrorResponse && e.status === 406) {
          this.apiPoints.notPrizePartner = true;
        }
        if (e instanceof HttpErrorResponse && e.status === 410) {
          this.apiPoints.expiredPrize = true;
        }
        if (e instanceof HttpErrorResponse && e.status === 409) {
          this.apiPoints.invalidPrize = true;
        }
      },
    });
  }
}
