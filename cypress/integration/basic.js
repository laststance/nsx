context('Visiter Basic', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/')
  })

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

  it('never shown every admin page link button without login', () => {
    const check = () => cy.get('[data-cy=signup-btn]').should('not.exist')
    cy.get('[data-cy=dashboard-btn]').should('not.exist')
    cy.get('[data-cy=edit-btn]').should('not.exist')

    cy.visit('http://localhost:3000/')
    check()
    cy.get('[data-cy=postTitle-1]').click()
    check()
  })
})
