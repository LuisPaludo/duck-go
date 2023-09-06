import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AuthenticationService } from '../api/authentication-service.service';


@Injectable({
  providedIn: 'root',
})

//  código apresentado define um "AuthGuard", que é um mecanismo usado no Angular para
// proteger rotas, garantindo que determinadas condições sejam satisfeitas antes que um usuário possa acessá-las.
// Neste caso, o guard verifica se o usuário está autenticado antes de permitir o acesso

export class AuthGuard{
  constructor(private api: AuthenticationService, private router: Router) {}

  // ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree: São classes e interfaces do módulo de roteamento do
  // Angular, usadas para obter informações sobre a rota ativa, o estado atual do roteador, navegar programaticamente e
  // representar a estrutura de uma URL.
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {

    // Primeiro, o código verifica o localStorage para ver se existe um item chamado 'isVerified'.
    // Se existir, ele obtém o valor, analisa-o e define a variável cacheAuthUser com o valor booleano de isVerified.
    // Esta etapa verifica se o usuário já foi verificado anteriormente e armazena essa informação no cache do navegador.
    let cacheAuthUser:boolean = false;
    if (localStorage.getItem('isVerified')){
      cacheAuthUser = JSON.parse(
        localStorage.getItem('isVerified')
      ).isVerified;
    }

    return this.api.isAuthenticated.pipe(
      // O operador map é usado para transformar o valor emitido por isAuthenticated. Se o usuário não estiver
      // logado (isLoggedIn é false), o código navega o usuário de volta para a rota raiz
      // e retorna false, indicando que a rota não pode ser ativada. Se o usuário estiver logado, ele simplesmente retorna true,
      // permitindo a ativação da rota.
      map(
      isLoggedIn => {
        if (!isLoggedIn) {
          this.router.navigate(['']);
          return false
        }
        return true
      }
    ))

  }
}


