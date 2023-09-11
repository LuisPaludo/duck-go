import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable, map } from 'rxjs';
import { AuthenticationService } from '../api/authentication-service.service';

@Injectable({
  providedIn: 'root',
})
export class PartnerGuard {
  constructor(private router: Router, private api: AuthenticationService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (localStorage.getItem('isPartner') === 'true') {
      return true;
    }

    this.router.navigate(['']);
    return false;
  }
}
