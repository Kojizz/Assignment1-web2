const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// BMI Categories helper
function getBMICategory(bmi) {
  if (bmi < 18.5) {
    return { category: 'Underweight', color: '#3498db', className: 'underweight' };
  } else if (bmi < 24.9) {
    return { category: 'Normal Weight', color: '#27ae60', className: 'normal' };
  } else if (bmi < 29.9) {
    return { category: 'Overweight', color: '#f39c12', className: 'overweight' };
  } else {
    return { category: 'Obese', color: '#e74c3c', className: 'obese' };
  }
}

// Serve the static front page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Server-side form POST (returns an HTML result page)
app.post('/calculate-bmi', (req, res) => {
  const weight = parseFloat(req.body.weight);
  const height = parseFloat(req.body.height);

  if (isNaN(weight) || weight <= 0 || isNaN(height) || height <= 0) {
    return res.status(400).sendFile(path.join(__dirname, 'public', 'index.html'));
  }

  const bmi = weight / (height * height);
  const result = getBMICategory(bmi);

  res.send(`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>BMI Result</title><link rel="stylesheet" href="/styles.css"></head><body><div class="container"><div class="result-box ${result.className}"><h2>Your BMI Result</h2><div class="bmi-value">${bmi.toFixed(2)}</div><div class="category">${result.category}</div></div><div class="details"><div class="detail-item"><span class="detail-label">Weight:</span><span class="detail-value">${weight} kg</span></div><div class="detail-item"><span class="detail-label">Height:</span><span class="detail-value">${height} m</span></div><div class="detail-item"><span class="detail-label">BMI:</span><span class="detail-value result-highlight">${bmi.toFixed(2)}</span></div></div><a href="/" class="btn-back">← Calculate Again</a></div></body></html>`);
});

// API endpoint for AJAX clients - returns JSON
app.post('/api/calculate-bmi', (req, res) => {
  const weight = parseFloat(req.body.weight);
  const height = parseFloat(req.body.height);

  if (isNaN(weight) || weight <= 0 || isNaN(height) || height <= 0) {
    return res.status(400).json({ error: 'Invalid input. Weight and height must be positive numbers.' });
  }

  const bmi = weight / (height * height);
  const result = getBMICategory(bmi);

  res.json({
    bmi: Number(bmi.toFixed(2)),
    category: result.category,
    className: result.className,
    color: result.color
  });
});

app.listen(port, () => {
  console.log(`\n🚀 BMI Calculator Server`);
  console.log(`📍 Listening at http://localhost:${port}`);
  console.log(`\n✨ Open your browser and go to http://localhost:${port}\n`);
});
