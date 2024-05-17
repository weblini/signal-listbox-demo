import {
  Component,
  effect,
  inject,
  signal,
  WritableSignal,
} from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Listbox, Option, Orientation } from './listbox';
import { Vegetable, VegetablesService } from './vegetables.service';
import { CardComponent } from './card/card.component';
import { JsonPipe } from '@angular/common';
import { trigger, style, animate, transition } from '@angular/animations';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { VegetableFormComponent } from './vegetable-form/vegetable-form.component';
import { AddVegetableBtnComponent } from './add-vegetable-btn/add-vegetable-btn.component';

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
export class AppComponent {
  private readonly URL_IDS_PARAM = 'ids';
  private readonly router: Router = inject(Router);
  private readonly vegetableService: VegetablesService =
    inject(VegetablesService);

  protected readonly availableVegetables: WritableSignal<Vegetable[]> = signal(
    []
  );
  protected readonly selectedToppings: WritableSignal<Vegetable[]> = signal([]);

  protected readonly currentlyEditedId = signal(0);

  protected orientation = signal<Orientation>(Orientation.Horizontal);

  protected readonly loading = signal(true);
  protected readonly deleting = new Set<number>();

  constructor() {
    this.selectToppingsFromUrlAfterDataLoaded();
    this.loadInitialData();
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

  private removeFromSelected(v: Vegetable): void {
    this.selectedToppings.update((data) => {
      const index = data.indexOf(v);
      if (index > -1) {
        data.splice(index, 1);
      }
      return [...data];
    });
  }
  private removeFromAvailableByIndex(index: number): void {
    if (index > -1) {
      this.availableVegetables.update((data) => {
        data?.splice(index, 1);
        return [...data];
      });
    }
  }
  private addToPreviousIndex(index: number, v: Vegetable): void {
    if (index > -1) {
      this.availableVegetables.update((data) => {
        data?.splice(index, 0, v);
        return [...data];
      });
    }
  }

  private updateOrAddVegetable(index: number, v: Vegetable): void {
    if (index > -1) {
      this.availableVegetables.update((data) => {
        data?.splice(index, 1, v);
        return [...data];
      });
    } else {
      this.availableVegetables.update((items) => [...items, v]);
    }
  }

  onDelete(v: Vegetable) {
    if (v.id) {
      const id = v.id;
      let oldIndex: number = this.availableVegetables()?.indexOf(v) || -1;
      this.deleting.add(id);
      this.removeFromAvailableByIndex(oldIndex);
      this.removeFromSelected(v);
      this.vegetableService
        .deleteVegetable(id)
        .pipe(finalize(() => this.deleting.delete(id)))
        .subscribe({
          error: (err) => {
            console.error(`Error while deleting vegetable "${v.name}" : `, err);
            this.addToPreviousIndex(oldIndex, v);
          },
        });
    }
  }

  onToggleEdit(id: number) {
    this.currentlyEditedId.update((currentId) => (currentId === id ? 0 : id));
  }

  onSave(v: Vegetable, id?: number) {
    this.currentlyEditedId.set(0);
    const vegetable = { ...v, id };
    const oldIndex =
      this.availableVegetables()?.findIndex((item) => vegetable.id && item.id === vegetable.id) || -1;
    this.updateOrAddVegetable(oldIndex, vegetable);
    this.vegetableService.saveVegetable(vegetable).subscribe({
      next: (res) => {
        if (!id && res.body?.id) {
          this.availableVegetables.update((data) => {
            const index = data.findIndex(
              (item) => item.name === vegetable.name
            );
            const newData = [...data];
            newData[index].id = res.body?.id;
            return newData;
          });
        }
      },
      error: (err) => {
        console.log(`Failed to save vegetable ${vegetable}: `, err);
        // TODO: Revert optimistic update
      },
    });
  }
}
