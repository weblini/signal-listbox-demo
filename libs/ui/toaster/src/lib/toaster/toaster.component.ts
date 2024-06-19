import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { animate, style, transition, trigger } from '@angular/animations';
import { mergeMap, timer, map, take, scan, pipe } from 'rxjs';

import { VegetableStore } from '@state';
import { Status } from '@shared/models';

import { EventNotificationService } from '../services/event-notification.service';
import { Toast } from '../models';

@Component({
  selector: 'lib-toaster',
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

  protected readonly toastsRx = toSignal(
    this.#errorNotificationService.eventStream$.pipe(this.#pullIntoArrayFor(3000)),
  );

  #pullIntoArrayFor(displayFor: number) {
    return pipe(
      mergeMap((toast: Toast) =>
        timer(0, displayFor).pipe(
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
    );
  }

  #getArrayWithoutItem<A>(array: A[], item: A) {
    const index = array.indexOf(item);
    if (index > -1) {
      array.splice(index, 1);
      return [...array];
    }
    return array;
  }
}
