import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { VegetableStore } from './vegetables.store';
import { ToasterComponent } from './toaster/toaster.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToasterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  protected readonly vegetableStore = inject(VegetableStore);

  constructor() {
    this.vegetableStore.loadAll();
  }
}
