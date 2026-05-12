// ─── Состояние ───────────────────────────────────────────────────────────────
let saveTimer = null;
let dynamicSectionCount = 0;
let dynamicFieldCount = 0;

// ─── Инициализация ────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
  loadFromURL();
  setupAutosave();
  updatePreview();
  updateProgress();

  document.getElementById('client_email').addEventListener('input', function () {
    document.getElementById('_replyto').value = this.value;
  });

  document.getElementById('btnReset').addEventListener('click', resetForm);
  document.getElementById('btnSave').addEventListener('click', saveManual);
  document.getElementById('btnShare').addEventListener('click', shareForm);
});

// ─── Прогресс ─────────────────────────────────────────────────────────────────
function updateProgress() {
  const staticFields = ['park_size','max_people','slot_duration','working_hours',
    'payment','cancellation','registration','gate_equipment','pin_generation',
    'branding','language','deadline'];
  let filled = 0;
  staticFields.forEach(name => {
    const el = document.getElementById(name);
    if (el && el.value.trim()) filled++;
  });
  const total = staticFields.length;
  const pct = Math.round((filled / total) * 100);
  document.getElementById('progressFill').style.width = pct + '%';
  document.getElementById('progressText').textContent = `Заполнено: ${filled} из ${total}`;
}

// ─── Превью ───────────────────────────────────────────────────────────────────
function updatePreview() {
  const container = document.getElementById('previewContent');
  const sections = document.querySelectorAll('.section');
  let html = '';

  sections.forEach(section => {
    const title = section.querySelector('h2');
    const questions = section.querySelectorAll('.question');
    let sectionHtml = '';

    questions.forEach(q => {
      const inputs = q.querySelectorAll('textarea, input[type="text"], input[type="email"], input[type="tel"]');
      const label = q.querySelector('label, .dynamic-question-header input.field-title');
      let labelText = '';
      let mainVal = '';
      let commentVal = '';

      if (label) {
        labelText = label.tagName === 'LABEL' ? label.textContent.trim() : label.value.trim();
      }

      inputs.forEach((inp, i) => {
        const val = inp.value.trim();
        if (i === 0) mainVal = val;
        if (inp.classList.contains('comment')) commentVal = val;
      });

      if (mainVal) {
        sectionHtml += `<div class="preview-item">
          <div class="preview-item-label">${labelText}</div>
          <div class="preview-item-value">${escapeHtml(mainVal)}</div>
          ${commentVal ? `<div class="preview-item-comment">↳ ${escapeHtml(commentVal)}</div>` : ''}
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

function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ─── Автосохранение ───────────────────────────────────────────────────────────
function setupAutosave() {
  document.getElementById('questionnaireForm').addEventListener('input', function () {
    updatePreview();
    updateProgress();
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      saveToStorage();
      updateURL();
    }, 10000);
  });
}

function saveToStorage() {
  const data = collectFormData();
  localStorage.setItem('sunsetpass_form', JSON.stringify(data));
  document.getElementById('saveStatus').textContent = 'Сохранено ' + formatTime();
}

function saveManual() {
  saveToStorage();
  updateURL();
  showFlash('Сохранено!');
}

function formatTime() {
  const d = new Date();
  return d.getHours().toString().padStart(2,'0') + ':' + d.getMinutes().toString().padStart(2,'0');
}

// ─── Сбор данных формы ────────────────────────────────────────────────────────
function collectFormData() {
  const form = document.getElementById('questionnaireForm');
  const data = { fields: {}, dynamicSections: [] };

  // Статичные поля
  form.querySelectorAll('textarea[name], input[name]').forEach(el => {
    if (el.name && el.name !== '_replyto') {
      data.fields[el.name] = el.value;
    }
  });

  // Динамические секции
  form.querySelectorAll('.section.dynamic-section').forEach(sec => {
    const title = sec.querySelector('h2') ? sec.querySelector('h2').textContent.trim() : '';
    const fields = [];
    sec.querySelectorAll('.dynamic-question').forEach(q => {
      const titleInput = q.querySelector('input.field-title');
      const textarea = q.querySelector('textarea');
      fields.push({
        title: titleInput ? titleInput.value : '',
        value: textarea ? textarea.value : ''
      });
    });
    data.dynamicSections.push({ title, fields });
  });

  // Дополнительные поля в статичных секциях
  data.extraFields = [];
  form.querySelectorAll('.section:not(.dynamic-section) .dynamic-question').forEach(q => {
    const sectionId = q.closest('.section').dataset.sectionId;
    const titleInput = q.querySelector('input.field-title');
    const textarea = q.querySelector('textarea');
    data.extraFields.push({
      sectionId,
      title: titleInput ? titleInput.value : '',
      value: textarea ? textarea.value : ''
    });
  });

  return data;
}

// ─── Загрузка / URL ───────────────────────────────────────────────────────────
function updateURL() {
  const data = collectFormData();
  const json = JSON.stringify(data);
  const b64 = btoa(unescape(encodeURIComponent(json)));
  const url = new URL(window.location.href);
  url.searchParams.set('d', b64);
  window.history.replaceState(null, '', url.toString());
}

function loadFromURL() {
  const params = new URL(window.location.href).searchParams;
  const b64 = params.get('d');
  if (b64) {
    try {
      const json = decodeURIComponent(escape(atob(b64)));
      const data = JSON.parse(json);
      restoreFormData(data);
      document.getElementById('saveStatus').textContent = 'Загружено из ссылки';
      return;
    } catch (e) {}
  }
  // Попробовать localStorage
  const saved = localStorage.getItem('sunsetpass_form');
  if (saved) {
    try {
      restoreFormData(JSON.parse(saved));
      document.getElementById('saveStatus').textContent = 'Восстановлено из сохранения';
    } catch (e) {}
  }
}

function restoreFormData(data) {
  if (!data) return;
  const form = document.getElementById('questionnaireForm');

  // Статичные поля
  if (data.fields) {
    Object.entries(data.fields).forEach(([name, value]) => {
      const el = form.querySelector(`[name="${name}"]`);
      if (el) el.value = value;
    });
  }

  // Дополнительные поля в статичных секциях
  if (data.extraFields) {
    data.extraFields.forEach(item => {
      const section = form.querySelector(`.section[data-section-id="${item.sectionId}"]`);
      if (section) {
        const addBtn = section.querySelector('.add-field-btn');
        addField(addBtn, item.title, item.value);
      }
    });
  }

  // Динамические секции
  if (data.dynamicSections) {
    data.dynamicSections.forEach(sec => {
      const lastAddSectionBtn = [...form.querySelectorAll('.add-section-btn')].pop();
      if (lastAddSectionBtn) {
        const newSection = addSection(lastAddSectionBtn, sec.title);
        if (newSection && sec.fields) {
          sec.fields.forEach(field => {
            const addBtn = newSection.querySelector('.add-field-btn');
            addField(addBtn, field.title, field.value);
          });
        }
      }
    });
  }

  updatePreview();
  updateProgress();
}

// ─── Поделиться ───────────────────────────────────────────────────────────────
function shareForm() {
  saveToStorage();
  updateURL();
  const url = window.location.href;

  if (navigator.share) {
    navigator.share({ title: 'Sunset Pass — Опросник', url }).catch(() => copyToClipboard(url));
  } else {
    copyToClipboard(url);
  }
}

function copyToClipboard(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => showFlash('Ссылка скопирована!')).catch(() => fallbackCopy(text));
  } else {
    fallbackCopy(text);
  }
}

function fallbackCopy(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  document.execCommand('copy');
  document.body.removeChild(ta);
  showFlash('Ссылка скопирована!');
}

// ─── Заново ───────────────────────────────────────────────────────────────────
function resetForm() {
  if (!confirm('Очистить всю форму? Это действие нельзя отменить.')) return;

  const form = document.getElementById('questionnaireForm');

  // Очистить статичные поля
  form.querySelectorAll('textarea, input[type="text"], input[type="email"], input[type="tel"]').forEach(el => {
    el.value = '';
  });

  // Удалить динамические поля
  form.querySelectorAll('.dynamic-question').forEach(el => el.remove());

  // Удалить динамические секции
  form.querySelectorAll('.section.dynamic-section').forEach(el => el.remove());
  // Удалить add-section-btn дублей (оставить только оригинальные)
  const allAddBtns = form.querySelectorAll('.add-section-btn');
  allAddBtns.forEach((btn, i) => { if (i >= 6) btn.remove(); });

  localStorage.removeItem('sunsetpass_form');
  const url = new URL(window.location.href);
  url.searchParams.delete('d');
  window.history.replaceState(null, '', url.toString());

  document.getElementById('saveStatus').textContent = '';
  updatePreview();
  updateProgress();
  showFlash('Форма очищена');
}

// ─── Flash ────────────────────────────────────────────────────────────────────
function showFlash(msg) {
  const el = document.getElementById('flash');
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2500);
}

// ─── Добавить поле ────────────────────────────────────────────────────────────
function addField(btn, titleVal, textVal) {
  dynamicFieldCount++;
  const id = 'dyn_field_' + dynamicFieldCount;
  const div = document.createElement('div');
  div.className = 'dynamic-question';
  div.innerHTML = `
    <div class="dynamic-question-header">
      <input class="field-title" type="text" placeholder="Название поля..." value="${escapeAttr(titleVal || '')}">
      <button type="button" class="remove-btn" onclick="this.closest('.dynamic-question').remove(); updatePreview(); updateProgress();" title="Удалить поле">×</button>
    </div>
    <textarea id="${id}" name="${id}" placeholder="Ответ...">${escapeAttr(textVal || '')}</textarea>
  `;
  btn.parentNode.insertBefore(div, btn);

  div.querySelector('input.field-title').addEventListener('input', updatePreview);
  div.querySelector('textarea').addEventListener('input', updatePreview);

  return div;
}

// ─── Добавить раздел ──────────────────────────────────────────────────────────
function addSection(btn, titleVal) {
  dynamicSectionCount++;
  const section = document.createElement('section');
  section.className = 'section dynamic-section';
  section.dataset.sectionId = 'dyn_' + dynamicSectionCount;
  section.innerHTML = `
    <div class="section-header" style="display:flex;align-items:center;gap:8px;">
      <h2 contenteditable="true" style="flex:1;outline:none;border-bottom:2px solid #2d6a4f;padding-bottom:4px;" placeholder="Название раздела...">${escapeAttr(titleVal || '')}</h2>
      <button type="button" class="remove-btn" onclick="this.closest('.section').nextElementSibling?.classList.contains('add-section-btn') && this.closest('.section').nextElementSibling.remove(); this.closest('.section').remove(); updatePreview();" title="Удалить раздел">×</button>
    </div>
    <button type="button" class="add-field-btn" onclick="addField(this)">+ Добавить поле</button>
  `;

  section.querySelector('h2').addEventListener('input', updatePreview);

  // Вставить перед кнопкой добавления раздела
  btn.parentNode.insertBefore(section, btn);

  // Добавить новую кнопку добавления раздела после секции
  const newBtn = document.createElement('button');
  newBtn.type = 'button';
  newBtn.className = 'add-section-btn';
  newBtn.textContent = '+ Добавить раздел';
  newBtn.onclick = function() { addSection(this); };
  section.parentNode.insertBefore(newBtn, btn);

  return section;
}

// ─── Модальное окно ──────────────────────────────────────────────────────────
function openModal() {
  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

function closeModalOutside(e) {
  if (e.target === document.getElementById('modalOverlay')) closeModal();
}

document.addEventListener('DOMContentLoaded', function () {
  const generalForm = document.getElementById('generalForm');
  if (generalForm) {
    generalForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      const btn = document.getElementById('generalSubmitBtn');
      btn.disabled = true;
      btn.textContent = 'Отправляем...';

      // Синхронизировать _replyto
      const emailVal = document.getElementById('g_email').value;
      document.getElementById('general_replyto').value = emailVal;

      try {
        const formData = new FormData(generalForm);
        const res = await fetch(generalForm.action, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });
        if (res.ok) {
          generalForm.style.display = 'none';
          document.getElementById('modalSuccess').style.display = 'block';
        } else {
          throw new Error('Ошибка сервера');
        }
      } catch (err) {
        btn.disabled = false;
        btn.textContent = 'Отправить обращение';
        showFlash('Ошибка отправки. Попробуйте ещё раз.');
      }
    });
  }

  // Закрыть по Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });
});

function escapeAttr(str) {
  return str.replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
