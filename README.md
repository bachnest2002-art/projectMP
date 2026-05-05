# Portfolio Advisory Service

A full-stack web application for portfolio advisory with multiple user roles: Admin, Customer, CRM, and RA (Research Analyst).

## Features

### Admin Login
- Create clients (customers) with mobile and email
- Authenticate via OTP (SMS and email)
- Update payment details (bank, account, UTR)
- Add comments for clients
- Allot portfolios with start/end dates, active/inactive, complimentary
- Dashboard: active/inactive portfolios, nearing end, no initial value

### Customer Login
- Set initial portfolio value (min Rs. 500,000)
- View portfolio overview with metrics (CAGR, MDD, etc.)
- Tabs: Portfolio Overview, Actual Portfolio, Exited Stocks

### CRM Login
- View client portfolios
- Add comments for clients

### RA Login
- Add buy/sell recommendations with stock and industry
- Upload bhavcopy for daily updates
- Update Liquid BeES closing rates

### Recommendation Engine
- Automates buying/selling based on RA recommendations
- Manages up to 50 stocks per portfolio
- Invests remaining cash in Liquid BeES

## Tech Stack
- **Frontend**: Next.js 14, React, TypeScript
- **Backend**: Next.js API Routes
- **Database**: SQLite with Prisma ORM
- **Auth**: JWT
- **Styling**: Tailwind CSS (not implemented yet)

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

3. Run development server:
   ```bash
   npm run dev
   ```

4. Open http://localhost:3000

## Environment Variables
Create `.env.local`:
```
JWT_SECRET=your-secret-key
```

## API Endpoints
- `/api/auth/login` - User login
- `/api/admin/clients` - Manage customers
- `/api/customer/portfolio/initial-value` - Set portfolio value
- `/api/ra/recommendations` - Add recommendations
- `/api/engine/run` - Run recommendation engine

## Notes
- OTP sending is simulated (console log)
- Charts are placeholders
- Calculations are mocked
- File uploads are JSON-based for simplicity
