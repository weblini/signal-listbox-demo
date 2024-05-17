import {Component, computed, input, InputSignal, output} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {Vegetable} from '../vegetables.service';
import {JsonPipe} from '@angular/common';

@Component({
  selector: 'app-vegetable-form',
  standalone: true,
  imports: [ReactiveFormsModule, JsonPipe],
  templateUrl: './vegetable-form.component.html',
  styleUrl: './vegetable-form.component.css',
})
export class VegetableFormComponent {
  readonly vegetable: InputSignal<Vegetable | undefined> = input<Vegetable>();
  readonly save = output<Vegetable>();

  protected readonly maxNameLength = 14;
  protected readonly maxDescriptionLength = 88;

  protected readonly vegetableForm = computed(() => {
    const v = this.vegetable();
    return this.createNewForm(v);
  })

  protected readonly vegetableName = computed(() => this.vegetableForm().get('name') as FormControl<string | null>);
  protected readonly vegetableDescription = computed(() => this.vegetableForm().get('description') as FormControl<string | null>);

  protected createNewForm(v?: Vegetable): FormGroup<{
    id: FormControl<number | null>,
    name: FormControl<string | null>,
    description: FormControl<string | null>,
  }> {
    return new FormGroup({
      id: new FormControl(v?.id || null),
      name: new FormControl(v?.name || null, [Validators.required, Validators.maxLength(this.maxNameLength)]),
      description: new FormControl(v?.description || null, [
        Validators.required,
        Validators.maxLength(this.maxDescriptionLength),
      ]),
    });
  }

  handleForm() {
    this.save.emit(this.vegetableForm().value as Vegetable);
  }
}
