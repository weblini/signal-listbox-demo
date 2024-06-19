import { inject } from '@angular/core';
import { CanMatchFn } from '@angular/router';
import { AuthStore } from '../store/auth.store';

export const permissionGuard: CanMatchFn = () => {
  const authStore = inject(AuthStore);

  return authStore.isLoggedIn();
};
