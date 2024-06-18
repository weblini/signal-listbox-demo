import { inject } from '@angular/core';
import { CanMatchFn } from '@angular/router';
import { AuthStore } from '@state';

export const permissionGuard: CanMatchFn = (route, segments) => {
  const authStore = inject(AuthStore);

  return authStore.isLoggedIn();
};
