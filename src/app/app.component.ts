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
import { Vegetable, VegetablesService } from './vegetables.service';
import { CardComponent } from './card/card.component';
import { JsonPipe } from '@angular/common';
import { trigger, style, animate, transition } from '@angular/animations';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, finalize, Subscription } from 'rxjs';
import { VegetableFormComponent } from './vegetable-form/vegetable-form.component';
import { AddVegetableBtnComponent } from './add-vegetable-btn/add-vegetable-btn.component';
import { VegetableEditorComponent } from './vegetable-editor/vegetable-editor.component';

// TODO: add signalstore to hold app state and talk to the data service

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
    AddVegetableBtnComponent,
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
  private readonly vegetableService: VegetablesService =
    inject(VegetablesService);

  readonly listBox = viewChild<Listbox<Vegetable>>('listbox');

  protected readonly availableVegetables: WritableSignal<Vegetable[]> = signal(
    []
  );
  protected readonly selectedToppings: WritableSignal<Vegetable[]> = signal([]);

  protected orientation = signal<Orientation>(Orientation.Horizontal);

  protected readonly loading = signal(true);

  private reloadSub: Subscription | undefined;

  constructor() {
    this.selectToppingsFromUrlAfterDataLoaded();
    this.loadInitialData();
  }
  ngOnDestroy(): void {
    this.reloadSub?.unsubscribe();
  }

  private selectToppingsFromUrlAfterDataLoaded() {
    effect(
      () => {
        const availableVegetables = this.availableVegetables();
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

  private loadInitialData() {
    this.vegetableService
      .getVegetables()
      .pipe(
        takeUntilDestroyed(),
        finalize(() => this.loading.set(false))
      )
      .subscribe({
        next: (data) => this.availableVegetables.set(data),
      });
  }

  protected reloadData() {
    this.reloadSub?.unsubscribe();
    console.log(
      'Load new data after successful server mutation in editor. Drop old requests and debounce?'
    );
    this.reloadSub = this.vegetableService
      .getVegetables()
      .subscribe({
        next: (data) => this.availableVegetables.set(data),
      });
  }
}
