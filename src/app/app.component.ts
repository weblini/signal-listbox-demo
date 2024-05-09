import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Listbox, Option, Orientation } from './listbox';
import { VegetablesService } from './vegetables.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Listbox, Option],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'try-signals';

  private vegetableService = inject(VegetablesService);
  protected readonly availableVegetables = this.vegetableService.getVegetables();
  selectedToppings: string[] = [];

  protected orientation = signal<Orientation>('horizontal');

  logValueChange(newValue: string[]) {
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
