describe('vegetable editor', () => {
  beforeEach(() => {
    cy.fixture('user')
      .then((user) => JSON.stringify(user))
      .then((userJson) => window.localStorage.setItem('user-token', userJson));

    cy.visit('/');
  });

  it('should allow navigating to /edit', () => {
    cy.get('[routerlink="edit"]').click();

    cy.location('href').should('contain', '/edit');
  });
});
