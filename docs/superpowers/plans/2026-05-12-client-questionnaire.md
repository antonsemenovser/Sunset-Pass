# Client Questionnaire Form — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Создать веб-форму на русском языке с 12 вопросами для сбора требований от клиента парка, с отправкой ответов в Airtable и на email.

**Architecture:** Статичная HTML страница с vanilla JS. При отправке JS делает два запроса: POST в Airtable API (сохранить запись) и POST в EmailJS (отправить письмо). Хостинг на Netlify через GitHub.

**Tech Stack:** HTML5, CSS3, Vanilla JS, Airtable API, EmailJS, Netlify

---

## Структура файлов

```
C:\pro\Sunset Pass\
├── index.html          # Главная страница с формой
├── style.css           # Стили
├── script.js           # Логика отправки (Airtable + EmailJS)
├── success.html        # Страница после успешной отправки
└── .env.example        # Пример переменных (ключи API)
```

---

### Task 1: HTML структура формы

**Files:**
- Create: `C:\pro\Sunset Pass\index.html`

- [ ] **Step 1: Создать index.html с формой**

```html
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sunset Pass — Опросник</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="container">
    <header>
      <h1>Sunset Pass</h1>
      <p class="subtitle">Опросник для разработки системы бронирования парка</p>
      <div class="progress-bar">
        <div class="progress-fill" id="progressFill"></div>
      </div>
      <p class="progress-text" id="progressText">Вопрос 1 из 12</p>
    </header>

    <form id="questionnaireForm">

      <!-- О парке -->
      <section class="section">
        <h2>О парке</h2>

        <div class="question" data-index="1">
          <label>1. Какой размер парка? (площадь, примерно)</label>
          <textarea name="park_size" placeholder="Например: 2000 кв.м, примерно 50x40 метров"></textarea>
          <textarea name="park_size_comment" class="comment" placeholder="Комментарий (необязательно)"></textarea>
        </div>

        <div class="question" data-index="2">
          <label>2. Сколько человек максимум могут быть в парке одновременно?</label>
          <textarea name="max_people" placeholder="Например: 5 человек с собаками"></textarea>
          <textarea name="max_people_comment" class="comment" placeholder="Комментарий (необязательно)"></textarea>
        </div>

        <div class="question" data-index="3">
          <label>3. Какова минимальная и максимальная длительность одного слота?</label>
          <textarea name="slot_duration" placeholder="Например: минимум 30 минут, максимум 2 часа"></textarea>
          <textarea name="slot_duration_comment" class="comment" placeholder="Комментарий (необязательно)"></textarea>
        </div>

        <div class="question" data-index="4">
          <label>4. Часы работы парка (по дням недели)?</label>
          <textarea name="working_hours" placeholder="Например: пн-пт 8:00-20:00, сб-вс 9:00-21:00"></textarea>
          <textarea name="working_hours_comment" class="comment" placeholder="Комментарий (необязательно)"></textarea>
        </div>
      </section>

      <!-- О бронировании -->
      <section class="section">
        <h2>О бронировании</h2>

        <div class="question" data-index="5">
          <label>5. Как вы хотите принимать оплату?</label>
          <textarea name="payment" placeholder="Например: онлайн картой, наличными на месте, выставлять счёт"></textarea>
          <textarea name="payment_comment" class="comment" placeholder="Комментарий (необязательно)"></textarea>
        </div>

        <div class="question" data-index="6">
          <label>6. Нужна ли возможность отмены бронирования? За сколько часов до начала?</label>
          <textarea name="cancellation" placeholder="Например: да, за 24 часа до начала / нет, отмена невозможна"></textarea>
          <textarea name="cancellation_comment" class="comment" placeholder="Комментарий (необязательно)"></textarea>
        </div>

        <div class="question" data-index="7">
          <label>7. Нужна ли регистрация пользователя или достаточно имя + email?</label>
          <textarea name="registration" placeholder="Например: достаточно имени и email / нужна полная регистрация с паролем"></textarea>
          <textarea name="registration_comment" class="comment" placeholder="Комментарий (необязательно)"></textarea>
        </div>
      </section>

      <!-- О воротах -->
      <section class="section">
        <h2>О воротах</h2>

        <div class="question" data-index="8">
          <label>8. Какое оборудование уже есть на воротах или нужно закупить?</label>
          <textarea name="gate_equipment" placeholder="Например: уже есть электронный замок марки X / нужно закупить всё с нуля"></textarea>
          <textarea name="gate_equipment_comment" class="comment" placeholder="Комментарий (необязательно)"></textarea>
        </div>

        <div class="question" data-index="9">
          <label>9. PIN-код — кто его генерирует: вы вручную или система автоматически?</label>
          <textarea name="pin_generation" placeholder="Например: система должна генерировать автоматически после оплаты"></textarea>
          <textarea name="pin_generation_comment" class="comment" placeholder="Комментарий (необязательно)"></textarea>
        </div>
      </section>

      <!-- О дизайне -->
      <section class="section">
        <h2>О дизайне и языке</h2>

        <div class="question" data-index="10">
          <label>10. Есть ли логотип, фирменные цвета, название парка?</label>
          <textarea name="branding" placeholder="Например: название 'Koira Park', цвета зелёный и белый, логотип есть (могу прислать)"></textarea>
          <textarea name="branding_comment" class="comment" placeholder="Комментарий (необязательно)"></textarea>
        </div>

        <div class="question" data-index="11">
          <label>11. На каком языке должен быть сайт/приложение?</label>
          <textarea name="language" placeholder="Например: только финский / финский + английский / финский + русский"></textarea>
          <textarea name="language_comment" class="comment" placeholder="Комментарий (необязательно)"></textarea>
        </div>
      </section>

      <!-- О сроках -->
      <section class="section">
        <h2>О сроках</h2>

        <div class="question" data-index="12">
          <label>12. Когда нужен готовый продукт?</label>
          <textarea name="deadline" placeholder="Например: через 2 месяца / к лету 2026 / как можно скорее"></textarea>
          <textarea name="deadline_comment" class="comment" placeholder="Комментарий (необязательно)"></textarea>
        </div>
      </section>

      <!-- Контактные данные -->
      <section class="section">
        <h2>Ваши контактные данные</h2>
        <div class="question">
          <label>Имя</label>
          <input type="text" name="client_name" required placeholder="Ваше имя">
        </div>
        <div class="question">
          <label>Email</label>
          <input type="email" name="client_email" required placeholder="ваш@email.com">
        </div>
        <div class="question">
          <label>Телефон (необязательно)</label>
          <input type="tel" name="client_phone" placeholder="+358 XX XXX XXXX">
        </div>
      </section>

      <button type="submit" id="submitBtn">Отправить ответы</button>
      <p class="submit-note">После отправки мы свяжемся с вами в течение 1-2 рабочих дней.</p>

    </form>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
  <script src="script.js"></script>
</body>
</html>
```

