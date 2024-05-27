import { inject } from '@angular/core';
import { CanMatchFn } from '@angular/router';
import { AuthService } from './auth.service';

export const permissionGuard: CanMatchFn = (route, segments) => {
  return inject(AuthService).isLoggedIn();
};
