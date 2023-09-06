import { Component, OnInit } from '@angular/core';
import { Html5Qrcode, Html5QrcodeScanner } from 'html5-qrcode';
import { ApiPointsService } from './api/api-points.service';
import { ApiService } from '../api/api.service';
import { Router } from '@angular/router';
import { AuthenticationService } from '../api/authentication-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  title = 'duck-go';

  html5QrCode: Html5Qrcode;
  cameraId: string;

  reading: boolean = false;
  cameraReady: boolean = false;
  geoReady: boolean = false;
  buttonDisabler: boolean = false;

  cameraButtonDisable: boolean = false;

  cameraPermissionName = 'camera' as PermissionName;
  geolocationPermissionName = 'geolocation' as PermissionName;

  cameraPermission: string;
  geolocationPermission: string;

  cameraCodeRead: number;
  locationRead: GeolocationCoordinates;

  permissionDenied: boolean = false;

  isVerified: boolean = false;
  promptRegister: boolean = false;
  isPartner:boolean = false;

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
      }
    })

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

  askCamera() {
    this.cameraReady = true;
  }

  dontGetCamera() {
    this.permissionDenied = true;
    this.cameraReady = false;
  }

  getGeolocation() {
    this.geoReady = true;
  }

  deniedGeolocation() {
    this.geoReady = false;
    this.permissionDenied = true;
  }

  getGeolocationPermission() {
    this.buttonDisabler = true;

    const successCallback = (position: GeolocationPosition) => {
      this.checkPermission(this.geolocationPermissionName).then(
        (permission) => {
          this.geoReady = false;
          if (permission === 'granted') {
            this.buttonDisabler = false;
            this.locationRead = position.coords;
            this.apiPoints.verifyQRCode(this.cameraCodeRead, this.locationRead);
          } else {
            this.buttonDisabler = false;
          }
        }
      );
    };

    const errorCallback = (error) => {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          console.log('O usuário não permitiu a geolocalização.');
          break;
        case error.POSITION_UNAVAILABLE:
          console.log('Informação de localização não está disponível.');
          break;
        case error.TIMEOUT:
          console.log(
            'A solicitação para obter a localização do usuário expirou.'
          );
          break;
        case error.UNKNOWN_ERROR:
          console.log('Ocorreu um erro desconhecido.');
          break;
      }
      this.buttonDisabler = false;
      this.permissionDenied = true;
      this.geoReady = false;
    };

    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
  }

  getCamera() {
    this.buttonDisabler = true;
    Html5Qrcode.getCameras()
      .then((devices) => {
        if (devices && devices.length) {
          this.html5QrCode = new Html5Qrcode('reader');
        }

        this.checkPermission(this.cameraPermissionName).then((permission) => {
          this.cameraPermission = permission;

          if (this.cameraPermission === 'granted') {
            this.cameraReady = false;
            this.buttonDisabler = false;
          }
          if (this.cameraPermission === 'denied') {
            this.permissionDenied = true;
          }
        });
      })
      .catch((err) => {
        this.permissionDenied = true;
        this.cameraReady = false;
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
        this.askCamera();
        this.cameraButtonDisable = false;
        return;
      }

      Html5Qrcode.getCameras()
        .then((devices) => {
          if (devices && devices.length) {
            // this.cameraId = devices[0].id;
            this.html5QrCode = new Html5Qrcode('reader');
            this.html5QrCode
              .start(
                { facingMode: 'environment' },
                { fps: 10, qrbox: 250 },
                (decodedText, decodedResult) => {
                  this.cameraCodeRead = +decodedText;
                  if (typeof this.cameraCodeRead === 'number') {
                    this.stopReading();
                  }
                },
                (errorMessage) => {}
              )
              .catch((err) => {
                // Start failed, handle it.
              });
            this.reading = true;
          }
        })
        .catch((err) => {
          // handle err
        });
    });
  }

  stopReading() {
    if (this.html5QrCode.getState() === 2) {
      this.reading = false;
      this.html5QrCode
        .stop()
        .then((ignore) => {
          this.cameraButtonDisable = false;
          if (this.cameraCodeRead) {
            console.log(this.geolocationPermission);
            if (this.geolocationPermission === 'granted') {
              this.getGeolocationPermission();
            } else {
              this.getGeolocation();
            }
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
  }
}
