 



// cypress/e2e/create-mentor.cy.ts
const learnDirections = [
  { id: 1, title: 'Frontend' },
  { id: 2, title: 'Backend' },
];

function interceptCommon() {
  cy.intercept('GET', '**/learn-direction**', {
    statusCode: 200,
    body: learnDirections,
  }).as('getLearnDirections');

  cy.intercept('GET', '**/user**', {
    statusCode: 200,
    body: [],
  }).as('getUsers');
}

function fillBaseFields() {
  cy.get('[data-cy="first-name"]').type('Иван');
  cy.get('[data-cy="last-name"]').type('Иванов');
  cy.get('[data-cy="email"]').type('ivan@test.ru');
  cy.get('[data-cy="login"]').type('ivanov');
  cy.get('[data-cy="phone"]').type('9991234567');
  cy.get('[data-cy="password"]').type('12345678');
}

function selectDirection(label: string) {
  cy.get('[data-cy="learn-direction-select"]').click();
  cy.get('.el-select-dropdown__item').contains(label).click();
}

describe('Создание пользователей', () => {
  beforeEach(() => {
    cy.login();
    interceptCommon();
  });

  it('Админ создаёт ментора — запрос корректен, пользователь в таблице', () => {
    cy.intercept('POST', '**/auth/register', (req) => {
      expect(req.body.role).to.eq('mentor');
      expect(req.body.learn_directions).to.deep.eq([1]);

      req.reply({
        statusCode: 201,
        body: {
          user: {
            id: 101,
            first_name: 'Иван',
            last_name: 'Иванов',
            email: 'ivan@test.ru',
            phone: '+7(999)123-4567',
            login: 'ivanov',
            role: 'mentor',
            status: 'active',
            fullname: 'Иван Иванов',
          },
          profile: {
            learn_directions: [1],
            mentor_profile: { students_count: 0 },
          },
        },
      });
    }).as('createMentor');

    cy.visit('/mentors');
    cy.wait(['@getLearnDirections', '@getUsers']);

    cy.get('[data-cy="create-user-btn"]').click();
    cy.get('[data-cy="create-user-modal"]').should('be.visible');

    fillBaseFields();
    selectDirection('Frontend');

    cy.get('[data-testid="learn-direction-edit-save"]').click();

    cy.wait('@createMentor')
      .its('request.body')
      .should('deep.include', {
        first_name: 'Иван',
        last_name: 'Иванов',
        email: 'ivan@test.ru',
        login: 'ivanov',
      });

    cy.get('[data-cy="create-user-modal"]').should('not.exist');

    cy.get('[data-cy="users-table"]')
      .contains('Иван Иванов')
      .should('be.visible');
  });

  it('Админ создаёт студента — запрос корректен, пользователь в таблице', () => {
    cy.intercept('POST', '**/auth/register', (req) => {
      expect(req.body.role).to.eq('student');
      expect(req.body.learn_direction).to.eq(2);

      req.reply({
        statusCode: 201,
        body: {
          user: {
            id: 202,
            first_name: 'Иван',
            last_name: 'Иванов',
            email: 'ivan@test.ru',
            phone: '+7(999)123-4567',
            login: 'ivanov',
            role: 'student',
            status: 'active',
            fullname: 'Иван Иванов',
          },
          profile: {
            learn_direction: 2,
            student_profile: { mentorId: null },
          },
        },
      });
    }).as('createStudent');

    cy.visit('/students');
    cy.wait(['@getLearnDirections', '@getUsers']);

    cy.get('[data-cy="create-user-btn"]').click();
    cy.get('[data-cy="create-user-modal"]').should('be.visible');

    fillBaseFields();
    selectDirection('Backend');

    cy.get('[data-testid="learn-direction-edit-save"]').click();

    cy.wait('@createStudent')
      .its('request.body')
      .should('deep.include', {
        first_name: 'Иван',
        last_name: 'Иванов',
        email: 'ivan@test.ru',
        login: 'ivanov',
      });

    cy.get('[data-cy="create-user-modal"]').should('not.exist');

    cy.get('[data-cy="users-table"]')
      .contains('Иван Иванов')
      .should('be.visible');
  });
});