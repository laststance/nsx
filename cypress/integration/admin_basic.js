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
      cy.login()
      // @TODO remove when implemented pagenation
      cy.scrollTo('bottom')
      // should show dashbord/login button
      cy.$('dashboard-btn').should('exist')
      cy.$('logout-btn').should('exist')
    })
    context('CRUD post operation', () => {
      it('could publish new post', () => {
        cy.login()
        cy.$('dashboard-btn').click()
        cy.url().should('eq', 'http://localhost:3000/dashboard')
        cy.$('create-btn').click()
        cy.url().should('eq', 'http://localhost:3000/dashboard/create')
        cy.log('wrting blog post...')
        cy.$('post-title-input').type('from cypress')
        cy.$('post-body-input').type('testing now')

        cy.log('click submit button')
        cy.$('submit-btn').click()

        cy.log('jump post page and should show input contents and edit button')
        cy.$('postPage').contains('from cypress')
        cy.$('postPage').contains('testing now')
        cy.$('edit-btn').should('exist')
      })
    })
  })
})
