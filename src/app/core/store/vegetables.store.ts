import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { VegetablesService } from '@data/services';
import { Vegetable } from '@data/models';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { concatMap, filter, mergeMap, pipe, switchMap, tap } from 'rxjs';
import { computed, inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';

import { Status } from '@core/models';

type VegetablesState = {
  vegetables: Vegetable[];
  status: Status;
  deletingIds: Set<number>;
  saveStatus: Status;
  message: string;
};

const initialState: VegetablesState = {
  vegetables: [],
  status: Status.Loading,
  deletingIds: new Set<number>(),
  saveStatus: Status.Idle,
  message: '',
};

export const VegetableStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ status, saveStatus }) => ({
    isLoading: computed(
      () => status() === Status.Loading || saveStatus() === Status.Loading,
    ),
  })),
  withMethods((store, vegetableService = inject(VegetablesService)) => ({
    loadAll: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { status: Status.Loading })),
        switchMap(() =>
          vegetableService.getVegetables().pipe(
            tapResponse({
              next: (vegetables) => {
                patchState(store, { vegetables, status: Status.Idle });
              },
              error: (err) => {
                patchState(store, { status: Status.Error });
                console.log(err);
              },
            }),
          ),
        ),
      ),
    ),
    delete: rxMethod<number>(
      pipe(
        filter((id) => !store.deletingIds().has(id)),
        tap((id) =>
          patchState(store, (state) => {
            state.deletingIds.add(id);
            return {
              deletingIds: new Set(state.deletingIds),
            };
          }),
        ),
        mergeMap((id) =>
          vegetableService.deleteVegetable(id).pipe(
            tapResponse({
              next: () => {
                patchState(store, (state) => ({
                  vegetables: [...state.vegetables.filter((v) => v.id !== id)],
                  saveStatus: Status.Success,
                  message: 'Vegetable removed',
                }));
                setTimeout(() =>
                  patchState(store, { saveStatus: Status.Idle }),
                );
              },
              error: (err) => {
                patchState(store, {
                  status: Status.Error,
                  message: 'Something went wrong while removing a vegetable',
                });
                console.log(err);
              },
              finalize: () => {
                patchState(store, (state) => {
                  state.deletingIds.delete(id);
                  return { deletingIds: new Set(state.deletingIds) };
                });
              },
            }),
          ),
        ),
      ),
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
                      'Unexpected response from API after saveVegetable',
                    );
                  }
                  const index = state.vegetables.findIndex(
                    (item) => item.id === v.id,
                  );
                  if (index >= 0) {
                    vegetables.splice(index, 1, newVegetable);
                  } else {
                    vegetables.push(newVegetable);
                  }

                  return {
                    vegetables: [...vegetables],
                    saveStatus: Status.Success,
                    message: 'Vegetable saved',
                  };
                });
              },
              error: (err) => {
                patchState(store, {
                  saveStatus: Status.Error,
                  message: 'Failed to save vegetable',
                });
                console.log(err);
              },
              finalize: () => {
                setTimeout(
                  () => patchState(store, { saveStatus: Status.Idle }),
                  3000,
                );
              },
            }),
          ),
        ),
      ),
    ),
    resetSave(): void {
      patchState(store, { saveStatus: Status.Idle });
    },
  })),
);
