import { Component, inject } from '@angular/core';
import { Status, VegetableStore } from '../vegetables.store';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-toaster',
  standalone: true,
  imports: [],
  templateUrl: './toaster.component.html',
  styleUrl: './toaster.component.css',
  animations: [
    trigger('animation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('250ms cubic-bezier(0.0, 0.0, 0.2, 1)', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('200ms cubic-bezier(0.4, 0.0, 1, 1)', style({ opacity: 0 })),
      ]),
    ]),
  ]
})
export class ToasterComponent {
  protected readonly vegetableStore = inject(VegetableStore);

  Status = Status;
}
