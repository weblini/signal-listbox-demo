import {
  Component,
  effect,
  inject,
  input,
  InputSignal,
  OnInit,
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
export class VegetableFormComponent implements OnInit {
  protected readonly vegetableStore = inject(VegetableStore);
  private readonly router: Router = inject(Router);

  readonly vegetable: InputSignal<Vegetable | undefined> = input<Vegetable>();

  protected readonly MAX_NAME_LENGTH = 14;
  protected readonly MAX_DESCRIPTION_LENGTH = 88;

  Status = Status;

  form = this.createNewForm();
  name = this.form.get('name') as FormControl<string | null>;
  description = this.form.get('description') as FormControl<string | null>;

  constructor() {
    this.vegetableStore.resetSave();

    const vName = this.vegetable()?.name;
    console.log('vegetable name', vName);

    this.#disableFormWhenProcessing();
    this.#markUntouchedWhenDone();
    this.#returnToEditorOnSuccess();
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    const v = this.vegetable();
    if (v) {
      this.form.setValue({
        name: v.name,
        description: v.description,
        id: v.id,
      });
    }
  }

  #markUntouchedWhenDone() {
    effect(() => {
      const status = this.vegetableStore.saveStatus();
      if (status === Status.Idle) {
        this.form.markAsUntouched();
      }
    });
  }

  #disableFormWhenProcessing() {
    effect(() => {
      if (this.vegetableStore.saveStatus() !== Status.Idle) {
        this.form.disable();
      } else {
        this.form.enable();
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
        Validators.maxLength(this.MAX_NAME_LENGTH),
      ]),
      description: new FormControl(v?.description || null, [
        Validators.required,
        Validators.maxLength(this.MAX_DESCRIPTION_LENGTH),
      ]),
    });
  }

  onSave() {
    const editedVegetable = this.form.value as Vegetable;
    this.vegetableStore.save(editedVegetable);
  }
}
