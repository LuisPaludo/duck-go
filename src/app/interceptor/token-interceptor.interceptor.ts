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
  // Adiciono o service responsável pelos métodos de autenticação do usuário
  constructor(private auth: AuthenticationService) {}

  // Chamada do método intercept
  intercept(
    // A requisição HTTP que está sendo feita
    request: HttpRequest<any>,
    // Um objeto que permite que você passe a requisição para o próximo interceptor na cadeia
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    //  Pega o token atual do serviço auth
    return this.auth.currentToken.pipe(
      // Pega apenas um valor do Observable e, em seguida, completa. Isso garante que o código dentro do switchMap seja chamado apenas uma vez.
      take(1),
      // switchMap é um operador RxJS que mapeia os valores emitidos para um novo Observable.
      switchMap((token) => {
        // Se o token existir:
        if (token) {
          // Identiico o usuário como autenticado atualizando o observable
          this.auth.userAuthenticated.next(true);
          // Clona o objeto HttpRequest para ser imutável e define o cabeçalho de autorização com o token.
          request = request.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`,
            },
          });
        }
        // Passa a requisição para o próximo interceptor ou para o backend se não houver mais interceptores.
        return next.handle(request).pipe(
          // captura erros que podem ocorrer ao lidar com a requisição.
          catchError((error) => {
            // Se o erro for um HttpErrorResponse com um código de status 401 (não autorizado)
            // e o token de atualização já estiver em andamento, ele retorna o erro.
            if (
              error instanceof HttpErrorResponse &&
              error.status === 401 &&
              this.auth.refreshTokenInProgress
            ) {
              return throwError(() => error);

            }
            // Se o erro for um HttpErrorResponse com um código de status 401 e o token de atualização
            //  não estiver em andamento, ele tentará manipular o erro chamando
            else if (
              error instanceof HttpErrorResponse &&
              error.status === 401
            ) {
              return this.handle401Error(request, next);
            }
            // Caso contrário, ele simplesmente lança o erro.
            return throwError(() => error);
          })
        );
      })
    );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    // Tenta atualizar o token.
    return this.auth.refreshToken().pipe(
      // Se o token for atualizado com sucesso, ele mapeia o valor para um novo Observable.
      switchMap(() => {
        // Clona o objeto HttpRequest e define o cabeçalho de autorização com o novo token.
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${this.auth.currentToken.value}`,
          },
        });
        //  Reenvia a requisição com o novo token.
        return next.handle(request);
      }),
      // Captura qualquer erro que possa ocorrer após tentar atualizar o token.
      catchError((innerError) => {
        // Indica que o usuário não está mais autenticado
        this.auth.userAuthenticated.next(false);
        // Lança o erro.
        return throwError(() => innerError);
      })
    );
  }
}
