import { Routes } from '@angular/router';
import { inject } from '@angular/core';

import { OverviewComponent } from '@ui/modules/overview';
import { VegetableEditViewComponent } from '@ui/modules/vegetable-edit-view';
import { VegetableListViewComponent } from 'src/app/presentation/modules/vegetable-list-view';
import { permissionGuard, AuthStore } from '@state';

export const routes: Routes = [
  {
    path: '',
    title: 'Vegetable Overview',
    component: OverviewComponent,
  },
  {
    path: '',
    canMatch: [permissionGuard],
    children: [
      {
        path: 'create',
        title: 'Create Vegetable',
        component: VegetableEditViewComponent,
        canActivate: [() => inject(AuthStore).canCreate()]
      },
      {
        path: 'vegetable-edit-view/:id',
        title: 'Edit Vegetable',
        component: VegetableEditViewComponent,
        canActivate: [() => inject(AuthStore).canEdit()]
      },
      {
        path: 'vegetable-edit-view',
        title: 'Edit Vegetables',
        component: VegetableListViewComponent,
      },
    ],
  },
  {
    path: '**',
    redirectTo: '/',
  },
];
