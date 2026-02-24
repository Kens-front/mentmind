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
Cypress.Commands.add('login', () => {
  window.localStorage.setItem('token', 'fake-jwt-token');
});

Cypress.Commands.add('mockCreateMentor', () => {
  cy.intercept('POST', '**/auth/register', {
    statusCode: 200,
    body: {
      user: {
        id: 101,
        first_name: 'Иван',
        last_name: 'Иванов',
        email: 'ivan@test.ru',
        role: 'MENTOR',
      },
      profile: {
        learn_directions: [1],
      },
    },
  }).as('createMentor');
});

Cypress.Commands.add('mockGetUser', (role: 'MENTOR' | 'STUDENT') => {
  cy.intercept('GET', '**/user/full/*', {
    statusCode: 200,
    body: {
      user: {
        id: 1,
        first_name: 'Иван',
        last_name: 'Иванов',
        email: 'ivan@test.ru',
        login: 'ivan123',
        phone: '+7(999)111-2233',
        role,
      },
      profile:
        role === 'MENTOR'
          ? { learn_directions: [1] }
          : { learn_direction: 1, mentorId: 10 },
    },
  }).as('getUser');
});

Cypress.Commands.add('mockUpdateUser', () => {
  cy.intercept('PATCH', '**/user/full/*', {
    statusCode: 200,
    body: { success: true },
  }).as('updateUser');
});

Cypress.Commands.add('mockMentors', () => {
  cy.intercept('GET', '**/user?role=mentor*', {
    statusCode: 200,
    body: [
      {
        id: 10,
        fullname: 'Пётр Петров',
      },
    ],
  }).as('getMentors');
});