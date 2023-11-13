before(() => {
  cy.resetDB()
})

context('visitor basic', () => {
  it('show blog title', () => {
    cy.visit('http://localhost:3000/')
    cy.$('header').should('contain', 'ReadList')
  })

  it('show lait article list', () => {
    cy.visit('http://localhost:3000/')
    cy.get('main').should('contain', 'close your eyes')
  })

  it('show single post', () => {
    cy.visit('http://localhost:3000/')
    cy.$('single-post-page-link-1').click()
    // pageTrangition /:postId
    cy.get('main').should('exist').should('contain', 'CSS Weekly #464')
  })

  it('never shown every admin page link button without login', () => {
    cy.visit('http://localhost:3000/')
    cy.$('dashboard-page-link').should('not.exist')

    cy.$('single-post-page-link-2').click()
    cy.$('edit-btn').should('not.exist')
  })

  it('show post that contains syntax hilight Markdown', () => {
    cy.visit('http://localhost:3000/')
    // 07/27/21 React Rush
    cy.$('single-post-page-link-15').should('exist').click()
    cy.get('main').should('exist').should('contain', 'using __proto__')
  })

  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  context('pagenation', () => {
    // showing current & total page number
    it('pagenation', () => {
      cy.visit('http://localhost:3000/')
      cy.$('single-post-page-link-1').should('contain.text', 'close your eyes')
      cy.$('page-count').should('contain.text', '1 / 4')

      // Next Page Button
      cy.$('next-page-btn').click()
      cy.$('single-post-page-link-1')
        .should('exist')
        .should('contain.text', 'Researching production docker-compose setting')
      cy.$('page-count').should('contain.text', '2 / 4')

      // working prev button
      cy.$('prev-page-btn').click()
      cy.$('single-post-page-link-1').should('contain.text', 'close your eyes')
      cy.$('page-count').should('contain.text', '1 / 4')

      // disabled prev button at 1st page'
      cy.$('page-count').should('contain.text', '1 / 4')
      cy.$('prev-page-btn').should('be.disabled')

      // disabled next page at last page
      cy.$('next-page-btn').click()
      cy.$('page-count').should('contain.text', '2 / 4')

      cy.$('next-page-btn').click()
      cy.$('page-count').should('contain.text', '3 / 4')

      cy.$('next-page-btn').click()
      cy.$('page-count').should('contain.text', '4 / 4')

      cy.$('next-page-btn').should('be.disabled')
    })
  }),
    context('dark theme', () => {
      it('working theme switching', () => {
        cy.visit('http://localhost:3000/')

        // Check Light Theme
        cy.$('theme-menu-button').click()
        cy.$('theme-select-option-light').click()
        cy.$('root').should('not.have.class', 'dark')
        cy.$('body').should(
          'have.css',
          'background-color',
          'rgb(255, 255, 255)',
        )

        // Check Dark Theme
        cy.$('theme-menu-button').click()
        cy.$('theme-select-option-dark').click()
        cy.$('root').should('have.class', 'dark')
        cy.$('body').should('have.css', 'background-color', 'rgb(23, 23, 23)')
      })
    })

  context('security', () => {
    it('could never been to any private routes', () => {
      cy.visit('http://localhost:3000/')

      cy.visit('http://localhost:3000/login')
      cy.get('main').should('contain.text', 'Login')

      cy.visit('http://localhost:3000/signup')
      cy.get('main').should('contain.text', '404: Page Not Found')

      cy.visit('http://localhost:3000/dashboard')
      cy.get('main').should('contain.text', '404: Page Not Found')

      cy.visit('http://localhost:3000/dashboard/create')
      cy.get('main').should('contain.text', '404: Page Not Found')

      cy.visit('http://localhost:3000/dashboard/edit')
      cy.get('main').should('contain.text', '404: Page Not Found')

      cy.visit('http://localhost:3000/dashboard/delete')
      cy.get('main').should('contain.text', '404: Page Not Found')
    })
  })
})
