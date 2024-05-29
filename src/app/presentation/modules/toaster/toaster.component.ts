import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { animate, style, transition, trigger } from '@angular/animations';
import { tap, delay } from 'rxjs';

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
        animate('250ms cubic-bezier(0.0, 0.0, 0.2, 1)', style({ opacity: 1, transform: 'translateX(0)' })),
      ]),
      transition(':leave', [
        animate('200ms cubic-bezier(0.4, 0.0, 1, 1)', style({ opacity: 0, transform: 'translateX(100%)' })),
      ]),
    ]),
  ],
})
export class ToasterComponent {
  protected readonly vegetableStore = inject(VegetableStore);
  readonly #errorNotificationService = inject(EventNotificationService);

  Status = Status;

  readonly toasts = signal<Toast[]>([]);

  constructor() {
    this.#errorNotificationService.eventStream$
      .pipe(
        takeUntilDestroyed(),
        tap((toast) => this.toasts.update((prev) => [toast, ...prev])),
        delay(3000),
        tap((toast) =>
          this.toasts.update((prev) => {
            const index = prev.indexOf(toast);
            if (index > -1) {
              prev.splice(index, 1);
              return [...prev];
            }
            return prev;
          }),
        ),
      )
      .subscribe();
  }
}
