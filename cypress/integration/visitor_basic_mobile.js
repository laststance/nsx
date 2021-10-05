context('Visitor Basic', () => {
  beforeEach(() => {
    cy.viewport('iphone-se2')
  })

  it('show blog title', () => {
    cy.visit('http://localhost:3000/')
    cy.$('header').should('contain', 'Digital Strength')
  })

  it('show lait article list', () => {
    cy.visit('http://localhost:3000/')
    cy.$('top-page-content-root').should('contain', 'close your eyes')
  })

  it('show single post', () => {
    cy.visit('http://localhost:3000/')
    cy.$('single-post-page-link-1').click()
    // pageTrangition /:postId
    cy.$('post-page-content-root')
      .should('exist')
      .should('contain', 'CSS Weekly #464')
  })

  it('never shown every admin page link button without login', () => {
    cy.visit('http://localhost:3000/')
    cy.$('signup-btn').should('not.exist')
    cy.$('dashoard-page-transition-link-btn').should('not.exist')

    cy.$('single-post-page-link-2').click()
    cy.$('edit-btn').should('not.exist')
  })

  it('show post that contains syntax hilight Markdown', () => {
    cy.visit('http://localhost:3000/')
    // 07/27/21 React Rush
    cy.$('single-post-page-link-17').click()
    cy.$('post-page-content-root')
      .should('exist')
      .should('contain', 'using __proto__')
  })
})
