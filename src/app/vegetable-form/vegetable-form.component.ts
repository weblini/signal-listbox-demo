import { Component, input } from '@angular/core';

@Component({
  selector: 'app-vegetable-form',
  standalone: true,
  imports: [],
  templateUrl: './vegetable-form.component.html',
  styleUrl: './vegetable-form.component.css'
})
export class VegetableFormComponent {
  name = input('');
  description = input('');
}
