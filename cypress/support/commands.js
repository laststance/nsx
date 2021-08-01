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

Cypress.Commands.add('login', (name = 'ryota', password = 'popcoon') => {
  return cy.request('POST', '/api/login', {
    name,
    password,
  })
})

Cypress.Commands.add('logout', () => {
  cy.clearCookies()
  cy.clearLocalStorage()
  return cy.visit('http://localhost:3000')
})

Cypress.Commands.add('resetDB', () => {
  cy.exec(
    'yarn db:drop && yarn db:create && yarn db:migrate && yarn db:seed:all'
  )
})
