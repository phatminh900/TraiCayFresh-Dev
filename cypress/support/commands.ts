/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

declare namespace Cypress {
  interface Chainable<Subject> {
    // Define the custom command with the correct signature
    getById(selector: string, ...args: any[]): Chainable<Subject>;
    login(): Chainable<Subject>;
  }
}

Cypress.Commands.add("getById", (selector, agr) => {
  return cy.get(`[data-cy=${selector}]`, ...agr);
});

Cypress.Commands.add("login", () => {
  cy.visit("/login");
  cy.get("[data-cy='input-email-login']").type("phatminh902@gmail.com");
  cy.get("[data-cy='input-password-login']").type("Ch@vameo5");
  cy.contains("Đăng nhập").click();
});
