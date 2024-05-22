import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { VegetableStore } from './vegetables.store';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  protected readonly vegetableStore = inject(VegetableStore);

  constructor(){
    this.vegetableStore.loadAll();
  }
}
