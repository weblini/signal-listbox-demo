import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { animate, style, transition, trigger } from '@angular/animations';
import { tap, delay, mergeMap, timer, map, take, scan } from 'rxjs';

import { VegetableStore } from '@core/store/vegetables.store';
import { Status } from '@core/models';

import { EventNotificationService } from '@ui/services/event-notification.service';
import { Toast } from '@ui/models';

@Component({
  selector: 'app-toaster',
  standalone: true,
  imports: [],
  templateUrl: './toaster.component.html',
  styleUrl: './toaster.component.css',
  animations: [
    trigger('animation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(100%)' }),
        animate(
          '250ms cubic-bezier(0.0, 0.0, 0.2, 1)',
          style({ opacity: 1, transform: 'translateX(0)' }),
        ),
      ]),
      transition(':leave', [
        animate(
          '200ms cubic-bezier(0.4, 0.0, 1, 1)',
          style({ opacity: 0, transform: 'translateX(100%)' }),
        ),
      ]),
    ]),
  ],
})
export class ToasterComponent {
  protected readonly vegetableStore = inject(VegetableStore);
  readonly #errorNotificationService = inject(EventNotificationService);

  Status = Status;

  // readonly toasts = signal<Toast[]>([]);

  // constructor() {
  //   this.#errorNotificationService.eventStream$
  //     .pipe(
  //       takeUntilDestroyed(),
  //       tap((toast) => this.toasts.update((prev) => [toast, ...prev])),
  //       delay(3000),
  //       tap((toast) =>
  //         this.toasts.update((prev) => {
  //           return this.#getArrayWithoutItem(prev, toast);
  //         }),
  //       ),
  //     )
  //     .subscribe();
  // }

  protected readonly toastsRx = toSignal(
    this.#errorNotificationService.eventStream$.pipe(
      mergeMap((toast) =>
        timer(0, 3000).pipe(
          take(2),
          map((isDeferred) => ({ remove: !!isDeferred, toast })),
        ),
      ),
      scan(
        (toasts, newToast) =>
          newToast.remove
            ? this.#getArrayWithoutItem(toasts, newToast.toast)
            : [newToast.toast, ...toasts],
        <Toast[]>[],
      ),
    ),
  );

  #getArrayWithoutItem<A>(array: A[], item: A) {
    const index = array.indexOf(item);
    if (index > -1) {
      array.splice(index, 1);
      return [...array];
    }
    return array;
  }
}
