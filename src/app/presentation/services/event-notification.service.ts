import { Injectable, Signal, inject } from '@angular/core';
import { filter, map, merge, pipe } from 'rxjs';
import { FreeToast, Toast } from '@ui/models';
import { AuthStore } from '@state';
import { toObservable } from '@angular/core/rxjs-interop';
import { Status } from '@shared/models';
import { VegetableStore } from '@state';

@Injectable({
  providedIn: 'root',
})
export class EventNotificationService {
  readonly #authStore = inject(AuthStore);
  readonly #vegetableStore = inject(VegetableStore);

  readonly #authEvents$ = toObservable(this.#authStore.status).pipe(
    this.#extractErrorSuccessToFreeToast(this.#authStore.message),
  );

  readonly #vegetableEvents$ = toObservable(
    this.#vegetableStore.saveStatus,
  ).pipe(this.#extractErrorSuccessToFreeToast(this.#vegetableStore.message));

  readonly eventStream$ = merge(this.#authEvents$, this.#vegetableEvents$).pipe(
    this.#addIdToToast(),
  );

  #extractErrorSuccessToFreeToast(message: Signal<string>) {
    return pipe(
      filter((status: Status) =>
        [Status.Error, Status.Success].includes(status),
      ),
      map(
        (status: Status): FreeToast => ({
          message: message(),
          type: status === Status.Error ? 'error' : 'success',
        }),
      ),
    );
  }

  #addIdToToast() {
    return map((toast: FreeToast, i): Toast => ({ ...toast, id: i + 1 }));
  }
}
