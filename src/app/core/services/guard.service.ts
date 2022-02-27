import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { AuthService } from './auth.service';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root'
})
export class GuardService implements CanActivate {

  constructor(
    private router: Router,
    private authService: AuthService,
    private sessionService: SessionService,
  ) {

  }

  canActivate(route: import('@angular/router').ActivatedRouteSnapshot, state: import('@angular/router').RouterStateSnapshot): boolean {
    const isSignin = this.authService.isSignin();

    if (!isSignin) {
      this.router.navigate(['/auth/sign-in']);

      return false;
    }

    return true;
  }

}
