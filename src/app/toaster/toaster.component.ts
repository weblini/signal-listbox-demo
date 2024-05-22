import { Component, inject } from '@angular/core';
import { Status, VegetableStore } from '../vegetables.store';

@Component({
  selector: 'app-toaster',
  standalone: true,
  imports: [],
  templateUrl: './toaster.component.html',
  styleUrl: './toaster.component.css',
})
export class ToasterComponent {
  protected readonly vegetableStore = inject(VegetableStore);

  Status = Status;
}
