import { Component, effect, inject, Signal, signal, WritableSignal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Listbox, Option, Orientation } from './listbox';
import { Vegetable, VegetablesService } from './vegetables.service';
import { CardComponent } from './card/card.component';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { trigger, style, animate, transition } from '@angular/animations';
import { toSignal } from '@angular/core/rxjs-interop';

// TODO: add signalstore to hold app state and talk to the data service

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Listbox, Option, CardComponent, JsonPipe, AsyncPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  animations: [
    trigger('myInsertRemoveTrigger', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('250ms cubic-bezier(0.0, 0.0, 0.2, 1)', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('200ms cubic-bezier(0.4, 0.0, 1, 1)', style({ opacity: 0 })),
      ]),
    ]),
    trigger('offsetEnter', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate(
          '250ms 250ms cubic-bezier(0.0, 0.0, 0.2, 1)',
          style({ opacity: 1 })
        ),
      ]),
    ]),
  ],
})
export class AppComponent {
  private readonly URL_IDS_PARAM = 'ids';
  private readonly router: Router = inject(Router);
  private readonly vegetableService: VegetablesService = inject(VegetablesService);

  protected readonly availableVegetables: Signal<Vegetable[] | undefined> = toSignal(this.vegetableService.getVegetables());
  protected readonly selectedToppings: WritableSignal<Vegetable[]> = signal([]);

  protected orientation = signal<Orientation>(Orientation.Horizontal);

  constructor() {
    this.selectToppingsFromUrlAfterDataLoaded();
  }

  private selectToppingsFromUrlAfterDataLoaded() {
    effect(() => {
      const availableVegetables = this.availableVegetables();
      if (availableVegetables?.length) {
        const searchParams = new URLSearchParams(window.location.search);
        const currentIds = searchParams.get(this.URL_IDS_PARAM)?.split(',') ?? [];
        const currentVegetables = availableVegetables.filter(v => currentIds.includes(v.id.toString()));
        this.selectedToppings.set(currentVegetables);
      }
    }, {allowSignalWrites: true});
  }

  updateQueryParams(newSelection: Vegetable[]) {
    const newIds = newSelection.map((vegetable) => vegetable.id).join(',');
    const queryParams = { [this.URL_IDS_PARAM]: newIds };
    this.router.navigate([], {
      queryParams,
      replaceUrl: true,
    });
  }

  logOrientationChange(newOrientation: Orientation) {
    console.log(newOrientation);
  }

  toggleOrientation() {
    this.orientation.update((oldValue) =>
      oldValue === Orientation.Horizontal
        ? Orientation.Vertical
        : Orientation.Horizontal
    );
  }
}
