import {Component, input, output} from '@angular/core';

// TODO: handle edit actions

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

  delete = output<void>()
}