- [ ] **Step 2: Проверить в браузере — форма отображается**

Открыть `index.html` в браузере (двойной клик по файлу).
Ожидание: видны все 12 вопросов, поля для ввода работают.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add questionnaire HTML structure with 12 questions"
```

---

### Task 2: CSS стили

**Files:**
- Create: `C:\pro\Sunset Pass\style.css`

- [ ] **Step 1: Создать style.css**

```css
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #f8f9fa;
  color: #1a1a1a;
  line-height: 1.6;
}

.container {
  max-width: 720px;
  margin: 0 auto;
  padding: 40px 20px 80px;
}

header {
  text-align: center;
  margin-bottom: 48px;
}

h1 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 8px;
  color: #1a1a1a;
}

.subtitle {
  color: #666;
  font-size: 1rem;
  margin-bottom: 24px;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: #e0e0e0;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background: #2d6a4f;
  border-radius: 3px;
  transition: width 0.3s ease;
  width: 0%;
}

.progress-text {
  font-size: 0.85rem;
  color: #888;
}

.section {
  background: #fff;
  border-radius: 12px;
  padding: 32px;
  margin-bottom: 24px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
}

.section h2 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d6a4f;
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 2px solid #e8f5e9;
}

.question {
  margin-bottom: 28px;
}

.question:last-child {
  margin-bottom: 0;
}

label {
  display: block;
  font-weight: 500;
  margin-bottom: 8px;
  font-size: 0.95rem;
}

