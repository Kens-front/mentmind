<template>
        <div class="contact-form">
        <div class="header">
            <div class="icon">💬</div>
            <h2>Свяжемся с вами</h2>
        </div>

        <form id="contactForm">
            <div class="form-group">
                <label for="name">Ваше имя</label>
                <div class="input-wrapper">
                    <span class="input-icon">👤</span>
                    <input type="text" id="name" placeholder="Имя" required>
                </div>
            </div>

            <div class="form-group">
                <label for="contactMethod">Предпочтительный способ связи</label>
                <div class="input-wrapper select-wrapper">
                    <select id="contactMethod" required>
                        <option value="" disabled selected>Email</option>
                        <option value="email">Email</option>
                        <option value="phone">Телефон</option>
                        <option value="telegram">Telegram</option>
                    </select>
                </div>
            </div>

            <div class="form-group">
                <label for="email">Ваш email</label>
                <div class="input-wrapper">
                    <span class="input-icon">✉️</span>
                    <input type="email" id="email" placeholder="Ваш email" required>
                </div>
            </div>

            <div class="form-group">
                <label for="comment">Ваш комментарий</label>
                <textarea id="comment" rows="4" placeholder="Введите ваш комментарий..."></textarea>
            </div>

            <div class="checkbox-container">
                <label class="switch">
                    <input type="checkbox" id="terms" required>
                    <span class="slider"></span>
                </label>
                <span class="checkbox-label">Я согласен с условиями использования</span>
            </div>

            <button type="submit" class="submit-btn">Связаться</button>
        </form>

        <div class="footer">
            <p><a href="#">Политика конфиденциальности</a></p>
            <p>Менторский онлайн-центр МентМайнд © 2024-2025</p>
            <p>ИП Пасечник Константин Константинович</p>
            <p>ИНН 550719859728</p>
        </div>
    </div>
</template>

<style scoped>
    body {
        background: linear-gradient(135deg, #1a1a2e, #16213e);
        margin: 0;
        padding: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        color: #ffffff;
    }

    .contact-form {
        background: rgba(70, 45, 95, 0.7);
        backdrop-filter: blur(10px);
        border-radius: 20px;
        padding: 30px;
        width: 400px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        position: relative;
        overflow: hidden;
    }

    .contact-form::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: linear-gradient(45deg, rgba(148, 0, 211, 0.1), rgba(255, 255, 255, 0));
        z-index: -1;
        animation: pulse 5s ease-in-out infinite;
    }

    @keyframes pulse {
        0% { opacity: 0.3; }
        50% { opacity: 0.6; }
        100% { opacity: 0.3; }
    }

    .header {
        text-align: center;
        margin-bottom: 30px;
        position: relative;
    }

    .header::after {
        content: '';
        position: absolute;
        bottom: -10px;
        left: 50%;
        transform: translateX(-50%);
        width: 60px;
        height: 3px;
        background: linear-gradient(to right, #9400d3, #ff00ff);
        border-radius: 15px;
    }

    .icon {
        font-size: 24px;
        margin-bottom: 10px;
        color: #bb86fc;
    }

    .form-group {
        margin-bottom: 20px;
    }

    label {
        display: block;
        margin-bottom: 8px;
        font-weight: 500;
        color: #e0e0e0;
    }

    .input-wrapper {
        position: relative;
        display: flex;
        align-items: center;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 10px;
        padding: 0 15px;
        transition: all 0.3s ease;
    }

    .input-wrapper:hover {
        background: rgba(255, 255, 255, 0.15);
    }

    .input-wrapper:focus-within {
        background: rgba(255, 255, 255, 0.2);
        box-shadow: 0 0 15px rgba(187, 134, 252, 0.5);
    }

    .input-icon {
        color: #bb86fc;
        margin-right: 10px;
        font-size: 18px;
    }

    input, select, textarea {
        width: 100%;
        padding: 12px 10px;
        background: transparent;
        border: none;
        color: #ffffff;
        font-size: 16px;
        outline: none;
        font-family: inherit;
    }

    input::placeholder, select::placeholder, textarea::placeholder {
        color: #aaaaaa;
        opacity: 1;
    }

    .select-wrapper {
        position: relative;
    }

    .select-wrapper::after {
        content: '▼';
        position: absolute;
        right: 15px;
        top: 50%;
        transform: translateY(-50%);
        pointer-events: none;
        color: #bb86fc;
        font-size: 12px;
    }

    .checkbox-container {
        display: flex;
        align-items: center;
        margin: 20px 0;
    }

    .switch {
        position: relative;
        display: inline-block;
        width: 50px;
        height: 24px;
        margin-right: 10px;
    }

    .switch input {
        opacity: 0;
        width: 0;
        height: 0;
    }

    .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(255, 255, 255, 0.1);
        transition: .4s;
        border-radius: 24px;
    }

    .slider:before {
        position: absolute;
        content: "";
        height: 18px;
        width: 18px;
        left: 3px;
        bottom: 3px;
        background: #bb86fc;
        transition: .4s;
        border-radius: 50%;
    }

    input:checked + .slider {
        background: rgba(187, 134, 252, 0.3);
    }

    input:checked + .slider:before {
        transform: translateX(26px);
    }

    .checkbox-label {
        font-size: 14px;
        color: #e0e0e0;
    }

    .submit-btn {
        width: 100%;
        padding: 15px;
        background: linear-gradient(45deg, #9400d3, #bb86fc);
        border: none;
        border-radius: 50px;
        color: white;
        font-size: 18px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
        box-shadow: 0 4px 15px rgba(187, 134, 252, 0.3);
    }

    .submit-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(187, 134, 252, 0.4);
    }

    .submit-btn:active {
        transform: translateY(0);
    }

    .submit-btn::after {
        content: '>';
        margin-left: 10px;
        font-weight: bold;
    }

    .footer {
        margin-top: 30px;
        text-align: center;
        font-size: 12px;
        color: #aaaaaa;
        line-height: 1.5;
    }

    .footer a {
        color: #bb86fc;
        text-decoration: none;
    }

    .footer a:hover {
        text-decoration: underline;
    }

    /* Responsive design */
    @media (max-width: 480px) {
        .contact-form {
            width: 90%;
            padding: 20px;
        }
        
        .submit-btn {
            padding: 12px;
            font-size: 16px;
        }
    }
</style>