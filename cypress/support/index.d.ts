/// <reference types="cypress" />

declare namespace Cypress {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Chainable<Subject> {
    $(
      selector: string,
    ): Chainable<JQuery<HTMLElementTagNameMap[keyof HTMLElementTagNameMap]>>
    login(): Chainable<Response<any>>
    logout(): Chainable<Response<any>>
    toggleSidebar(): Chainable<JQuery<HTMLBodyElement>>
    logger(message: string): void
    cleanDB(): Chainable<Exec>
    resetDB(): Chainable<Exec>
  }
}
