import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class UnAuthGuard implements CanActivate {
  public constructor(private authService: AuthService) {}

  public canActivate(): boolean {
    return !this.authService.isAuthorize();
  }
}
