import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { Vegetable, VegetablesService } from './vegetables.service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import {
  concatMap,
  debounceTime,
  filter,
  mergeMap,
  pipe,
  retry,
  switchMap,
  tap,
} from 'rxjs';
import { computed, inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';

export enum Status {
  Idle,
  Loading,
  Error,
  Success,
}

type VegetablesState = {
  vegetables: Vegetable[];
  status: Status;
  deletingIds: Set<number>;
  saveStatus: Status;
};

const initialState: VegetablesState = {
  vegetables: [],
  status: Status.Loading,
  deletingIds: new Set<number>(),
  saveStatus: Status.Idle,
};

export const VegetableStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ status, saveStatus }) => ({
    isLoading: computed(
      () => status() === Status.Loading || saveStatus() === Status.Loading
    ),
    isSubmitted: computed(
      () => saveStatus() === Status.Loading || saveStatus() === Status.Success
    ),
  })),
  withMethods((store, vegetableService = inject(VegetablesService)) => ({
    loadAll: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { status: Status.Loading })),
        switchMap(() =>
          vegetableService.getVegetables().pipe(
            retry(1),
            tapResponse({
              next: (vegetables) => {
                patchState(store, { vegetables, status: Status.Idle });
              },
              error: (err) => {
                patchState(store, { status: Status.Error });
                console.log(err);
              },
            })
          )
        )
      )
    ),
    delete: rxMethod<number>(
      pipe(
        filter((id) => !store.deletingIds().has(id)),
        tap((id) =>
          patchState(store, (state) => {
            state.deletingIds.add(id);
            console.log(state.deletingIds);
            return {
              status: Status.Loading,
              deletingIds: new Set(state.deletingIds),
            };
          })
        ),
        mergeMap((id) =>
          vegetableService.deleteVegetable(id).pipe(
            tapResponse({
              next: () => {
                patchState(store, (state) => ({
                  vegetables: [...state.vegetables.filter((v) => v.id !== id)],
                  status: Status.Idle,
                }));
              },
              error: (err) => {
                patchState(store, { status: Status.Error });
                console.log(err);
              },
              finalize: () => {
                patchState(store, (state) => {
                  state.deletingIds.delete(id);
                  return { deletingIds: new Set(state.deletingIds) };
                });
              },
            })
          )
        )
      )
    ),
    save: rxMethod<Vegetable>(
      pipe(
        tap(() => patchState(store, { saveStatus: Status.Loading })),
        concatMap((v) =>
          vegetableService.saveVegetable(v).pipe(
            tapResponse({
              next: (newVegetable) => {
                patchState(store, (state) => {
                  let vegetables = state.vegetables;
                  if (!newVegetable) {
                    throw Error(
                      'Unexpected response from API after saveVegetable'
                    );
                  }
                  const index = state.vegetables.findIndex(
                    (item) => item.id === v.id
                  );
                  if (index >= 0) {
                    vegetables.splice(index, 1, newVegetable);
                  } else {
                    vegetables.push(newVegetable);
                  }
                  return {
                    vegetables: [...vegetables],
                    saveStatus: Status.Success,
                  };
                });
              },
              error: (err) => {
                patchState(store, { saveStatus: Status.Error });
                console.log(err);
              },
            })
          )
        )
      )
    ),
    resetSave(): void {
      patchState(store, { saveStatus: Status.Idle });
    },
  }))
);
