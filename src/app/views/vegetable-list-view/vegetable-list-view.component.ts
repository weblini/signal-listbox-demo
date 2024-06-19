import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { VegetableStore } from '@state';
import { Status } from '../../../../libs/shared/models/src/lib/models';
import { AuthStore } from '@state';

@Component({
  selector: 'app-vegetable-list-view',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './vegetable-list-view.component.html',
  styleUrl: './vegetable-list-view.component.css',
})
export class VegetableListViewComponent {
  protected readonly vegetableStore = inject(VegetableStore);
  protected readonly authStore = inject(AuthStore);

  Status = Status;
}
