describe('vegetable editor', () => {
  beforeEach(() => {
    cy.fixture('user')
      .then((user) => JSON.stringify(user))
      .then((userJson) => window.localStorage.setItem('user-token', userJson));

    cy.visit('http://localhost:4200/');
  });

  it('should allow navigating to /edit', () => {
    cy.get('[routerlink="edit"]').click();

    cy.location('href').should('contain', '/edit');
  });
});
