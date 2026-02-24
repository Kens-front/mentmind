describe('Доступность ментора (слоты)', () => {
  beforeEach(() => {
    cy.login();
  });

  it('загружает и отображает слоты доступности ментора', () => {
    cy.intercept('GET', '**/mentor-availability**', {
      statusCode: 200,
      body: [
        {
          id: 1,
          mentor_id: 10,
          date: '2026-01-20',
          start: '09:00:00',
          end: '10:00:00',
          is_available: true,
        },
        {
          id: 2,
          mentor_id: 10,
          date: '2026-01-20',
          start: '11:00:00',
          end: '12:00:00',
          is_available: false,
        },
        {
          id: 3,
          mentor_id: 10,
          date: '2026-01-21',
          start: '14:00:00',
          end: '16:00:00',
          is_available: true,
        },
      ],
    }).as('getAvailability');

    cy.visit('/mentor-slots');
    cy.wait('@getAvailability');

    cy.get('[data-cy="availability-slot"]').should('have.length', 3);
    cy.contains('09:00').should('be.visible');
    cy.contains('11:00').should('be.visible');
    cy.contains('14:00').should('be.visible');
  });

  it('создаёт новый слот доступности', () => {
    cy.intercept('POST', '**/mentor-availability', (req) => {
      expect(req.body.date).to.eq('2026-01-25');
      expect(req.body.start).to.eq('10:00:00');
      expect(req.body.end).to.eq('11:00:00');

      req.reply({
        statusCode: 201,
        body: {
          id: 4,
          mentor_id: 10,
          date: '2026-01-25',
          start: '10:00:00',
          end: '11:00:00',
          is_available: true,
        },
      });
    }).as('createSlot');

    cy.visit('/mentor-slots');

    cy.get('[data-cy="add-slot-btn"]').click();
    cy.get('[data-cy="slot-modal"]').should('be.visible');

    cy.get('[data-cy="slot-date"]').type('2026-01-25');
    cy.get('[data-cy="slot-start"]').type('10:00');
    cy.get('[data-cy="slot-end"]').type('11:00');

    cy.get('[data-cy="slot-submit"]').click();

    cy.wait('@createSlot');

    cy.get('[data-cy="slot-modal"]').should('not.exist');
    cy.get('.el-message--success').should('be.visible');
  });

  it('редактирует существующий слот', () => {
    cy.intercept('GET', '**/mentor-availability/1', {
      statusCode: 200,
      body: {
        id: 1,
        date: '2026-01-20',
        start: '09:00:00',
        end: '10:00:00',
        is_available: true,
      },
    }).as('getSlot');

    cy.intercept('PATCH', '**/mentor-availability/1', (req) => {
      expect(req.body.end).to.eq('10:30:00');

      req.reply({
        statusCode: 200,
        body: {
          id: 1,
          date: '2026-01-20',
          start: '09:00:00',
          end: '10:30:00',
          is_available: true,
        },
      });
    }).as('updateSlot');

    cy.visit('/mentor-slots');

    cy.get('[data-cy="edit-slot-1"]').click();
    cy.wait('@getSlot');

    cy.get('[data-cy="slot-end"]').clear().type('10:30');
    cy.get('[data-cy="slot-submit"]').click();

    cy.wait('@updateSlot');

    cy.contains('10:30').should('be.visible');
  });

  it('закрывает слот (делает недоступным)', () => {
    cy.intercept('PATCH', '**/mentor-availability/1', (req) => {
      expect(req.body.is_available).to.eq(false);

      req.reply({
        statusCode: 200,
        body: {
          id: 1,
          is_available: false,
        },
      });
    }).as('closeSlot');

    cy.visit('/mentor-slots');

    cy.get('[data-cy="close-slot-1"]').click();

    cy.wait('@closeSlot');

    cy.get('[data-cy="slot-1"]').should('have.class', 'slot--unavailable');
  });

  it('удаляет слот доступности', () => {
    cy.intercept('DELETE', '**/mentor-availability/1', {
      statusCode: 204,
    }).as('deleteSlot');

    cy.visit('/mentor-slots');

    cy.get('[data-cy="delete-slot-1"]').click();
    cy.get('[data-cy="confirm-delete"]').click();

    cy.wait('@deleteSlot');

    cy.get('[data-cy="availability-slot-1"]').should('not.exist');
  });

  it('валидирует время окончания после времени начала', () => {
    cy.visit('/mentor-slots');

    cy.get('[data-cy="add-slot-btn"]').click();

    cy.get('[data-cy="slot-date"]').type('2026-01-25');
    cy.get('[data-cy="slot-start"]').type('14:00');
    cy.get('[data-cy="slot-end"]').type('13:00');

    cy.get('[data-cy="slot-submit"]').should('be.disabled');
    cy.contains('Время окончания должно быть позже времени начала').should('be.visible');
  });

  it('отображает календарь со слотами', () => {
    cy.intercept('GET', '**/mentor-availability**', {
      fixture: 'mentorAvailability.json',
    }).as('getAvailability');

    cy.visit('/mentor-slots');
    cy.wait('@getAvailability');

    cy.get('[data-cy="calendar"]').should('be.visible');
    cy.get('.calendar-day').contains('20').click();

    cy.get('[data-cy="day-slots"]').should('be.visible');
    cy.get('[data-cy="availability-slot"]').should('have.length.at.least', 1);
  });
});
