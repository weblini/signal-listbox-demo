describe('veggie listbox', () => {
  beforeEach(() => cy.visit('/'));

  it('displays a details card of the selected item', () => {
    cy.get('[data-test=option-name]:first')
      .should('exist')
      .click()
      .invoke('text')
      .then((veggieName) => {
        cy.get('[data-test=card-title]')
          .should('exist')
          .contains('.title', veggieName);
      });
  });

  it('indicates when an option is selected', () => {
    cy.get('jm-option:first').click().contains('✓');
  });
});
