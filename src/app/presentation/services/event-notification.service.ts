import { Injectable, inject } from '@angular/core';
import { filter, map, merge, tap } from 'rxjs';
import { FreeToast, Toast } from '@ui/models';
import { AuthStore } from '@core/store/auth.store';
import { toObservable } from '@angular/core/rxjs-interop';
import { Status } from '@core/models';
import { VegetableStore } from '@core/store/vegetables.store';

@Injectable({
  providedIn: 'root',
})
export class EventNotificationService {
  readonly #authStore = inject(AuthStore);
  readonly #vegetableStore = inject(VegetableStore);

  protected readonly authEvents$ = toObservable(this.#authStore.status).pipe(
    filter((status) => status === Status.Error || status === Status.Success),
    map(
      (status): FreeToast => ({
        message: this.#authStore.message(),
        type: status === Status.Error ? 'error' : 'success',
      }),
    ),
  );

  protected readonly vegetableEvents$ = toObservable(
    this.#vegetableStore.saveStatus,
  ).pipe(
    filter((status) => status === Status.Error || status === Status.Success),
    map(
      (status): FreeToast => ({
        message: this.#vegetableStore.message(),
        type: status === Status.Error ? 'error' : 'success',
      }),
    ),
  );

  readonly eventStream$ = merge(this.authEvents$, this.vegetableEvents$).pipe(
    map((toast, i): Toast => ({ ...toast, id: i + 1 })),
  );
}
