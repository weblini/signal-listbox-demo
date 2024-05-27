import { Routes } from '@angular/router';
import { OverviewComponent } from './overview/overview.component';
import { EditComponent } from './edit/edit.component';
import { VegetableEditorComponent } from './vegetable-editor/vegetable-editor.component';
import { permissionGuard } from './permission.guard';

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
      },
      {
        path: 'edit/:id',
        title: 'Edit Vegetable',
        component: EditComponent,
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
