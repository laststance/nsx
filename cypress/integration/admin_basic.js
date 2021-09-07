context('Admin Basic', () => {
  context('Without login', () => {
    it('should show signup/login button', () => {
      cy.visit('http://localhost:3000/')
      cy.$('login-btn').should('exist')
      cy.$('signup-btn').should('exist')
    })

    it('we can siginup new email and password finally showing Dashboard Page', () => {
      cy.visit('http://localhost:3000/')
      cy.$('signup-btn').click()
      // pageTransition /signup
      cy.url().should('eq', 'http://localhost:3000/signup')
      cy.$('signupPage').contains('Signup')

      // input signup form
      cy.$('name-input').type('newTransitionBloger{enter}')
      cy.$('password-input').type('superstroingpassword')
      // sbumit
      cy.$('submit-btn').click()

      // pageTransition /dashboard
      cy.url().should('eq', 'http://localhost:3000/dashboard')
      cy.$('dashbordPage').contains('Dashbord')
      cy.logout()
    })
  })
  context('With login', () => {
    it('should show dashbord/login button', () => {
      cy.visit('http://localhost:3000')
      cy.$('login-btn').click()
      cy.$('name-input').type('John Doe')
      cy.$('password-input').type('popcoon')
      cy.$('submit-btn').click()
      cy.$('topPageLink').click()
      // @TODO remove when implemented pagenation
      cy.scrollTo('bottom')
      // should show dashbord/login button
      cy.$('dashboard-btn').should('exist')
      cy.$('logout-btn').should('exist')
    })
  })
})
