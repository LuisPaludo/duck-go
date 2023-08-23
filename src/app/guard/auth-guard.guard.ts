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

export class AuthGuard{
  constructor(private api: AuthenticationService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {

    let cacheAuthUser:boolean = false;
    if (localStorage.getItem('isVerified')){
      cacheAuthUser = JSON.parse(
        localStorage.getItem('isVerified')
      ).isVerified;
    }

    return this.api.isAuthenticated.pipe(map(
      isLoggedIn => {
        if (!isLoggedIn) {
          this.router.navigate(['']);
          return false
        }
        return true
      }
    ))


    // return this.apiService.isUserVerified().pipe(
    //   map(isLoggedIn => {
    //     if (!(isLoggedIn || cacheAuthUser)) {
    //       this.router.navigate(['']);
    //       return false
    //     }
    //       return true
    //   })
    // )
  }
}


