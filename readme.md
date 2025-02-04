# Playwright-API-Tests

This repository contains API tests for the **FX-TradeHub-API**, built using [Playwright](https://playwright.dev/).

## 📌 Features

- ✅ Full CRUD coverage for **Counterparties**
- 🛠️ Validation tests for **Trades and Settlements** (coming soon)
- 🔥 Negative test cases for **validation edge cases**
- 📂 Automated **setup and teardown**

---

## 🏗️ Setup & Installation

### **1️⃣ Choose the directory to clone your repository to**

```bash
cd Playwright-API-Tests
```

### **2️⃣ Clone the repository**

```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/Playwright-API-Tests.git
```

## Getting Started

### Install dependencies

Ensure you have Node.js (v18+) installed, then run:

```bash
npm install
```

### Ensure the FX-TradeHub-API server is running

Before running tests, the FX-TradeHub-API must be running locally:

👉 FX-TradeHub-API GitHub Repo [Repo](https://github.com/sd576/FX-TradeHub-API)

```sh
cd /path/to/FX-TradeHub-API
```

```bash
npm start
```

(Default URL: http://localhost:3000)

## Running the API Tests

### Run all tests

```bash
npx playwright test
```

### Run a single test file

This command is run from the root directory, which references the location (`src/tests/api/`) of the tests

The format is:

```bash
npx playwright test `<path to test>``<test_name>`
```

```bash
npx playwright test src/tests/api/counterpartiesCRUD.spec.ts
```

### Run tests with UI mode

```bash
npx playwright test --ui
```

## Test Structure

- **src/tests/api/** → API test cases
- **src/fixtures/** → Data comparison utilities
- **src/hooks/** → Test setup & teardown hooks

##❓ FAQ / Troubleshooting

1. Tests are failing due to missing data

### Reseed the database:

```bash
cd /path/to/FX-TradeHub-API
```

```bash
npm run db
```

### Start the API server

```bash
npm start
```

2. How do I generate an HTML test report?

```bash
npx playwright show-report
```
