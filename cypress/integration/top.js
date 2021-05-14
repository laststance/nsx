context('topPage', () => {
  it('show blog title', () => {
    cy.visit('http://localhost:3000/')
    cy.get('[data-cy=header]').should('contain', 'Digital Strength')
  })
})
