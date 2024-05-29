import { inject } from '@angular/core';
import { CanMatchFn } from '@angular/router';
import { AuthService } from './auth.service';

export const permissionGuard: CanMatchFn = (route, segments) => {
  const authService = inject(AuthService);
  
  return authService.isLoggedIn();
};