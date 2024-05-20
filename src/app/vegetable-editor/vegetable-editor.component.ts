import { Component, inject, input, output, signal } from '@angular/core';
import { Vegetable, VegetablesService } from '../vegetables.service';
import { finalize } from 'rxjs';
import { VegetableFormComponent } from '../vegetable-form/vegetable-form.component';

@Component({
  selector: 'app-vegetable-editor',
  standalone: true,
  imports: [VegetableFormComponent],
  templateUrl: './vegetable-editor.component.html',
  styleUrl: './vegetable-editor.component.css',
})
export class VegetableEditorComponent {
  private readonly vegetableService = inject(VegetablesService);
  readonly vegetables = input<Vegetable[]>();

  dataChange = output();

  protected readonly activeVegetable = signal<Vegetable | undefined>(undefined);
  protected readonly deletingIds = new Set<number>();

  onActivate(modal: HTMLDialogElement, v?: Vegetable) {
    this.activeVegetable.set(v);
    modal.showModal();
  }

  onDelete(v: Vegetable) {
    const id = v.id;
    this.deletingIds.add(id);
    this.vegetableService
      .deleteVegetable(id)
      .pipe(
        finalize(() => {
          console.log(
            'What do I do when onDelete errors/responds/unsubscribes ?'
          );
          this.deletingIds.delete(id);
        })
      )
      .subscribe({
        next: (res) => {
          this.dataChange.emit();
        },
        error: (err) => {
          console.error(`Error while deleting vegetable "${v.name}" : `, err);
        },
      });
  }

  onSave(v: Vegetable, modal: HTMLDialogElement) {
    this.vegetableService
      .saveVegetable(v)
      .pipe(
        finalize(() => {
          console.log(
            'What do I do when onSave errors/responds/unsubscribes ?'
          );
          modal.close();
        })
      )
      .subscribe({
        next: (res) => {
          this.dataChange.emit();
        },
        error: (err) => {
          console.log(`Failed to save vegetable ${v.name}: `, err);
        },
      });
  }
}
