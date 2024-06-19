import {
  Component,
  computed,
  contentChildren,
  effect,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import {Orientation} from '../models/orientation';
import {Option} from '../listbox-option/listbox-option.component';

@Component({
  selector: 'jm-listbox',
  template: `<ng-content />`,
  standalone: true,
  host: {
    role: 'listbox',
    '[tabIndex]': 'disabled() || activeOption() ? -1 : 0',
    '(focus)': 'activateOption()',
    '[style.flex-direction]': 'orientationStyle()',
    '(keydown)': 'navigate($event)',
  },
  styles: `
    :host {
      display: flex;
      overflow-x: auto;
      gap: 0.5rem;
      padding: 1rem 2rem;
      margin: 0 -2rem;
    }
    @media (max-width: 1000px) {
      scrollbar-width: none;
    }
  `,
})
export class Listbox<T> {
  readonly value = model<T[]>([]);
  readonly disabled = input(false);
  readonly orientation = input<Orientation>(Orientation.Horizontal);

  readonly options = contentChildren(Option);
  activeOption = signal<Option<T> | undefined>(undefined);

  readonly orientationChange = output<Orientation>();

  protected readonly orientationStyle = computed(() =>
    this.orientation() === Orientation.Horizontal ? 'row' : 'column'
  );

  constructor() {
    effect(() => {
      this.orientationChange.emit(this.orientation());
    });
    effect(() => {
      this.activeOption()?.focus();
    });
  }

  navigate(event: KeyboardEvent) {
    if (event.key.startsWith('Arrow')) {
      event.stopPropagation();
      event.preventDefault();
    }
    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        this.moveFocus(-1);
        break;
      case 'ArrowRight':
      case 'ArrowDown':
        this.moveFocus(1);
        break;
    }
  }

  moveFocus(moveBy: number) {
    const activeOption = this.activeOption();

    const nextPosition =
      activeOption && moveBy
        ? this.options().indexOf(activeOption) + moveBy
        : 0;

    if (nextPosition >= 0 && nextPosition < this.options().length) {
      this.activeOption.set(this.options()[nextPosition]);
    }
  }

  activateOption() {
    const selectedOption = this.options().find((o) => o.isSelected());
    if (selectedOption) {
      this.activeOption.set(selectedOption);
    } else {
      const firstEnabledOption = this.options().find((o) => !o.disabled());
      this.activeOption.set(firstEnabledOption);
    }
  }
}
