import { Routes } from '@angular/router';
import { OverviewComponent } from './overview/overview.component';
import { EditComponent } from './edit/edit.component';

export const routes: Routes = [
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
    path: '',
    title: 'Vegetable Overview',
    component: OverviewComponent,
  },
  {
    path: '**',
    redirectTo: '/'
  },
];
