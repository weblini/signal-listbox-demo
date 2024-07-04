import { TestBed } from '@angular/core/testing';
import { VegetableListViewComponent } from './vegetable-list-view.component';

describe(VegetableListViewComponent.name, () => {
  beforeEach(() => {
    TestBed.overrideComponent(VegetableListViewComponent, {
      add: {
        imports: [],
        providers: [],
      },
    });
  });

  it('renders', () => {
    cy.mount(VegetableListViewComponent);
  });
});
