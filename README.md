
# Spiffy Budget App

Personal budgeting app for a small family (up to 5 users) with secure cookie-based authentication.

## Project Structure

spiffy-budget/
├─ backend/       # Node/Express API + Neon Postgres
├─ frontend/      # Vite + React SPA
├─ package.json   # Root monorepo workspace + dev scripts
└─ README.md

---

## 1️⃣ Prerequisites

- Node.js >= 20
- npm >= 9
- Neon Database account (Postgres-compatible)

---

## 2️⃣ Local Setup

### Clone the repo

```bash
git clone <your-repo-url>
cd spiffy-budget
```

### Install dependencies

```bash
npm install
npm install -D concurrently
npm install --workspace backend
npm install --workspace frontend
```

---

### Environment Variables

Create .env files in each folder:

**backend/.env**
```
NEON_DB_URL=<your-neon-db-url>
JWT_SECRET=<strong-random-secret>
```

**frontend/.env**
```
VITE_API_URL=http://localhost:3000
```

> In production, replace VITE_API_URL with your backend service URL.

---

## 3️⃣ Database Setup

Use the SQL files in backend/ to create tables in Neon:

```bash
psql <your-neon-db-url> -f backend/users.sql
psql <your-neon-db-url> -f backend/transactions.sql
```

---

## 4️⃣ Running Locally

From the root directory:

```bash
npm run dev
```

- Backend → http://localhost:3000
- Frontend → http://localhost:5173

Frontend will automatically send cookies (httpOnly) with requests.

### Individual Scripts

- npm run start:backend → Start backend only
- npm run start:frontend → Start frontend only (Vite preview)
- npm run build:frontend → Build frontend for production

---

## 5️⃣ Running in Production (Railway)

### Backend Service

- Root Directory: backend/
- Environment Variables: NEON_DB_URL, JWT_SECRET
- Start Command: npm start

### Frontend Service

- Root Directory: frontend/
- Environment Variables: VITE_API_URL=https://<backend-service-url>
- Build Command: npm run build
- Start Command: npm run preview

---

## 6️⃣ Cookie-Based Authentication

- Uses httpOnly and Secure cookies
- JWT stored only in cookies → never accessible from JS
- Cookies configured with SameSite=Lax for same-site safety
- Backend endpoints require cookies to authenticate

---

## 7️⃣ Folder Overview

**backend/**

- index.js → Express server
- auth.js → Login/Signup/Logout routes
- sessions.js → JWT creation & verification
- db.js → Neon connection helper
- users.sql → Users table
- transactions.sql → Transactions table

**frontend/src/**

- api/api.js → API fetch wrapper with credentials: include
- context/AuthContext.jsx → Auth provider + hooks
- pages/AuthPage.jsx → Login/Signup form
- pages/Dashboard.jsx → Protected dashboard
- components/ProtectedRoute.jsx → Route protection

---

## 8️⃣ Adding New Family Users

- Each user requires a family_id (default 1 for your household)
- Users in the same family_id can see shared transactions (future expansion)

---

## 9️⃣ Deployment Tips

- If hosting frontend + backend on the same Railway project, cookies work seamlessly
- For custom domains:
  - Frontend: mybudget.com
  - Backend: api.mybudget.com
- Use SameSite=Lax → cookies accessible to subdomain frontend

---

## 10️⃣ Next Steps / TODO

- Implement CRUD operations for transactions
- Add categories & notes for transactions
- Optional: Shared budget view by family member
