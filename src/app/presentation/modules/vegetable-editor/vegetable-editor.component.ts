import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { VegetableFormComponent } from '@ui/modules/vegetable-form';
import { VegetableStore } from '@core/store/vegetables.store';
import { Status } from '@core/models';
import { AuthStore } from '@core/store/auth.store';

@Component({
  selector: 'app-vegetable-editor',
  standalone: true,
  imports: [VegetableFormComponent, RouterLink],
  templateUrl: './vegetable-editor.component.html',
  styleUrl: './vegetable-editor.component.css',
})
export class VegetableEditorComponent {
  protected readonly vegetableStore = inject(VegetableStore);
  protected readonly authStore = inject(AuthStore);

  Status = Status;
}
