import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { VegetableFormComponent } from '@ui/modules/vegetable-form';
import { Status } from '@shared/models';
import { VegetableStore } from '@state';

@Component({
  selector: 'app-vegetable-vegetable-edit-view-view',
  standalone: true,
  imports: [RouterLink, VegetableFormComponent],
  templateUrl: './vegetable-edit-view.component.html',
  styleUrl: './vegetable-edit-view.component.css',
})
export class VegetableEditViewComponent {
  protected readonly vegetableStore = inject(VegetableStore);
  private readonly route = inject(ActivatedRoute);

  Status = Status;

  protected readonly activeVegetable = computed(() => {
    const id = this.route.snapshot.paramMap.get('id');
    return this.vegetableStore.vegetables().find((v) => v.id === Number(id));
  });
}
