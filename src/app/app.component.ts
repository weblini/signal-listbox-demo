import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Status, VegetableStore } from './vegetables.store';
import { ToasterComponent } from './toaster/toaster.component';
import { AuthService } from './auth.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToasterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  animations: [
    trigger('jumpIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-100%)' }),
        animate(
          '100ms cubic-bezier(0.0, 0.0, 0.2, 1)',
          style({ opacity: 1, transform: 'translateX(0)' })
        ),
      ]),
      transition(':leave', [
        animate(
          '100ms cubic-bezier(0.4, 0.0, 1, 1)',
          style({ opacity: 0, transform: 'translateX(-100%)' })
        ),
      ]),
    ])
  ]
})
export class AppComponent {
  protected readonly vegetableStore = inject(VegetableStore);

  protected readonly authService = inject(AuthService);

  Status = Status;

  constructor() {
    this.vegetableStore.loadAll();
  }
}
