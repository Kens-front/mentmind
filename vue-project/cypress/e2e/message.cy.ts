 
const io = require('socket.io-client');

describe('Chat page — load messages', () => {

    beforeEach(() => {
        // имитируем авторизованного пользователя
        cy.login();
      });


    it('loads and renders messages', () => {
      cy.intercept('GET', '**/messages/chat/1**', {
        fixture: 'messages.json',
      }).as('getMessages')
  
      cy.visit('/chats/1')
      cy
      cy.wait('@getMessages')
  
      cy.get('[data-cy="message-item"]').should('have.length', 2)
      cy.contains('Привет')
      cy.contains('Как дела?')
    })


    it('sends message on submit', () => {
        cy.intercept('POST', '**/messages', {
          statusCode: 200,
          body: {
            id: 3,
            senderId: 10,
            text: 'Новое сообщение',
            chatId: 1,
            status: 'sent',
            createdAt: new Date().toISOString(),
            sender: { id: 10, name: 'User 1' },
          },
        }).as('sendMessage')
    
        cy.visit('/chats/1')
    
    
        cy.get('[data-cy="chat-input"] .chat-input__input')
          .type('Новое сообщение{enter}')
    
        cy.wait('@sendMessage')

 
        cy.get('.el-message--success').should('exist')
        // cy.contains('Новое сообщение')
      })
  })
 