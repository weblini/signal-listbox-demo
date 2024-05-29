import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { FreeToast, Toast } from '@ui/models';



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
