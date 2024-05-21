import { Component, inject, output, signal } from '@angular/core';
import { Vegetable } from '../vegetables.service';
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

  protected readonly activeVegetable = signal<Vegetable | undefined>(undefined);

  onActivate(modal: HTMLDialogElement, v?: Vegetable) {
    this.activeVegetable.set(v);
    modal.showModal();
  }
}
