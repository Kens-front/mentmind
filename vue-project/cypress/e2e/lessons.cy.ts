describe('Уроки', () => {
  beforeEach(() => {
    cy.login();
  });

  it('загружает и отображает список уроков', () => {
    cy.intercept('GET', '**/lesson**', {
      statusCode: 200,
      body: [
        {
          id: 1,
          title: 'Введение в JavaScript',
          date: '2026-01-20',
          time: '10:00',
          status: 'scheduled',
          mentor: { id: 10, fullname: 'Иван Петров' },
          student: { id: 20, fullname: 'Анна Смирнова' },
        },
        {
          id: 2,
          title: 'React Hooks',
          date: '2026-01-22',
          time: '14:00',
          status: 'completed',
          mentor: { id: 10, fullname: 'Иван Петров' },
          student: { id: 21, fullname: 'Петр Васильев' },
        },
      ],
    }).as('getLessons');

    cy.visit('/lessons');
    cy.wait('@getLessons');

    cy.get('[data-cy="lesson-item"]').should('have.length', 2);
    cy.contains('Введение в JavaScript').should('be.visible');
    cy.contains('React Hooks').should('be.visible');
  });

  it('создаёт новый урок', () => {
    cy.intercept('GET', '**/users?role=mentor', {
      statusCode: 200,
      body: [
        { id: 10, fullname: 'Иван Петров' },
      ],
    }).as('getMentors');

    cy.intercept('GET', '**/users?role=student', {
      statusCode: 200,
      body: [
        { id: 20, fullname: 'Анна Смирнова' },
      ],
    }).as('getStudents');

    cy.intercept('POST', '**/lesson', (req) => {
      expect(req.body.title).to.eq('Новый урок');
      expect(req.body.mentor_id).to.eq(10);
      expect(req.body.student_id).to.eq(20);

      req.reply({
        statusCode: 201,
        body: {
          id: 3,
          title: 'Новый урок',
          date: '2026-01-25',
          time: '16:00',
          status: 'scheduled',
          mentor_id: 10,
          student_id: 20,
        },
      });
    }).as('createLesson');

    cy.visit('/lessons');
    cy.wait(['@getMentors', '@getStudents']);

    cy.get('[data-cy="create-lesson-btn"]').click();
    cy.get('[data-cy="create-lesson-modal"]').should('be.visible');

    cy.get('[data-cy="lesson-title"]').type('Новый урок');
    cy.get('[data-cy="lesson-date"]').type('2026-01-25');
    cy.get('[data-cy="lesson-time"]').type('16:00');

    cy.get('[data-cy="mentor-select"]').click();
    cy.get('.el-select-dropdown__item').contains('Иван Петров').click();

    cy.get('[data-cy="student-select"]').click();
    cy.get('.el-select-dropdown__item').contains('Анна Смирнова').click();

    cy.get('[data-cy="lesson-submit"]').click();

    cy.wait('@createLesson');

    cy.get('[data-cy="create-lesson-modal"]').should('not.exist');
    cy.contains('Новый урок').should('be.visible');
  });

  it('отмечает урок как завершённый', () => {
    cy.intercept('GET', '**/lesson/1', {
      statusCode: 200,
      body: {
        id: 1,
        title: 'Введение в JavaScript',
        date: '2026-01-20',
        time: '10:00',
        status: 'scheduled',
        mentor: { id: 10, fullname: 'Иван Петров' },
        student: { id: 20, fullname: 'Анна Смирнова' },
      },
    }).as('getLesson');

    cy.intercept('PATCH', '**/lesson/1', (req) => {
      expect(req.body.status).to.eq('completed');

      req.reply({
        statusCode: 200,
        body: {
          id: 1,
          status: 'completed',
        },
      });
    }).as('completeLesson');

    cy.visit('/lessons/1');
    cy.wait('@getLesson');

    cy.get('[data-cy="complete-lesson-btn"]').click();

    cy.wait('@completeLesson');

    cy.get('.el-message--success').should('be.visible');
    cy.contains('completed').should('exist');
  });

  it('обновляет информацию об уроке', () => {
    cy.intercept('GET', '**/lesson/1', {
      statusCode: 200,
      body: {
        id: 1,
        title: 'Введение в JavaScript',
        date: '2026-01-20',
        time: '10:00',
        status: 'scheduled',
      },
    }).as('getLesson');

    cy.intercept('PATCH', '**/lesson/1', (req) => {
      expect(req.body.title).to.eq('Обновлённое название');

      req.reply({
        statusCode: 200,
        body: {
          id: 1,
          title: 'Обновлённое название',
          date: '2026-01-20',
          time: '10:00',
          status: 'scheduled',
        },
      });
    }).as('updateLesson');

    cy.visit('/lessons/1');
    cy.wait('@getLesson');

    cy.get('[data-cy="edit-lesson-btn"]').click();

    cy.get('[data-cy="lesson-title"]').clear().type('Обновлённое название');
    cy.get('[data-cy="lesson-submit"]').click();

    cy.wait('@updateLesson');

    cy.contains('Обновлённое название').should('be.visible');
  });

  it('удаляет урок', () => {
    cy.intercept('DELETE', '**/lesson/1', {
      statusCode: 204,
    }).as('deleteLesson');

    cy.visit('/lessons');

    cy.get('[data-cy="delete-lesson-1"]').click();
    cy.get('[data-cy="confirm-delete"]').click();

    cy.wait('@deleteLesson');

    cy.get('.el-message--success').should('be.visible');
  });
});
