import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Listbox, Option, Orientation } from './listbox';
import { Vegetable, VegetablesService } from './vegetables.service';
import { CardComponent } from './card/card.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Listbox, Option, CardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'try-signals';

  private vegetableService = inject(VegetablesService);
  protected readonly availableVegetables = this.vegetableService.getVegetables();
  selectedToppings: Vegetable[] = [];

  protected orientation = signal<Orientation>('horizontal');

  logValueChange(newValue: Vegetable[]) {
    console.log(newValue);
  }

  logOrientationChange(newOrientation: Orientation) {
    console.log(newOrientation);
  }

  toggleOrientation() {
    this.orientation.update(oldValue =>
      oldValue === 'horizontal' ?
        'vertical' :
        'horizontal');
  }
}
