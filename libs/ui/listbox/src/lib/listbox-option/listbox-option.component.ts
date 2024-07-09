import {animate, style, transition, trigger} from '@angular/animations';
import {Component, ElementRef, computed, inject, input} from '@angular/core';

import {Listbox} from '../listbox/listbox.component';

@Component({
  selector: 'jm-option',
  standalone: true,
  animations: [
    trigger('jumpIn', [
      transition(':enter', [
        style({opacity: 0, transform: 'translateX(100%)'}),
        animate(
          '100ms cubic-bezier(0.0, 0.0, 0.2, 1)',
          style({opacity: 1, transform: 'translateX(0)'}),
        ),
      ]),
      transition(':leave', [
        animate(
          '100ms cubic-bezier(0.4, 0.0, 1, 1)',
          style({opacity: 0, transform: 'translateX(100%)'}),
        ),
      ]),
    ]),
  ],
  host: {
    role: 'option',
    '[attr.aria-disabled]': 'isDisabled()',
    '[attr.aria-selected]': 'isSelected()',
    '[tabIndex]': 'isActive() ? 0 : -1',
    '(click)': 'select()',
    '(keydown.space)':
      'select();$event.preventDefault();$event.stopPropagation();',
  },
  templateUrl: './listbox-option.component.html',
  styleUrl: './listbox-option.component.css',
})
export class Option<T> {
  private listbox = inject<Listbox<T>>(Listbox);
  private domElement = inject(ElementRef);

  focus() {
    this.domElement.nativeElement.focus();
  }

  readonly value = input.required<T>();
  readonly disabled = input(false);

  protected readonly isDisabled = computed(
    () => this.listbox.disabled() || this.disabled(),
  );
  readonly isSelected = computed(() =>
    this.listbox.value().includes(this.value()),
  );
  readonly isActive = computed(() => this === this.listbox.activeOption());

  protected select() {
    if (!this.isDisabled()) {
      const value = this.value();

      this.listbox.value.update((lastOptions: T[]) => {
        const newList = [...lastOptions];
        const optionsIndex = lastOptions.indexOf(value);

        if (optionsIndex > -1) {
          newList.splice(optionsIndex, 1);
        } else {
          newList.push(value);
        }

        return newList;
      });
    }
  }
}
