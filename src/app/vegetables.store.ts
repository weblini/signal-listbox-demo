import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { Vegetable, VegetablesService } from './vegetables.service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { debounceTime, pipe, switchMap, tap } from 'rxjs';
import { computed, inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';

export enum Status {
    Idle,
    Loading,
    Error
}

type VegetablesState = {
  vegetables: Vegetable[];
  status: Status;
};

const initialState: VegetablesState = {
  vegetables: [],
  status: Status.Idle,
};

export const VegetableStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({status}) => ({
    isLoading: computed(() => status() === Status.Loading)
  })),
  withMethods((store, vegetableService = inject(VegetablesService)) => ({
    loadAll: rxMethod<void>(
      pipe(
        debounceTime(200),
        tap(() => patchState(store, { status: Status.Loading })),
        switchMap(() => {
          return vegetableService.getVegetables().pipe(
            tapResponse({
              next: (vegetables) => {
                patchState(store, { vegetables, status: Status.Idle });
              },
              error: (err) => {
                patchState(store, { status: Status.Error });
                console.log(err);
              },
            })
          );
        })
      )
    ),
  }))
);
