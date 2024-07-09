// import {TestBed} from '@angular/core/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {Listbox} from './listbox.component';
import {Option} from '../listbox-option/listbox-option.component';
import {Component} from '@angular/core';

const options = [
  {name: 'veggie 1', value: 1},
  {name: 'veggie 2', value: 2},
  {name: 'veggie 3', value: 3},
];

@Component({
  template: `<jm-listbox>
    @for (option of options; track option.value) {
      <jm-option [value]="option.value">{{ option.name }}</jm-option>
    }
  </jm-listbox>`,
})
class WrapperComponent {
  options = options;
}

describe(Listbox.name, () => {
  beforeEach(() => {
    //   TestBed.overrideComponent(Listbox, {
    //     add: {
    //       imports: [],
    //       providers: [],
    //     },
    //   });
    cy.mount(WrapperComponent, {
      declarations: [WrapperComponent],
      imports: [Listbox, Option, NoopAnimationsModule],
    });
  });

  it('should indicate which option is selected', () => {
    cy.get('jm-option:first').as('firstOption').click();
    cy.get('@firstOption').should('have.attr', 'aria-selected');
    cy.get('@firstOption').should('include.text', '✓');
  });

  it('should not change height when selected', () => {
    cy.get('jm-option:first')
      .as('firstOption')
      .invoke('height')
      .then((height) => {
        cy.get('@firstOption').click();
        cy.get('@firstOption').invoke('height').should('equal', height);
      });
  });

  it('should allow selecting multiple options', () => {
    cy.get('jm-option').click({multiple: true});
    cy.get('jm-option[aria-selected=true]').should(
      'have.length',
      options.length,
    );
  });
});
