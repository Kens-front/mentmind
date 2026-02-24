describe('Домашние задания', () => {
  beforeEach(() => {
    cy.login();
  });

  it('загружает и отображает список домашних заданий', () => {
    cy.intercept('GET', '**/homework**', {
      statusCode: 200,
      body: [
        {
          id: 1,
          title: 'Задание по JavaScript',
          description: 'Реализовать функцию сортировки',
          status: 'pending',
          created_at: '2026-01-15T10:00:00Z',
          lesson_id: 5,
        },
        {
          id: 2,
          title: 'Задание по React',
          description: 'Создать компонент формы',
          status: 'completed',
          created_at: '2026-01-10T14:00:00Z',
          lesson_id: 3,
        },
      ],
    }).as('getHomeworks');

    cy.visit('/homeworks');
    cy.wait('@getHomeworks');

    cy.get('[data-cy="homework-item"]').should('have.length', 2);
    cy.contains('Задание по JavaScript').should('be.visible');
    cy.contains('Задание по React').should('be.visible');
  });

  it('создаёт новое домашнее задание', () => {
    cy.intercept('POST', '**/homework', (req) => {
      expect(req.body.title).to.eq('Новое ДЗ по TypeScript');
      expect(req.body.description).to.include('Типизация');

      req.reply({
        statusCode: 201,
        body: {
          id: 3,
          title: 'Новое ДЗ по TypeScript',
          description: 'Типизация компонентов',
          status: 'pending',
          created_at: new Date().toISOString(),
        },
      });
    }).as('createHomework');

    cy.visit('/homeworks/create');

    cy.get('[data-cy="homework-title"]').type('Новое ДЗ по TypeScript');
    cy.get('[data-cy="homework-description"]').type('Типизация компонентов');

    cy.get('[data-cy="homework-submit"]').click();

    cy.wait('@createHomework');

    cy.url().should('include', '/homeworks');
    cy.contains('Новое ДЗ по TypeScript').should('be.visible');
  });

  it('отображает детали домашнего задания', () => {
    cy.intercept('GET', '**/homework/1', {
      statusCode: 200,
      body: {
        id: 1,
        title: 'Задание по JavaScript',
        description: 'Реализовать функцию сортировки массива',
        status: 'pending',
        code: 'function sort(arr) { return arr; }',
        created_at: '2026-01-15T10:00:00Z',
        lesson: {
          id: 5,
          title: 'Урок 5: Алгоритмы',
        },
      },
    }).as('getHomework');

    cy.visit('/homeworks/1');
    cy.wait('@getHomework');

    cy.contains('Задание по JavaScript').should('be.visible');
    cy.contains('Реализовать функцию сортировки массива').should('be.visible');
    cy.get('[data-cy="homework-code"]').should('contain', 'function sort');
  });

  it('обновляет статус домашнего задания', () => {
    cy.intercept('PATCH', '**/homework/1', (req) => {
      expect(req.body.status).to.eq('completed');

      req.reply({
        statusCode: 200,
        body: {
          id: 1,
          status: 'completed',
        },
      });
    }).as('updateHomework');

    cy.visit('/homeworks/1');

    cy.get('[data-cy="homework-status-select"]').click();
    cy.get('.el-select-dropdown__item').contains('Выполнено').click();

    cy.wait('@updateHomework');

    cy.get('.el-message--success').should('be.visible');
  });

  it('показывает ошибку при отсутствии обязательных полей', () => {
    cy.visit('/homeworks/create');

    cy.get('[data-cy="homework-submit"]').should('be.disabled');

    cy.get('[data-cy="homework-title"]').type('Заголовок');
    cy.get('[data-cy="homework-submit"]').should('not.be.disabled');
  });
});
