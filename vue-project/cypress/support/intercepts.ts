export const mockMentorAvailability = () => {
    cy.intercept('GET', '**/mentor-availability*', {
      statusCode: 200,
      body: [
        { start: '09:00:00', end: '10:00:00', date: '2025-12-23' },
        { start: '11:00:00', end: '12:00:00', date: '2025-12-23' },
        { start: '13:00:00', end: '18:00:00', date: '2025-12-23' }
      ]
    }).as('getAvailability')
  }
  
  export const mockMentors = () => {
    cy.intercept('GET', '**/users*role=mentor', {
      statusCode: 200,
      body: [
        { id: 200, fullname: 'Mentor One' }
      ]
    }).as('getMentors')
  }
  
  export const mockCreateLesson = () => {
    cy.intercept('POST', '**/lesson', {
      statusCode: 200,
      body: { id: 1 }
    }).as('createLesson')
  }
  