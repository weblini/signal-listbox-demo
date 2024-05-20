import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { Vegetable, VegetablesService } from './vegetables.service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';

type VegetablesState = {
  vegetables: Vegetable[];
  status: 'idle' | 'loading' | 'error';
};

const initialState: VegetablesState = {
  vegetables: [],
  status: 'idle',
};

export const VegetableStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, vegetableService = inject(VegetablesService)) => ({
    loadAll: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { status: 'loading' })),
        switchMap(() => {
          return vegetableService.getVegetables().pipe(
            tapResponse({
              next: (vegetables) => {
                patchState(store, { vegetables, status: 'idle' });
              },
              error: (err) => {
                patchState(store, { status: 'error' });
                console.log(err);
              },
            })
          );
        })
      )
    ),
  }))
);
