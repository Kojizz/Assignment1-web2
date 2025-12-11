const express = require('express');
const app = express();
const port = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// BMI Categories
function getBMICategory(bmi) {
  if (bmi < 18.5) {
    return { category: 'Underweight', color: '#3498db' };
  } else if (bmi < 24.9) {
    return { category: 'Normal Weight', color: '#27ae60' };
  } else if (bmi < 29.9) {
    return { category: 'Overweight', color: '#f39c12' };
  } else {
    return { category: 'Obese', color: '#e74c3c' };
  }
}

// GET route - Display BMI Calculator Form
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>BMI Calculator</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
        }

        .container {
          background: white;
          border-radius: 15px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
          padding: 40px;
          max-width: 500px;
          width: 100%;
        }

        h1 {
          color: #333;
          text-align: center;
          margin-bottom: 10px;
          font-size: 2.5em;
        }

        .subtitle {
          text-align: center;
          color: #666;
          margin-bottom: 30px;
          font-size: 0.95em;
        }

        .form-group {
          margin-bottom: 25px;
        }

        label {
          display: block;
          margin-bottom: 8px;
          color: #333;
          font-weight: 600;
          font-size: 1.05em;
        }

        input {
          width: 100%;
          padding: 12px 15px;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          font-size: 1em;
          transition: border-color 0.3s;
        }

        input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 8px rgba(102, 126, 234, 0.2);
        }

        button {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1.1em;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        button:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
        }

        button:active {
          transform: translateY(0);
        }

        .info {
          background: #f0f4ff;
          padding: 15px;
          border-radius: 8px;
          margin-top: 25px;
          border-left: 4px solid #667eea;
        }

        .info h3 {
          color: #667eea;
          margin-bottom: 10px;
          font-size: 0.95em;
        }

        .info-item {
          color: #666;
          font-size: 0.9em;
          margin-bottom: 8px;
        }

        .info-item strong {
          color: #333;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>📊 BMI Calculator</h1>
        <p class="subtitle">Calculate your Body Mass Index</p>

        <form method="POST" action="/calculate-bmi" onsubmit="validateForm(event)">
          <div class="form-group">
            <label for="weight">Weight (kg)</label>
            <input 
              type="number" 
              id="weight" 
              name="weight" 
              placeholder="Enter your weight in kilograms" 
              step="0.1"
              required
            >
          </div>

          <div class="form-group">
            <label for="height">Height (m)</label>
            <input 
              type="number" 
              id="height" 
              name="height" 
              placeholder="Enter your height in meters" 
              step="0.01"
              required
            >
          </div>

          <button type="submit">Calculate BMI</button>
        </form>

        <div class="info">
          <h3>BMI Categories</h3>
          <div class="info-item"><strong style="color: #3498db;">Underweight:</strong> BMI < 18.5</div>
          <div class="info-item"><strong style="color: #27ae60;">Normal Weight:</strong> 18.5 ≤ BMI < 24.9</div>
          <div class="info-item"><strong style="color: #f39c12;">Overweight:</strong> 25 ≤ BMI < 29.9</div>
          <div class="info-item"><strong style="color: #e74c3c;">Obese:</strong> BMI ≥ 30</div>
        </div>
      </div>

      <script>
        function validateForm(event) {
          const weight = parseFloat(document.getElementById('weight').value);
          const height = parseFloat(document.getElementById('height').value);

          if (isNaN(weight) || weight <= 0) {
            alert('⚠️ Please enter a valid positive weight!');
            event.preventDefault();
            return false;
          }

          if (isNaN(height) || height <= 0) {
            alert('⚠️ Please enter a valid positive height!');
            event.preventDefault();
            return false;
          }

          return true;
        }
      </script>
    </body>
    </html>
  `);
});

// POST route - Calculate BMI
app.post('/calculate-bmi', (req, res) => {
  const weight = parseFloat(req.body.weight);
  const height = parseFloat(req.body.height);

  // Validation
  if (isNaN(weight) || weight <= 0 || isNaN(height) || height <= 0) {
    return res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>BMI Calculator - Error</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
          }

          .container {
            background: white;
            border-radius: 15px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
            padding: 40px;
            max-width: 500px;
            width: 100%;
          }

          .error {
            background: #fee;
            border: 2px solid #e74c3c;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
          }

          .error h2 {
            color: #e74c3c;
            margin-bottom: 10px;
            font-size: 1.3em;
          }

          .error p {
            color: #c0392b;
            margin-bottom: 8px;
          }

          a {
            display: inline-block;
            margin-top: 20px;
            padding: 12px 30px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            transition: transform 0.2s;
          }

          a:hover {
            transform: translateY(-2px);
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="error">
            <h2>❌ Invalid Input</h2>
            <p>Please enter valid positive numbers for both weight and height.</p>
            <p><strong>Weight:</strong> Must be a positive number (kg)</p>
            <p><strong>Height:</strong> Must be a positive number (m)</p>
          </div>
          <a href="/">← Back to Calculator</a>
        </div>
      </body>
      </html>
    `);
  }

  // Calculate BMI
  const bmi = weight / (height * height);
  const result = getBMICategory(bmi);

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>BMI Result</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
        }

        .container {
          background: white;
          border-radius: 15px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
          padding: 40px;
          max-width: 500px;
          width: 100%;
        }

        .result-box {
          border: 3px solid ${result.color};
          border-radius: 12px;
          padding: 30px;
          text-align: center;
          background: ${result.color}15;
          margin-bottom: 30px;
        }

        .result-box h2 {
          color: ${result.color};
          font-size: 2.5em;
          margin-bottom: 10px;
        }

        .bmi-value {
          font-size: 3em;
          color: ${result.color};
          font-weight: bold;
          margin: 20px 0;
        }

        .category {
          font-size: 1.8em;
          color: ${result.color};
          font-weight: 600;
          margin: 15px 0;
        }

        .details {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 20px;
          text-align: left;
        }

        .detail-item {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid #e0e0e0;
          font-size: 1.05em;
        }

        .detail-item:last-child {
          border-bottom: none;
        }

        .detail-label {
          font-weight: 600;
          color: #333;
        }

        .detail-value {
          color: #666;
        }

        .message {
          padding: 15px;
          background: ${result.color}25;
          border-left: 4px solid ${result.color};
          border-radius: 8px;
          margin-bottom: 20px;
          color: #333;
          font-size: 1.1em;
        }

        .message p {
          line-height: 1.6;
        }

        .button-group {
          display: flex;
          gap: 10px;
        }

        a, button {
          flex: 1;
          padding: 14px;
          border: none;
          border-radius: 8px;
          font-size: 1em;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s;
          text-decoration: none;
          text-align: center;
        }

        .btn-back {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .btn-back:hover {
          transform: translateY(-2px);
        }

        .info {
          background: #f0f4ff;
          padding: 15px;
          border-radius: 8px;
          border-left: 4px solid #667eea;
          font-size: 0.9em;
        }

        .info h3 {
          color: #667eea;
          margin-bottom: 10px;
        }

        .info-item {
          color: #666;
          margin-bottom: 8px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="result-box">
          <h2>Your BMI Result</h2>
          <div class="bmi-value">${bmi.toFixed(2)}</div>
          <div class="category">${result.category}</div>
        </div>

        <div class="message">
          <p>Based on your measurements, your Body Mass Index is <strong>${bmi.toFixed(2)}</strong>, which falls into the <strong>${result.category}</strong> category.</p>
        </div>

        <div class="details">
          <div class="detail-item">
            <span class="detail-label">Weight:</span>
            <span class="detail-value">${weight} kg</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Height:</span>
            <span class="detail-value">${height} m</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">BMI Value:</span>
            <span class="detail-value">${bmi.toFixed(2)}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Category:</span>
            <span class="detail-value" style="color: ${result.color}; font-weight: 600;">${result.category}</span>
          </div>
        </div>

        <div class="info">
          <h3>BMI Categories Reference</h3>
          <div class="info-item"><strong style="color: #3498db;">Underweight:</strong> BMI < 18.5</div>
          <div class="info-item"><strong style="color: #27ae60;">Normal Weight:</strong> 18.5 ≤ BMI < 24.9</div>
          <div class="info-item"><strong style="color: #f39c12;">Overweight:</strong> 25 ≤ BMI < 29.9</div>
          <div class="info-item"><strong style="color: #e74c3c;">Obese:</strong> BMI ≥ 30</div>
        </div>

        <div class="button-group" style="margin-top: 25px;">
          <a href="/" class="btn-back">← Calculate Again</a>
        </div>
      </div>
    </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`\n🚀 BMI Calculator Server`);
  console.log(`📍 Listening at http://localhost:${port}`);
  console.log(`\n✨ Open your browser and go to http://localhost:${port}\n`);
});