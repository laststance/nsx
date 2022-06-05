context('new installed user flow', () => {
  before(() => {
    cy.cleanDB()
  })
  it('show siginup page and create user, finally showing Dashboard page', () => {
    cy.visit('http://localhost:3000/')
    cy.$('signup-page').should('exist')
    cy.$('signup-page').contains('Signup')

    // input signup form
    cy.$('signup-name-input').type('newTransitionBloger{enter}')
    cy.$('signup-password-input').type('superstroingpassword')
    // sbumit
    cy.$('signup-submit-btn').click()

    // pageTransition /dashboard
    cy.url().should('eq', 'http://localhost:3000/dashboard')
    cy.get('main h1').contains('Dashboard')
  })
})
