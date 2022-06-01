/// <reference types="cypress" />

declare namespace Cypress {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Chainable<Subject> {
    $(selector: string): Chainable<any>
    login(): Chainable<any>
    toggleSidebar(): Chainable<any>
    logger(): Chainable<any>
    cleanDB(): Chainable<any>
    resetDB(): Chainable<any>
  }
}
