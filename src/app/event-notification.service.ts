import { Injectable, signal } from '@angular/core';
import { Subject, delay, tap } from 'rxjs';

export interface Toast {
  id: number;
  message: string;
  type?: 'error' | 'success';
  retryAction?: () => void;
}

export type FreeToast = Omit<Toast, 'id'>;

@Injectable({
  providedIn: 'root',
})
export class EventNotificationService {
  readonly eventStream$ = new Subject<Toast>();
  #idCount = 1;

  toastEvent(toast: FreeToast) {
    this.eventStream$.next({ ...toast, id: this.#idCount });
    this.#idCount++;
  }
}
