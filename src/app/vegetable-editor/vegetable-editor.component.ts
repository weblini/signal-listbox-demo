import { Component, inject, input, output, signal } from '@angular/core';
import { Vegetable, VegetablesService } from '../vegetables.service';
import { finalize } from 'rxjs';
import { VegetableFormComponent } from '../vegetable-form/vegetable-form.component';
import { VegetableStore } from '../vegetables.store';

@Component({
  selector: 'app-vegetable-editor',
  standalone: true,
  imports: [VegetableFormComponent],
  templateUrl: './vegetable-editor.component.html',
  styleUrl: './vegetable-editor.component.css',
})
export class VegetableEditorComponent {
  protected readonly vegetableStore = inject(VegetableStore);
  private readonly vegetableService = inject(VegetablesService);
  
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

  onSuccess(modal: HTMLDialogElement) {
    this.dataChange.emit();
    modal.close();
  }
}
