describe('Выплаты менторам', () => {
  beforeEach(() => {
    cy.login();
  });

  it('загружает и отображает список выплат ментора', () => {
    cy.intercept('GET', '**/mentor-payout**', {
      statusCode: 200,
      body: [
        {
          id: 1,
          mentor_id: 10,
          amount: 5000,
          status: 'paid',
          created_at: '2026-01-15T12:00:00Z',
          paid_at: '2026-01-16T10:00:00Z',
          mentor: {
            id: 10,
            fullname: 'Иван Петров',
          },
          lessons_count: 10,
        },
        {
          id: 2,
          mentor_id: 11,
          amount: 3500,
          status: 'pending',
          created_at: '2026-01-18T14:00:00Z',
          mentor: {
            id: 11,
            fullname: 'Анна Сидорова',
          },
          lessons_count: 7,
        },
      ],
    }).as('getPayouts');

    cy.visit('/payouts/mentors');
    cy.wait('@getPayouts');

    cy.get('[data-cy="payout-item"]').should('have.length', 2);
    cy.contains('Иван Петров').should('be.visible');
    cy.contains('5000').should('be.visible');
    cy.contains('Анна Сидорова').should('be.visible');
  });

  it('фильтрует выплаты по статусу', () => {
    cy.intercept('GET', '**/mentor-payout?status=paid', {
      statusCode: 200,
      body: [
        {
          id: 1,
          mentor_id: 10,
          amount: 5000,
          status: 'paid',
          created_at: '2026-01-15T12:00:00Z',
          paid_at: '2026-01-16T10:00:00Z',
        },
      ],
    }).as('getPayoutsPaid');

    cy.visit('/payouts/mentors');

    cy.get('[data-cy="status-filter"]').click();
    cy.get('.el-select-dropdown__item').contains('Оплачено').click();

    cy.wait('@getPayoutsPaid');

    cy.get('[data-cy="payout-item"]').should('have.length', 1);
    cy.contains('paid').should('be.visible');
  });

  it('фильтрует выплаты по дате', () => {
    cy.intercept('GET', '**/mentor-payout?start_date=2026-01-01&end_date=2026-01-31', {
      statusCode: 200,
      body: [
        {
          id: 1,
          amount: 5000,
          status: 'paid',
          created_at: '2026-01-15T12:00:00Z',
        },
      ],
    }).as('getPayoutsFiltered');

    cy.visit('/payouts/mentors');

    cy.get('[data-cy="date-filter-start"]').type('2026-01-01');
    cy.get('[data-cy="date-filter-end"]').type('2026-01-31');
    cy.get('[data-cy="apply-filter"]').click();

    cy.wait('@getPayoutsFiltered');

    cy.get('[data-cy="payout-item"]').should('have.length.at.least', 1);
  });

  it('создаёт новую выплату ментору', () => {
    cy.intercept('GET', '**/users?role=mentor', {
      statusCode: 200,
      body: [
        { id: 10, fullname: 'Иван Петров' },
      ],
    }).as('getMentors');

    cy.intercept('POST', '**/mentor-payout', (req) => {
      expect(req.body.mentor_id).to.eq(10);
      expect(req.body.amount).to.eq(4500);

      req.reply({
        statusCode: 201,
        body: {
          id: 3,
          mentor_id: 10,
          amount: 4500,
          status: 'pending',
          created_at: new Date().toISOString(),
        },
      });
    }).as('createPayout');

    cy.visit('/payouts/mentors');
    cy.wait('@getMentors');

    cy.get('[data-cy="create-payout-btn"]').click();
    cy.get('[data-cy="payout-modal"]').should('be.visible');

    cy.get('[data-cy="mentor-select"]').click();
    cy.get('.el-select-dropdown__item').contains('Иван Петров').click();

    cy.get('[data-cy="payout-amount"]').type('4500');

    cy.get('[data-cy="payout-submit"]').click();

    cy.wait('@createPayout');

    cy.get('[data-cy="payout-modal"]').should('not.exist');
    cy.get('.el-message--success').should('be.visible');
  });

  it('обновляет статус выплаты на "оплачено"', () => {
    cy.intercept('PATCH', '**/mentor-payout/2', (req) => {
      expect(req.body.status).to.eq('paid');

      req.reply({
        statusCode: 200,
        body: {
          id: 2,
          status: 'paid',
          paid_at: new Date().toISOString(),
        },
      });
    }).as('markAsPaid');

    cy.visit('/payouts/mentors');

    cy.get('[data-cy="mark-paid-2"]').click();

    cy.wait('@markAsPaid');

    cy.get('[data-cy="payout-2-status"]').should('contain', 'paid');
    cy.get('.el-message--success').should('be.visible');
  });

  it('отображает детали выплаты с информацией об уроках', () => {
    cy.intercept('GET', '**/mentor-payout/1', {
      statusCode: 200,
      body: {
        id: 1,
        mentor_id: 10,
        amount: 5000,
        status: 'paid',
        created_at: '2026-01-15T12:00:00Z',
        paid_at: '2026-01-16T10:00:00Z',
        mentor: {
          id: 10,
          fullname: 'Иван Петров',
        },
        lessons: [
          { id: 1, title: 'Урок 1', date: '2026-01-10' },
          { id: 2, title: 'Урок 2', date: '2026-01-12' },
        ],
      },
    }).as('getPayoutDetails');

    cy.visit('/payouts/mentors/1');
    cy.wait('@getPayoutDetails');

    cy.contains('Иван Петров').should('be.visible');
    cy.contains('5000').should('be.visible');
    cy.get('[data-cy="lesson-item"]').should('have.length', 2);
  });

  it('считает общую сумму выплат', () => {
    cy.intercept('GET', '**/mentor-payout**', {
      statusCode: 200,
      body: [
        { id: 1, amount: 5000, status: 'paid' },
        { id: 2, amount: 3500, status: 'paid' },
        { id: 3, amount: 2000, status: 'pending' },
      ],
    }).as('getPayouts');

    cy.visit('/payouts/mentors');
    cy.wait('@getPayouts');

    cy.get('[data-cy="total-amount"]').should('contain', '10500');
  });
});
