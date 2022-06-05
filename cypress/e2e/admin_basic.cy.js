before(() => {
  cy.resetDB()
})

context('admin basic', () => {
  beforeEach(() => {
    Cypress.Cookies.preserveOnce('token')
  })
  context('login & logout', () => {
    it('show login button', () => {
      cy.clearLocalStorage()
      cy.visit('http://localhost:3000/')
      cy.toggleSidebar()
      cy.$('login-link').should('exist')
    })

    it('failed login with incorrect user/password', () => {
      cy.clearLocalStorage()
      cy.visit('http://localhost:3000/')
      cy.toggleSidebar()
      cy.$('login-link').click()
      cy.$('name-input').type('wefjweiofjwie')
      cy.$('password-input').type('wfjweoifjio23r03')
      cy.$('submit-btn').click()
      cy.wait(400)
      cy.$('snackbar').should('exist').should('contain', 'User does not exist')
    })

    it('successful Logout', () => {
      cy.login()
      cy.$('logout-link').should('not.exist')
      cy.toggleSidebar()
      cy.$('logout-link').should('exist')
      cy.$('logout-link').contains('Logout').click()
      cy.url().should('eq', 'http://localhost:3000/')
      cy.$('login-link').should('exist')
    })
  })

  context('admin tasks while login', () => {
    it('show dashboard after login', () => {
      cy.clearLocalStorage()
      cy.login()
    })

    context('CRUD post operation', () => {
      it('publish new post', () => {
        cy.clearLocalStorage()
        cy.login()
        cy.get('header > div > a').contains('Today I Learned').click()
        cy.url().should('eq', 'http://localhost:3000/')
        cy.$('dashboard-page-link').contains('Dashboard').click()
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
        cy.get('main h1').contains('from cypress')
        cy.get('main article').contains('testing now')
        cy.$('edit-btn').should('exist')
      })

      it('edit existing post', () => {
        cy.clearLocalStorage()
        cy.login()
        cy.visit('http://localhost:3000/')
        cy.logger('Open post that creaed prev test.')
        cy.$('single-post-page-link-1').contains('from cypress').click()
        cy.url().should('eq', 'http://localhost:3000/post/71')
        cy.get('main h1').contains('from cypress')
        cy.get('main article').contains('testing now')
        cy.logger('Click Edit button and modify contents.')
        cy.$('edit-btn').contains('Edit').click()
        cy.$('edit-title-input').type('Edit Title!')
        cy.$('edit-body-input').type('Edit Post Contents!')
        cy.logger(
          'Edit complete then click Update button, after page transition single post page.'
        )
        cy.$('update-btn').contains('Update').click()
        cy.url().should('eq', 'http://localhost:3000/post/71')
        cy.get('main h1').contains('Edit Title!')
        cy.get('main article').contains('Edit Post Contents!')
      })

      it('delete post', () => {
        cy.clearLocalStorage()
        cy.login()
        cy.visit('http://localhost:3000/')
        cy.$('dashboard-page-link').contains('Dashboard').click()
        cy.url().should('eq', 'http://localhost:3000/dashboard')
        cy.get('main').contains('Edit Title!')
        cy.$('delete-btn-1').contains('Delete').click()
        cy.url().should('eq', 'http://localhost:3000/dashboard')
        cy.get('main').should('not.contain', 'Edit Title!')
      })
    })

    context('auto saving draft ', () => {
      it('still remaing draft post ', () => {
        cy.clearLocalStorage()
        cy.login()
        cy.visit('http://localhost:3000/')

        cy.$('dashboard-page-link').contains('Dashboard').click()
        cy.url().should('eq', 'http://localhost:3000/dashboard')
        cy.scrollTo('bottom')
        cy.$('create-btn').contains('Create').click()
        cy.url().should('eq', 'http://localhost:3000/dashboard/create')

        cy.logger('wrting blog post...')
        cy.$('post-title-input').type('from cypress')
        cy.$('post-body-input').type('testing now')

        cy.logger('leave page without submit')
        cy.visit('http://localhost:3000/')
        cy.$('dashboard-page-link').contains('Dashboard').click()
        cy.url().should('eq', 'http://localhost:3000/dashboard')

        cy.logger('revist and check')
        cy.$('create-btn').contains('Create').click()
        cy.url().should('eq', 'http://localhost:3000/dashboard/create')
        cy.$('post-title-input').should('have.value', 'from cypress')
        cy.$('post-body-input').should('have.value', 'testing now')
      })
    })
  })
})
