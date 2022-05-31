/// <reference types="cypress" />

declare namespace Cypress {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Chainable<Subject> {
    /**
     * Create several Todo items via UI
     * @example
     * cy.#createDefaultTodos()
     */
    $(selector: string): Chainable<any>
    /**
     * Creates one Todo using UI
     * @example
     * cy.createTodo('new item')
     */
    login(): Chainable<any>

    /**
     * Command that injects Axe core library into app html.
     * @example
     *  cy.visit('/')
     *  cy.v()
     */
    toggleSidebar(): Chainable<any>

    /**
     * Command that injects Axe core library into app html.
     * @example
     *  cy.visit('/')
     *  cy.v()
     */
    logger(): Chainable<any>

    /**
     * Command that injects Axe core library into app html.
     * @example
     *  cy.visit('/')
     *  cy.v()
     */
    cleanDB(): Chainable<any>
    /**
     * Command that injects Axe core library into app html.
     * @example
     *  cy.visit('/')
     *  cy.v()
     */
    resetDB(): Chainable<any>
  }
}
