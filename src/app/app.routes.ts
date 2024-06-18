import { Routes } from '@angular/router';
import { inject } from '@angular/core';

import { OverviewComponent } from '@ui/modules/overview';
import { EditComponent } from '@ui/modules/edit/edit.component';
import { VegetableEditorComponent } from '@ui/modules/vegetable-editor';
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
        component: EditComponent,
        canActivate: [() => inject(AuthStore).canCreate()]
      },
      {
        path: 'edit/:id',
        title: 'Edit Vegetable',
        component: EditComponent,
        canActivate: [() => inject(AuthStore).canEdit()]
      },
      {
        path: 'edit',
        title: 'Edit Vegetables',
        component: VegetableEditorComponent,
      },
    ],
  },
  {
    path: '**',
    redirectTo: '/',
  },
];
