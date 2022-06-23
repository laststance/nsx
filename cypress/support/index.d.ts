/// <reference types="cypress" />

declare namespace Cypress {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Chainable<Subject> {
    $(
      selector: string
    ): Chainable<JQuery<HTMLElementTagNameMap[keyof HTMLElementTagNameMap]>>
    login(): Chainable<Response<any>>
    toggleSidebar(): Chainable<JQuery<HTMLElementTagNameMap[string]>>
    logger(): Log
    cleanDB(): Chainable<Exec>
    resetDB(): Chainable<Exec>
  }
}
