// ─── Поля прогресса ───────────────────────────────────────────────────────────
const TRACKED_FIELDS = [
  'gate_type','gate_electricity','gate_internet','gate_camera',
  'payment_provider','price_per_hour','price_tiers','invoice',
  'closing_time','advance_booking',
  'pin_delivery','time_warning','park_signal',
  'admin_view','block_dates','support_phone',
  'product_choice'
];

// ─── Инициализация ────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
  updateProgress();
  updatePreview();

  document.getElementById('client_email').addEventListener('input', function () {
    document.getElementById('_replyto').value = this.value;
  });
  document.getElementById('_replyto').value = document.getElementById('client_email').value;

  document.getElementById('questionnaireForm').addEventListener('input', function () {
    updateProgress();
    updatePreview();
  });

  document.getElementById('questionnaireForm').addEventListener('submit', function () {
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

  document.getElementById('btnSave').addEventListener('click', function () {
    showFlash('Сохранено!');
  });
});

// ─── Прогресс ─────────────────────────────────────────────────────────────────
function updateProgress() {
  let filled = 0;
  TRACKED_FIELDS.forEach(name => {
    const el = document.getElementById(name);
    if (el && el.value.trim()) filled++;
  });
  const total = TRACKED_FIELDS.length;
  const pct = Math.round((filled / total) * 100);
  document.getElementById('progressFill').style.width = pct + '%';
  document.getElementById('progressText').textContent = `Заполнено: ${filled} из ${total}`;
}

// ─── Предпросмотр ─────────────────────────────────────────────────────────────
function updatePreview() {
  const container = document.getElementById('previewContent');
  const sections = document.querySelectorAll('.section');
  let html = '';

  sections.forEach(section => {
    const title = section.querySelector('h2');
    const questions = section.querySelectorAll('.question');
    let sectionHtml = '';

    questions.forEach(q => {
      const input = q.querySelector('textarea, input[type="text"], input[type="email"], input[type="tel"]');
      const label = q.querySelector('label');
      if (!input || !label) return;
      const val = input.value.trim();
      if (val) {
        sectionHtml += `<div class="preview-item">
          <div class="preview-item-label">${label.textContent.trim()}</div>
          <div class="preview-item-value">${escapeHtml(val)}</div>
        </div>`;
      }
    });

    if (sectionHtml && title) {
      html += `<div class="preview-section">
        <div class="preview-section-title">${title.textContent.trim()}</div>
        ${sectionHtml}
      </div>`;
    }
  });

  container.innerHTML = html || '<p class="preview-empty">Начните заполнять форму — здесь появится предпросмотр</p>';
}

// ─── Flash ────────────────────────────────────────────────────────────────────
function showFlash(msg) {
  const el = document.getElementById('flash');
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2500);
}

function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
