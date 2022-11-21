import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  public canActivate(): boolean {
    if (!this.authService.isAuthorize()) {
      this.router.navigateByUrl(`user/signin?backUrl=${this.router.url}`);
      return false;
    }
    return true;
  }
}
