# FinBro

A personal finance web app that links to your bank account, categorizes your spending automatically, and helps you track budgets and income all in one place.

## Features

- **Auth** — email/password login and registration via Supabase Auth
- **Bank linking** — connect a bank account via Plaid and sync transactions
- **Auto-categorization** — transactions are categorized automatically using our own ML model
- **Dashboard** — current-month income/expenses/remaining overview, spending breakdown pie chart, AI summary using Gemini
- **Transactions** — full transaction history
- **Budgets** — set a monthly limit per category and track progress against it
- **Manual entries** — log income or expenses by hand

## Tech Stack

- **Frontend:** React, TypeScript, Vite, CSS, react-router-dom, Recharts
- **Backend:** Supabase (Postgres, Auth, Row-Level Security)
- **Integrations:** Plaid (bank data), Gemini API (transaction categorization)
- **Deploy:** Vercel

## Getting Started

The app lives in [`my-app/`](my-app), not the repo root.

```bash
cd my-app
npm install
```

Create a `.env` file in `my-app/` with:

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
PLAID_CLIENT_ID=
PLAID_CLIENT_SECRET=
SUPABASE_SERVICE_ROLE_KEY=
```

Then run the dev server:

```bash
npm run dev
```

## Team

Dai, Nate, Anika, Aidan, Jia
