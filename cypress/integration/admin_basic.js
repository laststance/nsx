context('Admin Basic', () => {
  context('Without login', () => {
    it('should show signup/login button', () => {
      cy.visit('http://localhost:3000/')
      cy.get('[data-cy=login-btn]').should('exist')
      cy.get('[data-cy=signup-btn]').should('exist')
    })

    it('we can siginup new email and password finally showing Dashboard Page', () => {
      cy.visit('http://localhost:3000/')
      cy.get('[data-cy=signup-btn]').click()
      // pageTransition /signup
      cy.url().should('eq', 'http://localhost:3000/signup')
      cy.get('[data-cy=signupPage]').contains('Signup')

      // input signup form
      cy.get('[data-cy=name-input]').type('newTransitionBloger{enter}')
      cy.get('[data-cy=password-input]').type('superstroingpassword')
      // sbumit
      cy.get('[data-cy=submit-btn]').click()

      // pageTransition /dashboard
      cy.url().should('eq', 'http://localhost:3000/dashboard')
      cy.get('[data-cy=dashbordPage]').contains('Dashbord')
      cy.logout()
    })
  })
  context('With login', () => {
    it('should show dashbord/login button', () => {
      cy.visit('http://localhost:3000')
      cy.get('[data-cy=login-btn]').click()
      cy.get('[data-cy=name-input]').type('John Doe')
      cy.get('[data-cy=password-input]').type('popcoon')
      cy.get('[data-cy=submit-btn]').click()
      cy.visit('http://localhost:3000')
      cy.get('[data-cy=dashboard-btn]').should('exist')
      cy.get('[data-cy=logout-btn]').should('exist')
    })
  })
})
