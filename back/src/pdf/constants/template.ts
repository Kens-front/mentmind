import {CreatePaymentDto} from "../../payment/dto/create-payment.dto";
import {User} from "../../user/entities/user.entity";

export type PDFData =   {totalAmount: number, date: Date, paymentId: number, user: User, lesson_count: number, lesson_type: string};

export const template = (data: PDFData) => `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8" />
  <title>Договор оказания консультационных услуг</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Times New Roman', Times, serif;
      font-size: 12pt;
      line-height: 1.5;
      color: #000;
      background: #fff;
      padding: 20mm;
    }

    .header {
      text-align: center;
      margin-bottom: 30px;
    }

    .header h1 {
      font-size: 16pt;
      font-weight: bold;
      margin-bottom: 10px;
    }

    .header .subtitle {
      font-size: 11pt;
      color: #333;
    }

    .contract-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: 30px;
    }

    .contract-info div {
      width: 48%;
    }

    .section {
      margin-bottom: 25px;
    }

    .section-title {
      font-size: 13pt;
      font-weight: bold;
      margin-bottom: 10px;
      border-bottom: 1px solid #000;
      padding-bottom: 5px;
    }

    .subsection {
      margin-bottom: 15px;
    }

    .subsection-title {
      font-weight: bold;
      margin-bottom: 5px;
    }

    ol, ul {
      margin-left: 25px;
      margin-bottom: 10px;
    }

    li {
      margin-bottom: 5px;
    }

    .table {
      width: 100%;
      border-collapse: collapse;
      margin: 15px 0;
    }

    .table th,
    .table td {
      border: 1px solid #000;
      padding: 8px;
      text-align: left;
    }

    .table th {
      background-color: #f0f0f0;
      font-weight: bold;
    }

    .table .right {
      text-align: right;
    }

    .signature-block {
      display: flex;
      justify-content: space-between;
      margin-top: 50px;
      page-break-inside: avoid;
    }

    .signature-block div {
      width: 48%;
    }

    .signature-line {
      border-top: 1px solid #000;
      margin-top: 40px;
      padding-top: 5px;
    }

    .highlight {
      font-weight: bold;
    }

    .page-number {
      text-align: center;
      font-size: 10pt;
      color: #666;
      margin-top: 20px;
    }

    @media print {
      body {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    }
  </style>
</head>
<body>

  <!-- Заголовок -->
  <div class="header">
    <h1>ДОГОВОР ОКАЗАНИЯ КОНСУЛЬТАЦИОННЫХ УСЛУГ</h1>
    <div class="subtitle">на покупку пакета консультаций по программированию</div>
  </div>

  <!-- Информация о договоре -->
  <div class="contract-info">
    <div>
      <p><span class="highlight">${data.date.getDate()} ${data.date.getMonth() + 1}  ${data.date.getFullYear()}г.</span></p>
    </div>
    <div>
      <p>Договор № <span class="highlight">${data.paymentId}</span></p>
    </div>
  </div>

  <!-- Стороны договора -->
  <div class="section">
    <div class="subsection">
      <p>
        <span class="highlight">Исполнитель:</span> ИП Пасечник Константин Константинович, 
        ИНН 550719859728, 
        далее именуемый «Исполнитель», с одной стороны, и
      </p>
      <p>
        <span class="highlight">Заказчик:</span> ${data.user.fullname}, 
        далее именуемый «Заказчик», с другой стороны,
      </p>
      <p style="margin-top: 10px;">
        совместно именуемые «Стороны», заключили настоящий Договор о нижеследующем:
      </p>
    </div>
  </div>

  <!-- 1. Предмет договора -->
  <div class="section">
    <div class="section-title">1. ПРЕДМЕТ ДОГОВОРА</div>
    <div class="subsection">
      <ol>
        <li>Исполнитель обязуется оказать Заказчику консультационные услуги по программированию (далее — «Услуги»), а Заказчик обязуется принять и оплатить эти Услуги.</li>
        <li>Услуги включают в себя:
          <ul>
            <li>Консультации по разработке программного обеспечения;</li>
            <li>Код-ревью и анализ кода;</li>
            <li>Архитектурные консультации;</li>
            <li>Помощь в отладке и оптимизации кода;</li>
            <li>Обучение и менторство по языкам программирования.</li>
          </ul>
        </li>
        <li>Конкретный перечень, объём и сроки оказания Услуг определяются в Приложениях к настоящему Договору.</li>
      </ol>
    </div>
  </div>

  <!-- 2. Информация о покупке -->
  <div class="section">
    <div class="section-title">2. ИНФОРМАЦИЯ О ПОКУПКЕ</div>
    <div class="subsection">
      <table class="table">
        <tr>
          <th style="width: 50%;">Параметр</th>
          <th>Значение</th>
        </tr>
        <tr>
          <td>Наименование пакета услуг</td>
          <td>Пакет по тарифу - ${data.lesson_type}</td>
        </tr>
        <tr>
          <td>Количество консультаций</td>
          <td>${data.lesson_count} часов/сессий</td>
        </tr>
        <tr>
          <td>Стоимость пакета</td>
          <td class="highlight">${data.totalAmount} рублей</td>
        </tr>
        <tr>
          <td>Дата оплаты</td>
          <td>${data.date.getDate()} ${data.date.getMonth() + 1}  ${data.date.getFullYear()}г.</td>
        </tr>
        <tr>
          <td>ID платежа</td>
          <td>${data.paymentId}</td>
        </tr>
        <tr>
          <td>Срок действия пакета</td>
          <td>6 месяцев</td>
        </tr>
      </table>
    </div>
  </div>

  <!-- 3. Права и обязанности Исполнителя -->
  <div class="section">
    <div class="section-title">3. ПРАВА И ОБЯЗАННОСТИ ИСПОЛНИТЕЛЯ</div>
    <div class="subsection">
      <div class="subsection-title">3.1. Исполнитель обязуется:</div>
      <ol>
        <li>Оказать Услуги качественно, в полном объёме и в сроки, согласованные с Заказчиком.</li>
        <li>Предоставлять консультации квалифицированными специалистами с соответствующим опытом работы.</li>
        <li>Соблюдать конфиденциальность информации, полученной от Заказчика в ходе оказания Услуг.</li>
        <li>Не разглашать третьим лицам исходный код, архитектуру и другие технические детали проектов Заказчика.</li>
        <li>Предоставлять отчётность об оказанных Услуги по требованию Заказчика.</li>
        <li>В случае невозможности оказания Услуг по независящим от Заказчика причинам — уведомить Заказчика не менее чем за 24 часа.</li>
      </ol>
    </div>
    <div class="subsection">
      <div class="subsection-title">3.2. Исполнитель имеет право:</div>
      <ol>
        <li>Запрашивать у Заказчика информацию, необходимую для оказания Услуг.</li>
        <li>Отказаться от оказания Услуг в случае нарушения Заказчиком условий настоящего Договора.</li>
        <li>Использовать общие знания и навыки, полученные в ходе работы с Заказчиком, для оказания услуг другим клиентам (за исключением конфиденциальной информации).</li>
      </ol>
    </div>
  </div>

  <!-- 4. Права и обязанности Заказчика -->
  <div class="section">
    <div class="section-title">4. ПРАВА И ОБЯЗАННОСТИ ЗАКАЗЧИКА</div>
    <div class="subsection">
      <div class="subsection-title">4.1. Заказчик обязуется:</div>
      <ol>
        <li>Своевременно оплатить Услуги в размере и порядке, установленном настоящим Договором.</li>
        <li>Предоставить Исполнителю всю необходимую информацию и доступ к ресурсам, требуемым для оказания Услуг.</li>
        <li>Своевременно принимать оказанные Услуги и подписывать акты приёма-передачи.</li>
        <li>Уведомлять Исполнителя об изменении контактных данных в течение 3 (трёх) рабочих дней.</li>
        <li>Соблюдать согласованное расписание консультаций. При отмене консультации менее чем за 24 часа — сгорание сессии не компенсируется.</li>
      </ol>
    </div>
    <div class="subsection">
      <div class="subsection-title">4.2. Заказчик имеет право:</div>
      <ol>
        <li>Требовать от Исполнителя оказания Услуг в соответствии с условиями Договора.</li>
        <li>Получать от Исполнителя информацию о ходе оказания Услуг.</li>
        <li>Отказаться от Услуг при условии оплаты фактически оказанных Услуг.</li>
        <li>Требовать замены специалиста в случае несоответствия квалификации заявленным требованиям.</li>
      </ol>
    </div>
  </div>

  <!-- 5. Стоимость и порядок расчётов -->
  <div class="section">
    <div class="section-title">5. СТОИМОСТЬ И ПОРЯДОК РАСЧЁТОВ</div>
    <div class="subsection">
      <ol>
        <li>Общая стоимость пакета Услуг составляет <span class="highlight">${data.totalAmount} рублей</span>.</li>
        <li>Оплата производится единовременно в полном объёме в течение 1 рабочих дней с момента подписания Договора.</li>
        <li>Оплата осуществляется путём перечисления денежных средств на расчётный счёт Исполнителя.</li>
        <li>В случае необходимости дополнительных Услуг, не входящих в пакет, Стороны заключают дополнительное соглашение.</li>
        <li>Все расчёты по Договору производятся в рублях.</li>
      </ol>
    </div>
  </div>

  <!-- 6. Срок действия договора -->
  <div class="section">
    <div class="section-title">6. СРОК ДЕЙСТВИЯ ДОГОВОРА</div>
    <div class="subsection">
      <ol>
        <li>Настоящий Договор вступает в силу с момента его подписания и действует до полного исполнения Сторонами своих обязательств.</li>
        <li>Срок действия пакета консультаций составляет <span class="highlight">6 месяцев</span> с момента оплаты.</li>
        <li>По истечении срока действия неиспользованные консультации аннулируются без компенсации.</li>
        <li>Договор может быть продлён по взаимному согласию Сторон путём заключения дополнительного соглашения.</li>
      </ol>
    </div>
  </div>

  <!-- 7. Конфиденциальность -->
  <div class="section">
    <div class="section-title">7. КОНФИДЕНЦИАЛЬНОСТЬ</div>
    <div class="subsection">
      <ol>
        <li>Стороны обязуются сохранять конфиденциальность информации, полученной в ходе исполнения Договора.</li>
        <li>Конфиденциальная информация включает: исходный код, архитектуру, бизнес-логику, данные пользователей и другую техническую документацию.</li>
        <li>Обязательства по конфиденциальности действуют в течение 5 лет после окончания действия Договора.</li>
        <li>За нарушение конфиденциальности виновная Сторона несёт ответственность в соответствии с законодательством РФ.</li>
      </ol>
    </div>
  </div>

  <!-- 8. Ответственность сторон -->
  <div class="section">
    <div class="section-title">8. ОТВЕТСТВЕННОСТЬ СТОРОН</div>
    <div class="subsection">
      <ol>
        <li>За неисполнение или ненадлежащее исполнение обязательств по Договору Стороны несут ответственность в соответствии с законодательством РФ.</li>
        <li>Исполнитель не несёт ответственности за убытки Заказчика, связанные с использованием рекомендаций, полученных в ходе консультаций.</li>
        <li>Заказчик несёт ответственность за достоверность предоставленной Исполнителю информации.</li>
        <li>В случае спора Стороны обязуются решить его путём переговоров. При недостижении согласия — спор передаётся в суд по месту нахождения Исполнителя.</li>
      </ol>
    </div>
  </div>

  <!-- 9. Порядок разрешения споров -->
  <div class="section">
    <div class="section-title">9. ПОРЯДОК РАЗРЕШЕНИЯ СПОРОВ</div>
    <div class="subsection">
      <ol>
        <li>Все споры и разногласия решаются путём переговоров.</li>
        <li>Претензионный порядок обязателен. Срок рассмотрения претензии — 7 рабочих дней.</li>
        <li>При недостижении согласия спор передаётся на рассмотрение в арбитражный суд по месту нахождения Исполнителя.</li>
      </ol>
    </div>
  </div>

  <!-- 10. Заключительные положения -->
  <div class="section">
    <div class="section-title">10. ЗАКЛЮЧИТЕЛЬНЫЕ ПОЛОЖЕНИЯ</div>
    <div class="subsection">
      <ol>
        <li>Настоящий Договор составлен в двух экземплярах, имеющих одинаковую юридическую силу, по одному для каждой из Сторон.</li>
        <li>Все изменения и дополнения к Договору действительны только в письменной форме и подписаны обеими Сторонами.</li>
        <li>Договор может быть расторгнут по взаимному согласию Сторон или в одностороннем порядке с уведомлением за {{termination_notice}} дней.</li>
        <li>В случае расторжения Договора по инициативе Заказчика — оплаченные, но не оказанные Услуги возвращаются пропорционально за вычетом проведнных консультаций.</li>
        <li>Настоящий Договор регулируется законодательством Российской Федерации.</li>
      </ol>
    </div>
  </div>

  <!-- 11. Реквизиты и подписи -->
  <div class="section">
    <div class="section-title">11. РЕКВИЗИТЫ И ПОДПИСИ СТОРОН</div>
    <div class="signature-block">
      <div>
        <div class="subsection-title">ИСПОЛНИТЕЛЬ:</div>
        <p>ИП Пасечник Константин Константинович</p>
        <p>ИНН: 550719859728</p>
        <p>Адрес: г.Омск, ул. Конева 32, кв.32</p>
        <p>Email: ken5um@yandex.ru</p>
        <div class="signature-line">Подпись: _________________</div>
        <p style="margin-top: 10px;">М.П.</p>
      </div>
      <div>
        <div class="subsection-title">ЗАКАЗЧИК:</div>
        <p>${data.user.fullname}</p>
        <p>Тел: ${data.user.phone}</p>
        <p>Email: ${data.user.email}</p>
        <div class="signature-line">Подпись: _________________</div>
        <p style="margin-top: 10px;">М.П.</p>
      </div>
    </div>
  </div>
 </body>
</html>`