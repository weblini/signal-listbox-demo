import { Component, inject } from '@angular/core';
import { VegetableFormComponent } from '../vegetable-form/vegetable-form.component';
import { Status, VegetableStore } from '../vegetables.store';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-vegetable-editor',
  standalone: true,
  imports: [VegetableFormComponent, RouterLink],
  templateUrl: './vegetable-editor.component.html',
  styleUrl: './vegetable-editor.component.css',
})
export class VegetableEditorComponent {
  protected readonly vegetableStore = inject(VegetableStore);

  Status = Status;
}
