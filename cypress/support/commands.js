// The COMMAND_DELAY purpose for prevent fail test by unrealistic super fast browser control before appaer target element
const COMMAND_DELAY = 0

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

Cypress.Commands.add('toggleSidebar', () =>
  cy.get('body').trigger('keyup', { key: 'x' })
)

Cypress.Commands.add('login', () => {
  cy.visit('http://localhost:3000')
  cy.get('body').trigger('keyup', { key: 'x' })
  cy.$('login-link').click()
  cy.$('name-input').type('John Doe')
  cy.$('password-input').type('popcoon')
  cy.$('submit-btn').click()
  cy.url().should('eq', 'http://localhost:3000/dashboard')
})

Cypress.Commands.add('logger', (message) => {
  Cypress.log({ message: message, name: 'Logger' })
})

Cypress.Commands.add('logout', () =>
  cy.request('http://localhost:3000/api/logout')
)

Cypress.Commands.add('resetDB', () => cy.exec('yarn db:reset'))

Cypress.Commands.add('cleanDB', () => cy.exec('yarn db:truncate'))
