// cypress/e2e/login.cy.ts
describe('Login', () => {
    beforeEach(() => {
      cy.visit('/auth')
    })
  
    it('success login redirects to home', () => {
      cy.intercept('POST', '**/login', {
        statusCode: 200,
        body: {
          user: { id: 1, name: 'Test User' },
          token: 'fake-jwt-token',
        },
      }).as('login')
  
      cy.get('input[data-testid="login-input"]')
        .type('admin')
  
      cy.get('input[data-testid="password-input"]')
        .type('123456')
  
      cy.get('[data-testid="submit-btn"]').click()
  
      cy.wait('@login')
  
      cy.url().should('eq', Cypress.config().baseUrl + '/')
  
      cy.window().then((win) => {
        expect(win.localStorage.getItem('token')).to.eq('fake-jwt-token')
      })
    })

    it('shows error message on failed login', () => {
        cy.intercept('POST', '**/login', {
          statusCode: 401,
          body: {
            message: 'Неверный логин или пароль',
          },
        }).as('loginFail')
      
        cy.get('input[data-testid="login-input"]')
          .type('admin')
      
        cy.get('input[data-testid="password-input"]')
          .type('wrongpass')
      
        cy.get('[data-testid="submit-btn"]').click()
      
        cy.wait('@loginFail')
      
        cy.contains('Неверный логин или пароль').should('be.visible')
      
        cy.url().should('include', '/auth')
      })
      
      it('submit disabled when inputs empty', () => {
        cy.get('[data-testid="submit-btn"]').should('be.disabled')
      })
  })

  