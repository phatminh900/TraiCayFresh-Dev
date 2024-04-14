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
    loginByPhoneNumber(): Chainable<Subject>;

  }
}

Cypress.Commands.add("getById", (selector, agr = []) => {
  return Array.isArray(agr) ? cy.get(`[data-cy=${selector}]`, ...agr) : cy.get(`[data-cy=${selector}]`);
});

Cypress.Commands.add("login", () => {
  cy.visit("/login");
  cy.get("[data-cy='input-email-login']").type("phatminh902@gmail.com");
  cy.get("[data-cy='input-password-login']").type("Ch@vameo5");
 cy.get("[data-cy='btn-submit-login']").click();
  cy.location('pathname').should('eq','/')
});
Cypress.Commands.add("loginByPhoneNumber", () => {
  cy.visit("/login");

  cy.get("[data-cy='login-by-phone-number-alternative']").contains('Đăng nhập bằng số điện thoại').as('button-trigger-open')
  cy.get('@button-trigger-open').click({force:true})

  cy.get("[data-cy='login-by-phone-number-form']").as('login-by-phone-number-form')
  cy.get("[data-cy='login-by-phone-number-submit-btn']").as('login-by-phone-number-submit-btn')
  cy.get('@login-by-phone-number-form').find('input').type('0386325681')
  cy.get('@login-by-phone-number-submit-btn').click()
  cy.get("[data-cy='otp-verification-form']").as('otp-verification-container-form')
  cy.get('@otp-verification-container-form').find('input').as('otp-inputs')
  cy.get("[data-cy='otp-verification-submit-btn']").as('otp-submit-btn')
  cy.get('@otp-inputs').eq(0).type('0')
    cy.get('@otp-inputs').eq(1).type('0')
    cy.get('@otp-inputs').eq(2).type('0')
    cy.get('@otp-inputs').eq(3).type('0')
    cy.get('@otp-inputs').eq(4).type('0')
    cy.get('@otp-inputs').eq(5).type('0')
    cy.get('@otp-submit-btn').click() 
    cy.contains("Xác thực thành công")

    cy.location('pathname').should('eq','/')
});
