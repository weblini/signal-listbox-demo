import { Component, effect, input, output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Vegetable } from '../vegetables.service';

@Component({
  selector: 'app-vegetable-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './vegetable-form.component.html',
  styleUrl: './vegetable-form.component.css',
})
export class VegetableFormComponent {
  readonly name = input('');
  readonly description = input('');

  save = output<Vegetable>();

  protected vegetableForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.maxLength(14)]),
    description: new FormControl('', [
      Validators.required,
      Validators.maxLength(88),
    ]),
  });

  constructor() {
    effect(() =>
      this.vegetableForm.setValue({
        name: this.name(),
        description: this.description(),
      })
    );
  }

  handleForm() {
    this.save.emit(this.vegetableForm.value as Vegetable);
  }
}
