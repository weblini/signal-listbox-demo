import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { VegetableFormComponent } from '../vegetable-form/vegetable-form.component';
import { Status } from '@core/models';
import { VegetableStore } from '@core/store/vegetables.store';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [RouterLink, VegetableFormComponent],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css',
})
export class EditComponent {
  protected readonly vegetableStore = inject(VegetableStore);
  private readonly route = inject(ActivatedRoute);

  Status = Status;

  protected readonly activeVegetable = computed(() => {
    const id = this.route.snapshot.paramMap.get('id');
    return this.vegetableStore.vegetables().find((v) => v.id === Number(id));
  });
}
