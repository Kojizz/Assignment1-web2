# BMI Calculator – Node.js (Assignment 1)

A simple BMI (Body Mass Index) Calculator Web Application built using Node.js and Express.js.
This project demonstrates basic routing, handling HTTP GET/POST requests, input validation, and dynamic HTML responses.

---

## Project Structure

```
ASSIGNMENT1_WEB2/
 ├── src/
 │    └── index.js
 ├── public/
 │    └── style.css   (optional if you use inline CSS)
 ├── node_modules/
 ├── package.json
 ├── package-lock.json
```

**Explanation:**

* **src/index.js** – Main server file containing routes, HTML form, BMI logic
* **public/style.css** – (Optional) external CSS file
* **node_modules** – Installed dependencies (Express)
* **package.json** – Project metadata and dependencies

---

## Objective

* Learn Node.js routing
* Work with GET and POST methods
* Handle form input
* Calculate BMI on the server
* Return results dynamically
* Practice validation and simple UI styling

---

## Features

### GET /

Displays a simple HTML form where the user enters:

* weight (kg)
* height (cm)

### POST /calculate-bmi

Receives user input and:

* Converts height to meters

* Calculates BMI:
  [
  BMI = \frac{weight}{height^2}
  ]

* Determines category:

  * Underweight – BMI < 18.5
  * Normal – 18.5–24.9
  * Overweight – 25–29.9
  * Obese – ≥ 30

* Returns the result in a styled HTML response

* Applies color-coded output:

  * 🟢 Normal
  * 🟡 Overweight
  * 🔴 Obese

### Input Validation

* Weight and height must be positive
* If invalid → user receives error message

---

## Code Structure & Organization

This project intentionally uses a simple structure to match assignment requirements.

### `src/index.js` includes:

* Express server setup
* Middleware (`express.urlencoded`)
* GET and POST routes
* HTML form generation
* BMI calculation logic
* Styled result output

Clean structure even without templates or advanced folders.

---

## User Interface

The HTML is dynamically generated and includes:

* Centered form layout
* Styled input fields and button
* Error messages
* Category-based colored BMI display
* Responsive basic layout

Example design elements:

* Green → Normal
* Yellow → Overweight
* Red → Obese

---

## To Run

### Install dependencies:

```
npm install
```

### Start the server:

```
node src/index.js
```

### Open in browser:

```
http://localhost:3000
```

---

## Technologies Used

* Node.js
* Express.js
* HTML/CSS (inline or external)
* JavaScript

---

## Conclusion

This BMI Calculator demonstrates:

* Basic server setup
* Handling routes and form submissions
* Performing backend calculations
* Dynamically generating HTML
* Validating user input
* Returning styled results to the client

It provides a strong foundation for more advanced Node.js and Express applications.

---
