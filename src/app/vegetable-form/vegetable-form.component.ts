import {
  Component,
  computed,
  inject,
  input,
  InputSignal,
  output,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Vegetable, VegetablesService } from '../vegetables.service';
import { retry } from 'rxjs';

@Component({
  selector: 'app-vegetable-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './vegetable-form.component.html',
  styleUrl: './vegetable-form.component.css',
})
export class VegetableFormComponent {
  private readonly vegetableService = inject(VegetablesService);
  readonly vegetable: InputSignal<Vegetable | undefined> = input<Vegetable>();
  readonly success = output();

  protected readonly maxNameLength = 14;
  protected readonly maxDescriptionLength = 88;

  protected readonly formStatus = signal<'idle' | 'saving' | 'error'>('idle');

  protected readonly vegetableForm = computed(() => {
    const v = this.vegetable();
    return this.createNewForm(v);
  });

  protected readonly vegetableName = computed(
    () => this.vegetableForm().get('name') as FormControl<string | null>
  );
  protected readonly vegetableDescription = computed(
    () => this.vegetableForm().get('description') as FormControl<string | null>
  );

  protected createNewForm(v?: Vegetable): FormGroup<{
    id: FormControl<number | null>;
    name: FormControl<string | null>;
    description: FormControl<string | null>;
  }> {
    return new FormGroup({
      id: new FormControl(v?.id || null),
      name: new FormControl(v?.name || null, [
        Validators.required,
        Validators.maxLength(this.maxNameLength),
      ]),
      description: new FormControl(v?.description || null, [
        Validators.required,
        Validators.maxLength(this.maxDescriptionLength),
      ]),
    });
  }

  resetForm() {
    this.vegetableForm().reset();
    this.formStatus.set('idle');
  }

  onSave() {
    const v = this.vegetableForm().value as Vegetable;
    this.formStatus.set('saving');
    this.vegetableService
      .saveVegetable(v)
      .pipe(
        retry(1)
      )
      .subscribe({
        next: (res) => {
          this.success.emit();
          this.resetForm();
        },
        error: (err) => {
          console.log(`Failed to save vegetable ${v.name}: `, err);
          this.formStatus.set('error');
        },
      });
  }
}
