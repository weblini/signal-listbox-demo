import { Routes } from '@angular/router';
import { inject } from '@angular/core';

import { OverviewComponent } from '@ui/modules/overview';
import { EditComponent } from '@ui/modules/edit/edit.component';
import { VegetableEditorComponent } from '@ui/modules/vegetable-editor';
import { permissionGuard } from '@core/utils/permission.guard';
import { AuthService } from './auth.service';

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
        canActivate: [() => inject(AuthService).canCreate()]
      },
      {
        path: 'edit/:id',
        title: 'Edit Vegetable',
        component: EditComponent,
        canActivate: [() => inject(AuthService).canEdit()]
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
