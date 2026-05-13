# 🚀 AI Spend Audit

[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://credex-audit-phi.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-15.2.8-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)

## 📋 Overview

**AI Spend Audit** is a free tool that helps startups and engineering teams identify overspending on AI tools like Cursor, GitHub Copilot, Claude, and ChatGPT. Get instant, data-driven recommendations to optimize your AI stack and save money.

**Live Demo:** 🔗 [https://credex-audit-phi.vercel.app](https://credex-audit-phi.vercel.app)

---

## 📸 Screenshots

### 1. Main Dashboard - Input Form
![Main Dashboard](https://github.com/Dutta-Raj/ai-spend-audit/blob/main/Screenshot%202026-05-13%20161246.png)
*Users enter company information and their AI tool stack details.*

### 2. Audit Results - Savings Display
![Audit Results](https://github.com/Dutta-Raj/ai-spend-audit/blob/main/Screenshot%202026-05-13%20161336.png)
*Audit results showing monthly savings ($140/month), annual savings ($1,680/year), and detailed recommendations.*

### 3. Shareable Public Report
![Shareable Report](https://github.com/Dutta-Raj/ai-spend-audit/blob/main/Screenshot%202026-05-13%20161356.png)
*Anonymous shareable report - no personal information exposed, only savings and recommendations.*

---

## ✨ Features

### ✅ Core Features (6 MVP Requirements)

| # | Feature | Description |
|---|---------|-------------|
| 1 | **Spend Input Form** | Support for Cursor, Copilot, Claude, ChatGPT + add custom tools |
| 2 | **Audit Engine** | Hardcoded pricing rules with defensible, finance-literate logic |
| 3 | **Results Page** | Clear savings breakdown with hero numbers (monthly/yearly) |
| 4 | **AI Summary** | Personalized insights with graceful fallback template |
| 5 | **Lead Capture** | Email collection for high-savings cases (>$100/month) |
| 6 | **Shareable URLs** | Unique public audit reports with data embedded in URL |

### 🎨 UI/UX Features
- 🌙 Dark theme with emerald green accents
- 🔮 Glassmorphic card design with backdrop blur
- 📱 Fully responsive layout for all devices
- ✨ Smooth animations and transitions
- 💾 Form persistence across page reloads (localStorage)

### 📊 Audit Rules

| Rule | Condition | Savings |
|------|-----------|---------|
| Cursor Hobby → Free | Paying for free plan | Save $40/month |
| Claude Team → Pro | ≤3 seats, paying $80 | Save $60/month |
| ChatGPT Team → Plus | 2 seats, paying $80 | Save $40/month |
| Copilot Business → Individual | 1 seat | Save $9/month |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 14 (App Router) |
| **Styling** | Tailwind CSS + Framer Motion |
| **Language** | TypeScript |
| **Database** | SQLite (better-sqlite3) |
| **Deployment** | Vercel |
| **Icons** | Lucide React |
| **Testing** | Jest |

---

## 📁 Project Structure
ai-spend-audit/
├── app/
│ ├── api/
│ │ ├── audit/route.ts # Audit calculation API
│ │ └── summarize/route.ts # AI summary API
│ ├── share-view/page.tsx # Shareable audit page
│ ├── layout.tsx
│ ├── page.tsx # Main dashboard
│ └── globals.css
├── lib/
│ ├── audit-engine.ts # Audit rules engine
│ └── db-sqlite.ts # Database utilities
├── components/
├── tests/ # Jest test files
├── public/ # Static assets
└── [documentation files]

text

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Dutta-Raj/ai-spend-audit.git
cd ai-spend-audit

# Install dependencies
npm install

# Run development server
npm run dev
Open http://localhost:3000 to see the app.

Environment Variables
Create a .env.local file:

env
ANTHROPIC_API_KEY=your_api_key_here
RESEND_API_KEY=your_resend_key_here
🧪 Testing
bash
# Run all tests
npm test

# Expected output: 7 passing tests
📈 CI/CD
GitHub Actions workflow runs on every push to main:

✅ Lint check

✅ Test suite (7 tests)

✅ Build verification

📚 Documentation Files
File	Description
ARCHITECTURE.md	System architecture and data flow
DEVLOG.md	Daily development log
REFLECTION.md	Design decisions and learnings
TESTS.md	Test documentation
PRICING_DATA.md	Pricing sources with URLs
PROMPTS.md	AI prompts and fallback strategy
GTM.md	Go-to-market strategy
ECONOMICS.md	Unit economics
USER_INTERVIEWS.md	User research
LANDING_COPY.md	Marketing copy
METRICS.md	Analytics metrics
📝 License
MIT

👤 Author
Rajdeep Dutta

📅 Submission Date
May 13, 2026
