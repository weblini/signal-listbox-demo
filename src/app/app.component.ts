import {
  Component,
  effect,
  inject,
  OnDestroy,
  signal,
  viewChild,
  WritableSignal,
} from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Listbox, Option, Orientation } from './listbox';
import { Vegetable } from './vegetables.service';
import { CardComponent } from './card/card.component';
import { JsonPipe } from '@angular/common';
import { trigger, style, animate, transition } from '@angular/animations';
import { Subscription } from 'rxjs';
import { VegetableFormComponent } from './vegetable-form/vegetable-form.component';
import { VegetableEditorComponent } from './vegetable-editor/vegetable-editor.component';
import { VegetableStore } from './vegetables.store';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    Listbox,
    Option,
    CardComponent,
    JsonPipe,
    VegetableFormComponent,
    VegetableEditorComponent,
  ],
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
export class AppComponent implements OnDestroy {
  private readonly URL_IDS_PARAM = 'ids';
  private readonly router: Router = inject(Router);

  protected readonly vegetableStore = inject(VegetableStore);

  readonly listBox = viewChild<Listbox<Vegetable>>('listbox');

  protected readonly selectedToppings: WritableSignal<Vegetable[]> = signal([]);

  protected orientation = signal<Orientation>(Orientation.Horizontal);

  private reloadSub: Subscription | undefined;

  constructor() {
    this.selectToppingsFromUrlAfterDataLoaded();
    this.vegetableStore.loadAll();
  }
  ngOnDestroy(): void {
    this.reloadSub?.unsubscribe();
  }

  private selectToppingsFromUrlAfterDataLoaded() {
    effect(
      () => {
        const availableVegetables = this.vegetableStore.vegetables();
        if (availableVegetables?.length) {
          const searchParams = new URLSearchParams(window.location.search);
          const currentIds =
            searchParams.get(this.URL_IDS_PARAM)?.split(',') ?? [];
          const currentVegetables = availableVegetables.filter(
            (v) => v.id && currentIds.includes(v.id.toString())
          );
          this.selectedToppings.set(currentVegetables);
        }
      },
      { allowSignalWrites: true }
    );
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
    console.log('Current orientation is: ', newOrientation);
  }

  toggleOrientation() {
    this.orientation.update((oldValue) =>
      oldValue === Orientation.Horizontal
        ? Orientation.Vertical
        : Orientation.Horizontal
    );
  }
}
