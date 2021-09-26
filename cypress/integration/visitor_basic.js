context('Visitor Basic', () => {
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
    const adminContorlBtnShouldNotVisible = () =>
      cy.$('signup-btn').should('not.exist')
    cy.$('dashoard-page-transition-link-btn').should('not.exist')
    cy.$('edit-btn').should('not.exist')

    cy.visit('http://localhost:3000/')
    adminContorlBtnShouldNotVisible()
    cy.$('single-post-page-link-2').click()
    adminContorlBtnShouldNotVisible()
  })
})
