import { Component, input, output, signal } from '@angular/core';
import { VegetableFormComponent } from '../vegetable-form/vegetable-form.component';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [VegetableFormComponent],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
})
export class CardComponent {
  readonly title = input.required<string>();
  readonly description = input.required<string>();

  readonly isEditMode = input(false);

  delete = output<void>();
  edit = output<void>();
}
