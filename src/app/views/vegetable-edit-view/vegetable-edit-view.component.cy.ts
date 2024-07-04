import { TestBed } from '@angular/core/testing';
import { VegetableEditViewComponent } from './vegetable-edit-view.component';

describe(VegetableEditViewComponent.name, () => {
  beforeEach(() => {
    TestBed.overrideComponent(VegetableEditViewComponent, {
      add: {
        imports: [],
        providers: [],
      },
    });
  });

  it('renders', () => {
    cy.mount(VegetableEditViewComponent);
  });
});
