context('topPage', () => {
  it('show blog title', () => {
    cy.visit('http://localhost:3000/')
    cy.get('[data-cy=header]').should('contain', 'Digital Strength')
  })

  it('show latest article list', () => {
    cy.visit('http://localhost:3000/')
    cy.get('[data-cy=topPage]').should('contain', 'pot of greed')
  })
})
