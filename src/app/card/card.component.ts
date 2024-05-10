import { Component, input } from '@angular/core';

// TODO: animate cards enter/leave view

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
})
export class CardComponent {
  readonly title = input.required<string>();
  readonly description = input.required<string>();
}
