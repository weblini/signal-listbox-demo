import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly #router = inject(Router);

  #isLoggedIn = true;

  toggleUser() {
    this.#isLoggedIn ? this.logout() : this.login();
  }

  logout() {
    this.#isLoggedIn = false;
    this.#router.navigate(['']);
  }

  login() {
    this.#isLoggedIn = true;
  }

  get isLoggedIn() {
    return this.#isLoggedIn;
  }

  constructor() {}
}
