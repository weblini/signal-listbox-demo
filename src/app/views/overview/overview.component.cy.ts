import { TestBed } from '@angular/core/testing';
import { OverviewComponent } from './overview.component';

describe(OverviewComponent.name, () => {
  beforeEach(() => {
    TestBed.overrideComponent(OverviewComponent, {
      add: {
        imports: [],
        providers: [],
      },
    });
  });

  it('renders', () => {
    cy.mount(OverviewComponent);
  });
});
