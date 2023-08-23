import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, tap, last } from 'rxjs/operators';
import { AuthenticationService } from '../api/authentication-service.service';

@Injectable({
  providedIn: 'root',
})
export class NegateAuthGuard {
  constructor(private api: AuthenticationService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {

    let cacheAuthUser: boolean = false;
    if (localStorage.getItem('isVerified')) {
      cacheAuthUser = JSON.parse(localStorage.getItem('isVerified')).isVerified;
    }

    return this.api.isAuthenticated.pipe(
      map((isLoggedIn) => {
        if (!isLoggedIn) {
          return true;
        }
        this.router.navigate(['']);
        return false;
      })
    );

    // return this.apiService.isUserVerified().pipe(
    //   map((isLoggedIn) => {
    //     if (!(isLoggedIn || cacheAuthUser)) {
    //       return true;
    //     }
    //     this.router.navigate(['']);
    //     return false;
    //   })
    // );
  }
}
