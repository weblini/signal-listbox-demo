import {
  Component,
  ElementRef,
  computed,
  contentChildren,
  effect,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';

export type Orientation = 'vertical' | 'horizontal';

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
      border: 1px solid black;
      padding: 4px;
      overflow-x: auto;
      scrollbar-width: none;
    }
    
    :host:focus {
      outline: 2px solid darkblue;
    }
  `,
})
export class Listbox<T> {
  readonly value = model<T[]>([]);
  readonly disabled = input(false);
  readonly orientation = input<Orientation>('horizontal');

  readonly options = contentChildren(Option);
  activeOption = signal<Option<T> | undefined>(undefined);

  readonly orientationChange = output<Orientation>();

  protected readonly orientationStyle = computed(() =>
    this.orientation() === 'horizontal' ? 'row' : 'column'
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

@Component({
  selector: 'jm-option',
  template: `
    <ng-content />

    @if (isSelected()) { ✓ }
  `,
  standalone: true,
  host: {
    role: 'option',
    '[attr.aria-disabled]': 'isDisabled()',
    '[attr.aria-selected]': 'isSelected()',
    '[tabIndex]': 'isActive() ? 0 : -1',
    '(click)': 'select()',
    '(keydown.space)': 'select()',
  },
  styles: `
    :host {
      display: block;
      border: 1px solid black;
      margin: 4px;
      padding: 4px;
      cursor: pointer;
      min-width: 8rem;
      user-select: none;
    }
    
    :host[aria-disabled="true"] {
      color: lightgray;
      border-color: lightgray;
      cursor: default;
    }
    
    :host:focus {
      outline: 3px dashed orange;
    }
  `,
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
    () => this.listbox.disabled() || this.disabled()
  );
  readonly isSelected = computed(() =>
    this.listbox.value().includes(this.value())
  );
  readonly isActive = computed(() => this === this.listbox.activeOption());

  protected select() {
    if (!this.isDisabled()) {
      const value = this.value();

      this.listbox.value.update((lastOptions) => {
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
