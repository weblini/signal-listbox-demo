import { Component, input, output } from '@angular/core';
import { VegetableFormComponent } from '../vegetable-form/vegetable-form.component';

@Component({
  selector: 'app-add-vegetable-btn',
  standalone: true,
  imports: [VegetableFormComponent],
  templateUrl: './add-vegetable-btn.component.html',
  styleUrl: './add-vegetable-btn.component.css',
})
export class AddVegetableBtnComponent {
  activate = output<boolean>();
  isActive = input<boolean>();
}
