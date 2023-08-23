import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, catchError, switchMap, take, throwError } from 'rxjs';
import { AuthenticationService } from '../api/authentication-service.service';
import { ApiPointsService } from '../home/api/api-points.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(
    private auth: AuthenticationService,
    private apiPoints: ApiPointsService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this.auth.currentToken.pipe(
      take(1),
      switchMap((token) => {
        if (token) {
          this.auth.userAuthenticated.next(true);
          request = request.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`,
            },
          });
        }
        return next.handle(request).pipe(
          catchError((error) => {
            if (
              error instanceof HttpErrorResponse &&
              error.status === 401 &&
              this.auth.refreshTokenInProgress
            ) {
              return throwError(() => error);
            } else if (
              error instanceof HttpErrorResponse &&
              error.status === 401
            ) {
              return this.handle401Error(request, next);
            }
            // this.auth.userAuthenticated.next(false);
            return throwError(() => error);
          })
        );
      })
    );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    return this.auth.refreshToken().pipe(
      switchMap(() => {
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${this.auth.currentToken.value}`,
          },
        });
        return next.handle(request);
      }),
      catchError((innerError) => {
        console.log('erro');
        this.auth.userAuthenticated.next(false);
        return throwError(() => innerError);
      })
    );
  }
}