textarea, input[type="text"], input[type="email"], input[type="tel"] {
  width: 100%;
  padding: 12px 14px;
  border: 1.5px solid #ddd;
  border-radius: 8px;
  font-size: 0.95rem;
  font-family: inherit;
  color: #1a1a1a;
  background: #fafafa;
  transition: border-color 0.2s;
  resize: vertical;
}

textarea {
  min-height: 80px;
}

textarea:focus, input:focus {
  outline: none;
  border-color: #2d6a4f;
  background: #fff;
}

textarea.comment {
  min-height: 50px;
  margin-top: 8px;
  font-size: 0.88rem;
  color: #555;
  background: #f5f5f5;
}

textarea.comment::placeholder {
  color: #aaa;
  font-style: italic;
}

button[type="submit"] {
  display: block;
  width: 100%;
  padding: 16px;
  background: #2d6a4f;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
  margin-top: 32px;
}

button[type="submit"]:hover {
  background: #1b4332;
}

button[type="submit"]:active {
  transform: scale(0.99);
}

button[type="submit"]:disabled {
  background: #aaa;
  cursor: not-allowed;
}

.submit-note {
  text-align: center;
  color: #888;
  font-size: 0.85rem;
  margin-top: 12px;
}

.error-message {
  background: #fff3f3;
  border: 1px solid #f5c6cb;
  color: #721c24;
  padding: 12px 16px;
  border-radius: 8px;
  margin-top: 16px;
  font-size: 0.9rem;
  display: none;
}

