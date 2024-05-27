import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

interface User {
  id: number;
  name: string;
  permissions: UserAction[];
}

type UserAction = 'edit' | 'create';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly #USERS_URL = 'http://localhost:3000/users';
  readonly #http = inject(HttpClient);
  readonly #router = inject(Router);

  #isLoggedIn = signal(true);

  get isLoggedIn() {
    return computed(() => this.#isLoggedIn())
  }

  constructor() {}

  getAllUsers() {
    return this.#http.get(this.#USERS_URL);
  }

  toggleUser() {
    this.#isLoggedIn() ? this.logout() : this.login();
  }

  logout() {
    this.#isLoggedIn.set(false);
    this.#router.navigate(['']);
  }

  login() {
    this.#isLoggedIn.set(true);
  }
}
