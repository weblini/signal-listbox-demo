import { computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Status } from '@core/models';
import { User } from '@data/models';
import { AuthService } from '@data/services';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';

type AuthState = {
  user: User | undefined;
  status: Status;
};

const initialState: AuthState = {
  user: undefined,
  status: Status.Idle,
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ user }) => ({
    isLoggedIn: computed(() => !!user()),
    canEdit: computed(() => user()?.permissions.includes('edit')),
    canCreate: computed(() => user()?.permissions.includes('create')),
  })),
  withMethods(
    (store, authService = inject(AuthService), router = inject(Router)) => ({
      logout: rxMethod<void>(
        pipe(
          tap(() => {
            patchState(store, { user: undefined });
            router.navigate(['/']);
          }),
        ),
      ),
      login: rxMethod<void>(
        pipe(
          switchMap(() =>
            authService.getUser().pipe(
              tapResponse({
                next: (user) =>
                  patchState(store, { user, status: Status.Success }),
                error: (err) => patchState(store, { status: Status.Error }),
                finalize: () => {
                  setTimeout(
                    () => patchState(store, { status: Status.Idle }),
                    3000,
                  );
                },
              }),
            ),
          ),
        ),
      ),
    }),
  ),
);