@media (max-width: 600px) {
  .container {
    padding: 24px 16px 60px;
  }

  .section {
    padding: 20px;
  }

  h1 {
    font-size: 1.5rem;
  }
}
```

- [ ] **Step 2: Проверить в браузере — форма выглядит аккуратно**

Обновить `index.html` в браузере.
Ожидание: белые карточки с секциями, зелёный акцент, прогресс-бар вверху.

- [ ] **Step 3: Commit**

```bash
git add style.css
git commit -m "feat: add questionnaire styles"
```

---

### Task 3: Страница успеха

**Files:**
- Create: `C:\pro\Sunset Pass\success.html`

- [ ] **Step 1: Создать success.html**

```html
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sunset Pass — Спасибо!</title>
  <link rel="stylesheet" href="style.css">
  <style>
    .success-container {
      text-align: center;
      padding: 80px 20px;
    }
    .checkmark {
      font-size: 4rem;
      margin-bottom: 24px;
    }
    .success-container h2 {
      font-size: 1.8rem;
      margin-bottom: 16px;
      color: #1a1a1a;
    }
    .success-container p {
      color: #666;
      font-size: 1rem;
      max-width: 400px;
      margin: 0 auto;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="success-container">
      <div class="checkmark">✅</div>
      <h2>Спасибо! Ответы получены.</h2>
      <p>Мы свяжемся с вами в течение 1-2 рабочих дней для обсуждения деталей проекта.</p>
    </div>
  </div>
</body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add success.html
git commit -m "feat: add success page"
```

---

### Task 4: Настройка Airtable

- [ ] **Step 1: Создать аккаунт Airtable**

Зайти на airtable.com → Sign up (бесплатно).

- [ ] **Step 2: Создать новую Base**

Нажать "Add a base" → "Start from scratch" → назвать "Sunset Pass Questionnaire".

- [ ] **Step 3: Создать таблицу с полями**

Переименовать таблицу в "Responses". Добавить поля (тип: Long text для всех textarea, Single line text для имени/email/телефона):

| Имя поля | Тип |
|---|---|
| client_name | Single line text |
| client_email | Email |
| client_phone | Single line text |
| park_size | Long text |
| park_size_comment | Long text |
| max_people | Long text |
| max_people_comment | Long text |
| slot_duration | Long text |
| slot_duration_comment | Long text |
| working_hours | Long text |
| working_hours_comment | Long text |
| payment | Long text |
| payment_comment | Long text |
| cancellation | Long text |
| cancellation_comment | Long text |
| registration | Long text |
| registration_comment | Long text |
| gate_equipment | Long text |
| gate_equipment_comment | Long text |
| pin_generation | Long text |
| pin_generation_comment | Long text |
| branding | Long text |
| branding_comment | Long text |
| language | Long text |
| language_comment | Long text |
| deadline | Long text |
| deadline_comment | Long text |

- [ ] **Step 4: Получить API ключ и Base ID**

1. Зайти на airtable.com/create/tokens → "Create new token"
2. Дать название "sunset-pass", scope: `data.records:write`, выбрать свою Base
3. Скопировать токен (показывается только раз!) → сохранить

Base ID найти: открыть Base → Help → API documentation → в URL будет `appXXXXXXXXXXXXXX`

- [ ] **Step 5: Создать .env.example**

```bash
# Airtable
AIRTABLE_TOKEN=patXXXXXXXXXXXXXX
AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
AIRTABLE_TABLE_NAME=Responses

# EmailJS
EMAILJS_SERVICE_ID=service_XXXXXXX
EMAILJS_TEMPLATE_ID=template_XXXXXXX
EMAILJS_PUBLIC_KEY=XXXXXXXXXXXXXXXX
```

```bash
git add .env.example
git commit -m "docs: add .env.example with required API keys"
```

---

### Task 5: Настройка EmailJS

- [ ] **Step 1: Создать аккаунт EmailJS**

Зайти на emailjs.com → Sign up (бесплатно, 200 писем/месяц).

- [ ] **Step 2: Добавить Email Service**

Dashboard → Email Services → Add New Service → выбрать Gmail → Connect Account → войти через `anton.semenov.ser@gmail.com`.
Скопировать **Service ID** (вида `service_XXXXXXX`).

- [ ] **Step 3: Создать Email Template**

Dashboard → Email Templates → Create New Template.

Subject: `Новый ответ на опросник Sunset Pass от {{client_name}}`

Body:
```
Новый ответ на опросник Sunset Pass

Клиент: {{client_name}}
Email: {{client_email}}
Телефон: {{client_phone}}

--- О ПАРКЕ ---
1. Размер парка: {{park_size}}
   Комментарий: {{park_size_comment}}

2. Макс. людей: {{max_people}}
   Комментарий: {{max_people_comment}}

3. Длительность слота: {{slot_duration}}
   Комментарий: {{slot_duration_comment}}

4. Часы работы: {{working_hours}}
   Комментарий: {{working_hours_comment}}

--- О БРОНИРОВАНИИ ---
5. Оплата: {{payment}}
   Комментарий: {{payment_comment}}

6. Отмена: {{cancellation}}
   Комментарий: {{cancellation_comment}}

7. Регистрация: {{registration}}
   Комментарий: {{registration_comment}}

--- О ВОРОТАХ ---
8. Оборудование: {{gate_equipment}}
   Комментарий: {{gate_equipment_comment}}

9. PIN генерация: {{pin_generation}}
   Комментарий: {{pin_generation_comment}}

--- О ДИЗАЙНЕ ---
10. Брендинг: {{branding}}
    Комментарий: {{branding_comment}}

11. Язык: {{language}}
    Комментарий: {{language_comment}}

--- О СРОКАХ ---
12. Дедлайн: {{deadline}}
    Комментарий: {{deadline_comment}}
```

To email: `anton.semenov.ser@gmail.com`

Скопировать **Template ID** (вида `template_XXXXXXX`).

- [ ] **Step 4: Получить Public Key**

Dashboard → Account → General → скопировать **Public Key**.

---

### Task 6: JavaScript логика отправки

**Files:**
- Create: `C:\pro\Sunset Pass\script.js`

- [ ] **Step 1: Создать script.js**

Заменить `YOUR_AIRTABLE_TOKEN`, `YOUR_BASE_ID`, `YOUR_EMAILJS_PUBLIC_KEY`, `YOUR_SERVICE_ID`, `YOUR_TEMPLATE_ID` на реальные значения из Task 4 и Task 5.

```javascript
// Конфигурация — заменить на реальные ключи
const CONFIG = {
  airtable: {
    token: 'YOUR_AIRTABLE_TOKEN',
    baseId: 'YOUR_BASE_ID',
    tableName: 'Responses'
  },
  emailjs: {
    publicKey: 'YOUR_EMAILJS_PUBLIC_KEY',
    serviceId: 'YOUR_SERVICE_ID',
    templateId: 'YOUR_TEMPLATE_ID'
  }
};

// Инициализация EmailJS
emailjs.init(CONFIG.emailjs.publicKey);

// Прогресс-бар: обновляется при фокусе на вопросах
const questions = document.querySelectorAll('.question[data-index]');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const total = 12;

function updateProgress(index) {
  const pct = Math.round((index / total) * 100);
  progressFill.style.width = pct + '%';
  progressText.textContent = `Вопрос ${index} из ${total}`;
}

questions.forEach(q => {
  const textarea = q.querySelector('textarea:not(.comment)');
  if (textarea) {
    textarea.addEventListener('focus', () => {
      updateProgress(parseInt(q.dataset.index));
    });
  }
});

// Отправка формы
document.getElementById('questionnaireForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const btn = document.getElementById('submitBtn');
  btn.disabled = true;
  btn.textContent = 'Отправляем...';

  const form = e.target;
  const data = {};
  const inputs = form.querySelectorAll('textarea, input');
  inputs.forEach(input => {
    if (input.name) data[input.name] = input.value.trim();
  });

  try {
    // 1. Сохранить в Airtable
    const airtableRes = await fetch(
      `https://api.airtable.com/v0/${CONFIG.airtable.baseId}/${encodeURIComponent(CONFIG.airtable.tableName)}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${CONFIG.airtable.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fields: data })
      }
    );

    if (!airtableRes.ok) {
      const err = await airtableRes.json();
      throw new Error('Airtable: ' + (err.error?.message || airtableRes.status));
    }

    // 2. Отправить email через EmailJS
    await emailjs.send(
      CONFIG.emailjs.serviceId,
      CONFIG.emailjs.templateId,
      data
    );

    // 3. Перенаправить на страницу успеха
    window.location.href = 'success.html';

  } catch (err) {
    console.error(err);
    btn.disabled = false;
    btn.textContent = 'Отправить ответы';
    alert('Ошибка при отправке: ' + err.message + '\n\nПопробуйте ещё раз или напишите нам напрямую.');
  }
});
```

- [ ] **Step 2: Вставить реальные ключи в CONFIG**

Открыть `script.js` и заменить:
- `YOUR_AIRTABLE_TOKEN` → токен из Task 4 Step 4
- `YOUR_BASE_ID` → Base ID из Task 4 Step 4
- `YOUR_EMAILJS_PUBLIC_KEY` → Public Key из Task 5 Step 4
- `YOUR_SERVICE_ID` → Service ID из Task 5 Step 2
- `YOUR_TEMPLATE_ID` → Template ID из Task 5 Step 3

- [ ] **Step 3: Проверить в браузере — заполнить форму и отправить**

Открыть `index.html` → заполнить все поля → нажать "Отправить".
Ожидание:
- Редирект на `success.html`
- В Airtable появилась новая запись
- На `anton.semenov.ser@gmail.com` пришло письмо

- [ ] **Step 4: Commit**

```bash
git add script.js
git commit -m "feat: add form submission logic (Airtable + EmailJS)"
```

---

### Task 7: Деплой на Netlify

- [ ] **Step 1: Создать .gitignore**

```
# Если будешь хранить реальные ключи в отдельном файле
.env
*.local
```

```bash
git add .gitignore
git commit -m "chore: add gitignore"
```

- [ ] **Step 2: Создать репозиторий на GitHub**

Зайти на github.com → New repository → назвать `sunset-pass-questionnaire` → Public → Create.

```bash
git remote add origin https://github.com/ТВО_ИМЯ/sunset-pass-questionnaire.git
git branch -M main
git push -u origin main
```

- [ ] **Step 3: Деплой на Netlify**

Зайти на netlify.com → Sign up → "Import from Git" → выбрать GitHub → выбрать репозиторий `sunset-pass-questionnaire` → Deploy site.

Через 1-2 минуты Netlify даст ссылку вида `https://random-name.netlify.app` — это и есть ссылка для клиента.

- [ ] **Step 4: Финальная проверка**

Открыть ссылку Netlify в браузере → заполнить форму → отправить.
Ожидание: всё работает так же как локально.

- [ ] **Step 5: Commit финального состояния**

```bash
git add .
git commit -m "chore: final state before sending to client"
git push
```
