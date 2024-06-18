import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { VegetableStore } from '@state';
import { Status } from '@shared/models';
import { AuthStore } from '@state';

@Component({
  selector: 'app-vegetable-editor',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './vegetable-editor.component.html',
  styleUrl: './vegetable-editor.component.css',
})
export class VegetableEditorComponent {
  protected readonly vegetableStore = inject(VegetableStore);
  protected readonly authStore = inject(AuthStore);

  Status = Status;
}
