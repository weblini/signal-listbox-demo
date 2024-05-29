import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, catchError, retry, take, tap } from 'rxjs';

import { EventNotificationService } from './event-notification.service';
import { User } from '@data/models';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly #USERS_URL = 'http://localhost:3000/users';
  readonly #http = inject(HttpClient);
  readonly #router = inject(Router);
  readonly #eventNotificationService = inject(EventNotificationService);

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
    if (this.isLoggedIn()) {
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

    this.#sub = this.#getUser(this.#requestedUserId)
      .pipe(
        tap({
          error: (err) => {
            if (err.status === 404) {
              this.#requestedUserId = 1;
            }
          },
        }),
        catchError((err, caught) => {
          return this.#getUser(this.#requestedUserId);
        }),
        tap({
          next: (user) => {
            this.currentUser.set(user);
            this.#requestedUserId++;
            this.status.set(Status.Idle);
          },
          error: (err) => {
            this.#eventNotificationService.toastEvent({
              message: 'Failed to log in',
              type: 'error',
            });
            this.status.set(Status.Idle);
          },
        }),
      )
      .subscribe();
  }

  #getUser(id: number) {
    return this.#http.get<User>(this.#USERS_URL + '/' + id);
  }
}