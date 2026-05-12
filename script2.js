const TOTAL = 24;

document.addEventListener('DOMContentLoaded', function () {
  // Добавить поле комментария под каждый вопрос
  document.querySelectorAll('.question[data-index]').forEach(q => {
    const name = (q.querySelector('[name]') || {}).name || '';
    const ta = document.createElement('textarea');
    ta.className = 'question-comment';
    ta.name = name + '_comment';
    ta.placeholder = 'Свой комментарий или уточнение (необязательно)...';
    q.appendChild(ta);
  });

  updateProgress();

  document.getElementById('client_email').addEventListener('input', function () {
    document.getElementById('_replyto').value = this.value;
  });
  document.getElementById('_replyto').value = document.getElementById('client_email').value;

  document.getElementById('questionnaireForm').addEventListener('change', function () {
    updateProgress();
    updatePreview();
    handleConditionals();
  });

  document.getElementById('questionnaireForm').addEventListener('input', function () {
    updateProgress();
    updatePreview();
  });

  document.getElementById('questionnaireForm').addEventListener('submit', function (e) {
    // Собрать чекбоксы в одно скрытое поле
    const checked = [...document.querySelectorAll('input[name="admin_features"]:checked')].map(el => el.value);
    let hidden = document.getElementById('admin_features_combined');
    if (!hidden) {
      hidden = document.createElement('input');
      hidden.type = 'hidden';
      hidden.id = 'admin_features_combined';
      hidden.name = 'admin_features_combined';
      document.getElementById('questionnaireForm').appendChild(hidden);
    }
    hidden.value = checked.join(', ');

    const now = new Date();
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const offsetMin = -now.getTimezoneOffset();
    const offsetSign = offsetMin >= 0 ? '+' : '-';
    const offsetHours = String(Math.floor(Math.abs(offsetMin) / 60)).padStart(2, '0');
    const offsetMins = String(Math.abs(offsetMin) % 60).padStart(2, '0');
    document.getElementById('sender_time').value =
      now.toLocaleString('ru-RU', { hour12: false }) +
      ` (UTC${offsetSign}${offsetHours}:${offsetMins}, ${tz})`;
    document.getElementById('sender_timezone').value = tz;
    document.getElementById('anton_time').value =
      now.toLocaleString('ru-RU', {
        timeZone: 'Europe/Helsinki', hour12: false,
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
      }) + ' (UTC+3, Финляндия)';
  }, true);

  handleConditionals();
});

function handleConditionals() {
  // Показать поле "свой вариант" для радио с value="other"/"limited"
  const conditionals = [
    { radio: 'price_per_hour', value: 'other', inputId: 'price_other' },
    { radio: 'lock_system', value: 'other', inputId: 'lock_other' },
    { radio: 'design_style', value: 'other', inputId: 'design_other' },
    { radio: 'multi_hour', value: 'limited', inputId: 'multi_hour_limit' },
  ];

  conditionals.forEach(({ radio, value, inputId }) => {
    const selected = document.querySelector(`input[name="${radio}"]:checked`);
    const input = document.getElementById(inputId);
    if (!input) return;
    if (selected && selected.value === value) {
      input.classList.add('visible');
    } else {
      input.classList.remove('visible');
    }
  });
}

function updateProgress() {
  const radioGroups = [
    'slot_type','multi_hour','calendar_view','advance_booking','self_cancel',
    'price_per_hour','price_tiers','refund_policy','invoice',
    'lock_system','pin_length','pin_delivery',
    'booking_confirm','reminder_before','time_warning','admin_notify',
    'client_history',
    'product_format','language',
    'logo','design_style',
    'terms','privacy'
  ];

  let filled = 0;

  // Радио (23 группы)
  radioGroups.forEach(name => {
    if (document.querySelector(`input[name="${name}"]:checked`)) filled++;
  });

  // Чекбокс (1 группа)
  if (document.querySelector('input[name="admin_features"]:checked')) filled++;

  const pct = Math.round((filled / TOTAL) * 100);
  document.getElementById('progressFill').style.width = pct + '%';
  document.getElementById('progressText').textContent = `Заполнено: ${filled} из ${TOTAL}`;
}

function updatePreview() {
  const container = document.getElementById('previewContent');
  const labels = {
    slot_type: 'Тип слотов',
    multi_hour: 'Несколько часов подряд',
    calendar_view: 'Вид календаря',
    advance_booking: 'Бронирование вперёд',
    self_cancel: 'Самостоятельная отмена',
    price_per_hour: 'Цена за час',
    price_tiers: 'Тарифы',
    refund_policy: 'Возврат при отмене',
    invoice: 'Счёт-фактура',
    lock_system: 'Система замка',
    pin_length: 'Длина PIN',
    pin_delivery: 'Доставка PIN',
    booking_confirm: 'Подтверждение бронирования',
    reminder_before: 'Напоминание перед слотом',
    time_warning: 'Предупреждение о конце',
    admin_notify: 'Уведомления для вас',
    client_history: 'История клиентов',
    product_format: 'Формат приложения',
    language: 'Язык',
    logo: 'Логотип',
    design_style: 'Стиль дизайна',
    terms: 'Правила пользования',
    privacy: 'Политика конфиденциальности',
  };

  let html = '';

  Object.entries(labels).forEach(([name, label]) => {
    const checked = document.querySelector(`input[name="${name}"]:checked`);
    if (checked) {
      const spanText = checked.closest('label').querySelector('span')?.textContent || checked.value;
      html += `<div class="preview-item">
        <div class="preview-item-label">${label}</div>
        <div class="preview-item-value">${escapeHtml(spanText)}</div>
      </div>`;
    }
  });

  // Чекбоксы
  const checkedBoxes = [...document.querySelectorAll('input[name="admin_features"]:checked')];
  if (checkedBoxes.length > 0) {
    const vals = checkedBoxes.map(el => el.closest('label').querySelector('span')?.textContent || el.value).join(', ');
    html += `<div class="preview-item">
      <div class="preview-item-label">Панель управления</div>
      <div class="preview-item-value">${escapeHtml(vals)}</div>
    </div>`;
  }

  container.innerHTML = html || '<p class="preview-empty">Начните заполнять форму — здесь появится предпросмотр</p>';
}

function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function showFlash(msg) {
  const el = document.getElementById('flash');
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2500);
}
