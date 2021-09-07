const COMMAND_DELAY = 500

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

Cypress.Commands.add('logout', () => {
  return cy.request('http://localhost:3000/api/logout')
})

Cypress.Commands.add('resetDB', () => {
  cy.exec(
    'yarn db:drop && yarn db:create && yarn db:migrate && yarn db:seed:all'
  )
})
