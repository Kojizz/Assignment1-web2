// Advanced client-side logic: unit toggle, AJAX POST to /api/calculate-bmi, dynamic results and history
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('bmi-form');
  const weightEl = document.getElementById('weight');
  const heightEl = document.getElementById('height');
  const resultPanel = document.getElementById('result');
  const bmiValueEl = document.getElementById('bmi-value');
  const bmiCategoryEl = document.getElementById('bmi-category');
  const bmiMessageEl = document.getElementById('bmi-message');
  const detailWeightEl = document.getElementById('detail-weight');
  const detailHeightEl = document.getElementById('detail-height');
  const historyList = document.getElementById('history-list');
  const calculateBtn = document.getElementById('calculate');
  const resetBtn = document.getElementById('reset');
  const againBtn = document.getElementById('again');

  if (!form) return;

  // Helper: read selected unit
  function getUnits() {
    const r = document.querySelector('input[name="units"]:checked');
    return r ? r.value : 'metric';
  }

  // Update placeholders when unit changes
  document.querySelectorAll('input[name="units"]').forEach(r => {
    r.addEventListener('change', () => {
      const units = getUnits();
      if (units === 'metric') {
        weightEl.placeholder = 'e.g. 70';
        heightEl.placeholder = 'e.g. 1.75';
        document.getElementById('weight-help').textContent = 'kg (metric) or lb (imperial)';
        document.getElementById('height-help').textContent = 'meters (metric) or inches (imperial)';
      } else {
        weightEl.placeholder = 'e.g. 154 (lb)';
        heightEl.placeholder = 'e.g. 69 (in)';
        document.getElementById('weight-help').textContent = 'lb (imperial) or kg (metric)';
        document.getElementById('height-help').textContent = 'inches (imperial) or meters (metric)';
      }
    });
  });

  // Simple message map
  function messageForCategory(cat) {
    switch (cat) {
      case 'Underweight': return 'You are underweight. Consider consulting a healthcare provider for guidance.';
      case 'Normal Weight': return 'Great — your BMI is within the normal range. Keep up a healthy lifestyle!';
      case 'Overweight': return 'You are overweight. Regular activity and a balanced diet may help.';
      case 'Obese': return 'Your BMI is in the obese range. Please consult a healthcare professional.';
      default: return '';
    }
  }

  // Render history
  function renderHistory() {
    const raw = localStorage.getItem('bmi_history');
    const arr = raw ? JSON.parse(raw) : [];
    historyList.innerHTML = '';
    arr.slice().reverse().forEach(item => {
      const li = document.createElement('li');
      li.className = 'history-item';
      li.textContent = `${item.bmi} — ${item.category} (${new Date(item.t).toLocaleString()})`;
      historyList.appendChild(li);
    });
  }

  function pushHistory(entry) {
    const raw = localStorage.getItem('bmi_history');
    const arr = raw ? JSON.parse(raw) : [];
    arr.push(entry);
    // keep last 10
    const trimmed = arr.slice(-10);
    localStorage.setItem('bmi_history', JSON.stringify(trimmed));
    renderHistory();
  }

  renderHistory();

  // Main submit handler uses AJAX to /api/calculate-bmi
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const units = getUnits();
    let weight = parseFloat(weightEl.value);
    let height = parseFloat(heightEl.value);

    if (isNaN(weight) || weight <= 0) { alert('⚠️ Please enter a valid positive weight!'); weightEl.focus(); return; }
    if (isNaN(height) || height <= 0) { alert('⚠️ Please enter a valid positive height!'); heightEl.focus(); return; }

    // Convert imperial to metric if necessary
    let sendWeight = weight; // kg
    let sendHeight = height; // m
    if (units === 'imperial') {
      sendWeight = weight * 0.45359237; // lb -> kg
      sendHeight = height * 0.0254; // inches -> m
    }

    // UI: loading
    calculateBtn.disabled = true;
    calculateBtn.textContent = 'Calculating...';

    try {
      const resp = await fetch('/api/calculate-bmi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weight: sendWeight, height: sendHeight })
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err && err.error ? err.error : 'Failed to calculate BMI');
      }

      const data = await resp.json();

      // Update result panel
      bmiValueEl.textContent = String(data.bmi);
      bmiCategoryEl.textContent = data.category;
      bmiMessageEl.textContent = messageForCategory(data.category);
      detailWeightEl.textContent = units === 'metric' ? `${weight} kg` : `${weight} lb`;
      detailHeightEl.textContent = units === 'metric' ? `${height} m` : `${height} in`;

      // set class
      const rc = document.querySelector('.result-card');
      rc.classList.remove('underweight','normal','overweight','obese');
      if (data.className) rc.classList.add(data.className);

      resultPanel.hidden = false;

      // push to history
      pushHistory({ bmi: data.bmi, category: data.category, t: Date.now() });

    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      calculateBtn.disabled = false;
      calculateBtn.textContent = 'Calculate BMI';
    }
  });

  // Reset handler
  resetBtn.addEventListener('click', () => {
    form.reset();
    resultPanel.hidden = true;
  });

  // Again handler
  againBtn.addEventListener('click', () => {
    resultPanel.hidden = true;
    weightEl.focus();
  });
});