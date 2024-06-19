import { Component, input } from '@angular/core';

@Component({
  selector: 'lib-card',
  standalone: true,
  imports: [],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
})
export class CardComponent {
  readonly title = input.required<string>();
  readonly description = input.required<string>();
}
