context('topPage', () => {
  it('show blog title', () => {
    cy.visit('http://localhost:3000/')
    cy.get('[data-cy=header]').should('contain', 'Digital Strength')
  })

  it('show latest article list', () => {
    cy.visit('http://localhost:3000/')
    cy.get('[data-cy=topPage]').should('contain', 'pot of greed')
  })

  it('move article page when clicked', () => {
    cy.visit('http://localhost:3000/')
    cy.get('[data-cy=postTitle-0]').click()
    cy.get('[data-cy=postPage]')
      .should('exist')
      .should('contain', 'next time down')
  })
})
