import { Routes } from '@angular/router';
import { inject } from '@angular/core';

import { OverviewComponent } from '@app/views/overview';
import { VegetableEditViewComponent } from '@app/views/vegetable-edit-view';
import { VegetableListViewComponent } from 'src/app/views/vegetable-list-view';
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
