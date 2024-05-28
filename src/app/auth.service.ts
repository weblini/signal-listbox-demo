import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, catchError, retry, take, tap } from 'rxjs';
import { Status } from './vegetables.store';

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
  status = signal<Status>(Status.Idle);

  isLoggedIn = computed(() => !!this.currentUser());
  canEdit = computed(() => this.currentUser()?.permissions.includes('edit'));
  canCreate = computed(() =>
    this.currentUser()?.permissions.includes('create'),
  );

  swapUser() {
    console.log(this.currentUser());
    if (this.currentUser()) {
      this.#logout();
    } else {
      this.#loadNextUser();
    }
  }

  #logout() {
    this.currentUser.set(null);
    this.#router.navigate(['']);
  }

  #loadNextUser() {
    if (this.#sub) {
      this.#sub.unsubscribe();
    }

    this.status.set(Status.Loading);

    this.#sub = this.#http
      .get<User>(this.#USERS_URL + '/' + this.#requestedUserId)
      .subscribe({
        next: (user) => {
          this.currentUser.set(user);
          this.#requestedUserId++;
          this.status.set(Status.Idle);
        },
        error: (err) => {
          this.#requestedUserId = 1;
          this.status.set(Status.Idle);
        },
      });
  }
}