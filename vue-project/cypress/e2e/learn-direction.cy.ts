describe('Создание учебного направления', () => {
    beforeEach(() => {
      // имитируем авторизованного пользователя
      cy.login();
  
      // мокаем API создания
      cy.intercept('POST', '**/learn-direction**', {
        statusCode: 201,
        body: {
          id: 1,
          title: 'Frontend разработка'
        }
      }).as('createLearnDirection');

      cy.intercept('DELETE', '**/learn-direction/1**', {
        statusCode: 201,
      }).as('deleteLearnDirection');

      cy.intercept('PATCH', '**/learn-direction/**', (req) => {
        // помечаем как мок, если у тебя включен "no backend policy"
        req.headers['x-cypress-mock'] = 'true';
  
        // ответ не важен для твоего стора (ты обновляешь локально),
        // но можно вернуть обновлённую сущность для контракта
        req.reply({
          statusCode: 200,
          body: { id: 1, title: req.body?.title ?? 'Frontend PRO' }
        });
      }).as('updateLearnDirection');
  
      cy.visit('/learn-directions');
    });
  
    it('после создания направление появляется в el-table', () => {
        // таблица есть, но строк нет
        cy.get('[data-testid="learn-direction-table"]').should('exist');
        cy.contains('Frontend разработка').should('not.exist');

        // вводим название
        cy.get('[data-testid="learn-direction-input"]')
            .type('Frontend разработка')
            .should('have.value', 'Frontend разработка');

        // создаём
        cy.get('[data-testid="learn-direction-submit"]').click();

        // проверяем POST
        cy.wait('@createLearnDirection')
            .its('request.body')
            .should('deep.include', {
            title: 'Frontend разработка'
            });

        // input очищен → reset() реально сработал
        cy.get('[data-testid="learn-direction-input"]').should('have.value', '');

        // в таблице появилась строка
        cy.contains('td', 'Frontend разработка').should('exist');
    });


    it('удаляет учебное направление и обновляет таблицу', () => {
        cy.intercept('GET', '**/learn-direction**', {
            statusCode: 200,
            body: [
              { id: 1, title: 'Frontend' },
              { id: 2, title: 'Backend' }
            ]
          }).as('getLearnDirections');

        cy.intercept('DELETE', '**/learn-direction/**', {
            statusCode: 204
        }).as('deleteLearnDirection');
        // проверяем, что оба есть
        cy.contains('td', 'Frontend').should('exist');
        cy.contains('td', 'Backend').should('exist');
    
        // удаляем Frontend (id = 1)
        cy.get('[data-testid="learn-direction-delete-1"]').click();
    
        // проверяем DELETE-запрос
        cy.wait('@deleteLearnDirection')
          .its('request.url')
          .should('include', '/1');
    
        // элемент исчез из UI
        cy.contains('td', 'Frontend').should('not.exist');
    
        // второй остался
        cy.contains('td', 'Backend').should('exist');
    
        // индекс пересчитался (остался 1 элемент)
        cy.contains('td', '1').should('exist');
      });

      it('открывает модалку, подставляет текущее название, сохраняет новое и обновляет таблицу', () => {
        cy.intercept('GET', '**/learn-direction**', {
            statusCode: 200,
            body: [
              { id: 1, title: 'Frontend' },
              { id: 2, title: 'Backend' }
            ]
          }).as('getLearnDirections');
        // 1) убеждаемся, что исходное значение есть
        cy.contains('td', 'Frontend').should('exist');
    
        // 2) открываем модалку редактирования для id=1
        cy.get('[data-testid="learn-direction-edit-open-1"]').click();
    
        // 3) проверяем, что инпут в модалке подхватил default title (setDefaultTitle)
        cy.get('[data-testid="learn-direction-edit-input"]')
          .should('be.visible')
          .and('have.value', 'Frontend');
    
        // 4) вводим новое название
        cy.get('[data-testid="learn-direction-edit-input"]')
          .clear()
          .type('Front-end PRO')
          .should('have.value', 'Front-end PRO');
    
        // 5) сохраняем
        cy.get('[data-testid="learn-direction-edit-save"]').click();
    
        // 6) проверяем сетевой запрос и тело (важно)
        cy.wait('@updateLearnDirection')
          .its('request')
          .then((r) => {
            // URL должен содержать /1 (если у тебя так устроено)
            expect(r.url).to.include('/1');
    
            // updatedDirection у тебя объект; обычно важно поле title
            expect(r.body).to.deep.include({ title: 'Front-end PRO' });
          });
    
        // 7) UI обновился: старого текста нет, новый есть
        cy.contains('td', 'Frontend').should('not.exist');
        cy.contains('td', 'Front-end PRO').should('exist');
    
        // 8) модалка закрылась (косвенно): поля формы не видно
        cy.get('[data-testid="learn-direction-edit-input"]').should('not.exist');
      });

      it('кликает по кнопке удаления, удаляет направление', () => {
        cy.intercept('GET', '**/learn-direction**', {
            statusCode: 200,
            body: [
              { id: 1, title: 'Frontend' },
              { id: 2, title: 'Backend' }
            ]
          }).as('getLearnDirections');
        // 1) убеждаемся, что исходное значение есть
        cy.contains('td', 'Frontend').should('exist');
    
        // 2) открываем модалку редактирования для id=1
        cy.get('[data-testid="learn-direction-delete-1"]').click();
    
 
        cy.wait('@deleteLearnDirection')
    
        // 7) UI обновился: старого текста нет, новый есть
        cy.contains('td', 'Frontend').should('not.exist');
      });
});
  