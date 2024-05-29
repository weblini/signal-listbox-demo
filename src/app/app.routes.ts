import { Routes } from '@angular/router';
import { OverviewComponent } from './overview/overview.component';
import { EditComponent } from './edit/edit.component';
import { VegetableEditorComponent } from './vegetable-editor/vegetable-editor.component';
import { permissionGuard } from './permission.guard';
import { inject } from '@angular/core';
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
