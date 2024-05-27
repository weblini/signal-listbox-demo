import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

export interface User {
  id: number;
  name: string;
  permissions: UserAction[];
}

export type UserAction = 'edit' | 'create';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly #USERS_URL = 'http://localhost:3000/users';
  readonly #http = inject(HttpClient);
  readonly #router = inject(Router);

  #sub: Subscription | undefined;
  #requestedUserId = 1;

  currentUser = signal<User | null>(null);

  isLoggedIn = computed(() => !!this.currentUser());
  canEdit = computed(() => this.currentUser()?.permissions.includes('edit'));
  canCreate = computed(() =>
    this.currentUser()?.permissions.includes('create'),
  );

  swapUser() {
    if (this.currentUser()) {
      this.#logout();
      return;
    }

    this.#loadNextUser();
  }

  #logout() {
    this.currentUser.set(null);
    this.#router.navigate(['']);
  }

  #loadNextUser() {
    if (this.#sub) {
      this.#sub.unsubscribe();
    }

    this.#sub = this.#http
      .get<User>(this.#USERS_URL + '/' + this.#requestedUserId)
      .subscribe({
        next: (user) => {
          this.currentUser.set(user);
          this.#requestedUserId++;
        },
        error: (err) => (this.#requestedUserId = 1),
      });
  }
}
