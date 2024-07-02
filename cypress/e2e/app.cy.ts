// import { getGreeting } from '../support/app.po';

describe('main view', () => {
  beforeEach(() => cy.visit('http://localhost:4200/'));

  it('displays a details card of the selected item', () => {
    // Custom command example, see `../support/commands.ts` file
    // cy.login('my-email@something.com', 'myPassword');
    // Function helper example, see `../support/app.po.ts` file
    // getGreeting().contains(/Welcome/);

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
});
