// The COMMAND_DELAY purpose for prevent fail test by unrealistic super fast browser control before appaer target element
const COMMAND_DELAY = 550

for (const command of [
  'visit',
  'click',
  'trigger',
  'type',
  'clear',
  'reload',
  'contains',
]) {
  Cypress.Commands.overwrite(command, (originalFn, ...args) => {
    const origVal = originalFn(...args)

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(origVal)
      }, COMMAND_DELAY)
    })
  })
}

Cypress.Commands.add('$', (selector) => cy.get('[data-cy=' + selector + ']'))

Cypress.Commands.add('login', () => {
  cy.visit('http://localhost:3000')
  cy.$('login-btn').click()
  cy.$('name-input').type('John Doe')
  cy.$('password-input').type('popcoon')
  cy.$('submit-btn').click()
  cy.$('blog-title-top-page-link').click()
})

Cypress.Commands.add('comment', (message) => {
  Cypress.log({ name: 'Comment', message: message })
})

Cypress.Commands.add('logout', () =>
  cy.request('http://localhost:3000/api/logout')
)

Cypress.Commands.add('resetDB', () =>
  cy.exec(
    'yarn db:drop && yarn db:create && yarn db:migrate && yarn db:seed:all'
  )
)
