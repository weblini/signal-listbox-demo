import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Listbox, Option, Orientation } from './listbox';
import { Vegetable, VegetablesService } from './vegetables.service';
import { CardComponent } from './card/card.component';
import { JsonPipe } from '@angular/common';
import {
  trigger,
  style,
  animate,
  transition
} from '@angular/animations';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Listbox, Option, CardComponent, JsonPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  animations: [
    trigger('myInsertRemoveTrigger', [
      transition(':enter', [style({opacity: 0}), animate('250ms cubic-bezier(0.0, 0.0, 0.2, 1)', style({opacity: 1}))]),
      transition(':leave', [animate('200ms cubic-bezier(0.4, 0.0, 1, 1)', style({opacity: 0}))]),
    ]),
  ],
})
export class AppComponent {
  title = 'try-signals';

  private vegetableService = inject(VegetablesService);
  protected readonly availableVegetables =
    this.vegetableService.getVegetables();
  protected selectedToppings: Vegetable[] = [];

  private router = inject(Router);

  protected orientation = signal<Orientation>('vertical');

  constructor() {
    const searchParams = new URLSearchParams(window.location.search);
    const currentIds = searchParams.get('ids')?.split(',') ?? [];

    let selectionFromQuery: Vegetable[] = [];
    for (const id of currentIds) {
      const matchedVegetable = this.availableVegetables.find(
        (vegetable) => vegetable.id === Number(id)
      );
      if (matchedVegetable) {
        selectionFromQuery.push(matchedVegetable);
      }
    }

    this.selectedToppings = selectionFromQuery;
  }

  updateQueryParams(newSelection: Vegetable[]) {
    const newIds = newSelection.map((vegetable) => vegetable.id).join(',');

    this.router.navigate([], {
      queryParams: {
        ids: newIds,
      },
    });
  }

  logOrientationChange(newOrientation: Orientation) {
    console.log(newOrientation);
  }

  toggleOrientation() {
    this.orientation.update((oldValue) =>
      oldValue === 'horizontal' ? 'vertical' : 'horizontal'
    );
  }
}
