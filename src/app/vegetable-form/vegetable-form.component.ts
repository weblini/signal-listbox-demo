import {
  Component,
  computed,
  effect,
  inject,
  input,
  InputSignal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Vegetable } from '../vegetables.service';
import { VegetableStore } from '../vegetables.store';
import { Status } from '../vegetables.store';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vegetable-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './vegetable-form.component.html',
  styleUrl: './vegetable-form.component.css',
})
export class VegetableFormComponent {
  protected readonly vegetableStore = inject(VegetableStore);
  private readonly router: Router = inject(Router);

  readonly vegetable: InputSignal<Vegetable | undefined> = input<Vegetable>();

  protected readonly maxNameLength = 14;
  protected readonly maxDescriptionLength = 88;

  Status = Status;


  // TODO: fix how the form is created (currently it is recreated on each successfull form submittion)
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

  constructor() {
    this.vegetableStore.resetSave();

    this.#disableFormWhenProcessing();
    this.#markUntouchedWhenDone();
    this.#returnToEditorOnSuccess();
  }

  #markUntouchedWhenDone() {
    effect(() => {
      const status = this.vegetableStore.saveStatus();
      if (status === Status.Idle) {
        this.vegetableForm().markAsUntouched();
      }
    });
  }

  #disableFormWhenProcessing() {
    effect(() => {
      if (this.vegetableStore.saveStatus() !== Status.Idle) {
        this.vegetableForm().disable();
      } else {
        this.vegetableForm().enable();
      }
    });
  }

  #returnToEditorOnSuccess() {
    effect(() => {
      const status = this.vegetableStore.saveStatus();
      if (status === Status.Success && !this.vegetable()) {
        this.router.navigate(['/edit']);
      }
    });
  }

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

  onSave() {
    const editedVegetable = this.vegetableForm().value as Vegetable;
    this.vegetableStore.save(editedVegetable);
  }
}
