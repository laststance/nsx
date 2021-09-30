context('Admin Basic Mobile', () => {
  beforeEach(() => {
    cy.viewport('iphone-se2')
  })

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
      cy.$('signup-page-content-root').contains('Signup')

      // input signup form
      cy.$('name-input').type('newTransitionBloger{enter}')
      cy.$('password-input').type('superstroingpassword')
      // sbumit
      cy.$('submit-btn').click()

      // pageTransition /dashboard
      cy.url().should('eq', 'http://localhost:3000/dashboard')
      cy.$('dashboard-page-content-root').contains('Dashboard')
      cy.logout()
    })
  })
  context('With login', () => {
    it('should show dashbord/login button', () => {
      cy.login()
      // @TODO remove when implemented pagenation
      cy.scrollTo('bottom')
      // should show dashbord/login button
      cy.$('dashoard-page-transition-link-btn').should('exist')
      cy.$('logout-btn').should('exist')
    })
    context('CRUD post operation', () => {
      it('can publish new post', () => {
        cy.$('blog-title-top-page-link').click()
        cy.$('dashoard-page-transition-link-btn').click()
        cy.url().should('eq', 'http://localhost:3000/dashboard')
        cy.$('create-btn').click()
        cy.url().should('eq', 'http://localhost:3000/dashboard/create')
        cy.logger('wrting blog post...')
        cy.$('post-title-input').type('from cypress')
        cy.$('post-body-input').type('testing now')

        cy.logger('click submit button')
        cy.$('submit-btn').click()

        cy.logger(
          'jump post page and should show input contents and edit button'
        )
        cy.$('post-page-content-root').contains('from cypress')
        cy.$('post-page-content-root').contains('testing now')
        cy.$('edit-btn').should('exist')
      })

      it('can edit existing post', () => {
        cy.$('blog-title-top-page-link').click()
        cy.logger('Open post that creaed prev test.')
        cy.$('single-post-page-link-1').click()
        cy.$('post-page-content-root').contains('from cypress')
        cy.$('post-page-content-root').contains('testing now')
        cy.logger('Click Edit button and modify contents.')
        cy.$('edit-btn').click()
        cy.$('edit-title-input').type('Edit Title!')
        cy.$('edit-body-input').type('Edit Post Contents!')
        cy.logger(
          'Edit complete then click Update button, after page transition single post page.'
        )
        cy.$('update-btn').click()
        cy.$('post-page-content-root').should('exist')
        cy.$('post-page-content-root').contains('Edit Title!')
        cy.$('post-page-content-root').contains('Edit Post Contents!')
      })

      it('can delete post', () => {
        cy.$('blog-title-top-page-link').click()
        cy.$('dashoard-page-transition-link-btn').click()
        cy.$('dashboard-page-content-root').contains('Edit Title!')
        cy.$('delete-btn-1').click()
        cy.$('dashboard-page-content-root').should('not.contain', 'Edit Title!')
      })
    })
  })
})
