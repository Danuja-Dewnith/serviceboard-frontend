# ServiceBoard — Frontend

A Next.js 14 frontend for the ServiceBoard mini service request board, where homeowners can post service requests and tradespeople can browse, accept, and complete jobs.

Built as part of the Full-Stack Developer Intern assessment for GlobalTNA.

---

## 🌐 Live Demo

| | URL |
|---|---|
| **Frontend (Vercel)** | [https://serviceboard-frontend.vercel.app](https://serviceboard-frontend.vercel.app) |
| **Backend API** | [https://serviceboard-backend-production.up.railway.app/api](https://serviceboard-backend-production.up.railway.app/api) |

---

## ✨ Features

### Core
- Browse all job requests with category and status filters
- Keyword search across title and description
- Post new job requests with client-side validation
- View full job detail page
- Update job status (Open → In Progress → Closed)
- Delete job requests

### Bonus
- JWT-based authentication (register / login)
- Role-based views — Homeowner vs Service Provider
- Interactive map for job locations (Leaflet + OpenStreetMap)
- Sri Lanka timezone display (Asia/Colombo)
- Provider dashboard to track accepted and completed jobs
- Responsive design for mobile and desktop

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Next.js 14 (App Router) | React framework |
| React 18 | UI library |
| CSS-in-JS (inline styles) | Styling |
| Lucide React | Icons |
| Axios | HTTP client |
| Leaflet + React Leaflet | Interactive maps |

---

## 📁 Project Structure

```
frontend/
├── app/
│   ├── about/
│   │   └── page.js
│   ├── components/
│   │   ├── FilterBar.js
│   │   ├── Footer.js
│   │   ├── JobCard.js
│   │   ├── JobLocationMap.js
│   │   ├── Navbar.js
│   │   └── StatusBadge.js
│   ├── job/[id]/
│   │   └── page.js
│   ├── login/
│   │   └── page.js
│   ├── my-requests/
│   │   └── page.js
│   ├── new/
│   │   └── page.js
│   ├── register/
│   │   └── page.js
│   ├── globals.css
│   ├── layout.js
│   └── page.js
├── lib/
│   ├── api.js
│   └── dateUtils.js
├── public/
├── .env.local
└── package.json
```

---

## ⚙️ Environment Variables

Create a `.env.local` file in the root of this directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

For production, set this to your deployed Railway backend URL.

---

## 🚀 Running Locally

### Prerequisites

- Node.js v18+
- Backend server running at `http://localhost:5000` (see [backend repo](https://github.com/Danuja-Dewnith/serviceboard-backend))

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/Danuja-Dewnith/serviceboard-frontend.git
cd serviceboard-frontend

# 2. Install dependencies
npm install

# 3. Add environment variables
cp .env.local.example .env.local
# Edit .env.local with your backend URL

# 4. Start the development server
npm run dev
```

App runs at `http://localhost:3000`

---

## 🏗️ Build for Production

```bash
npm run build
npm start
```

---

## 🚢 Deployment (Vercel)

1. Push this repository to GitHub (must be **public**)
2. Go to [vercel.com](https://vercel.com) → Add New Project
3. Import this repository
4. Add environment variable: `NEXT_PUBLIC_API_URL` → your Railway backend URL
5. Click Deploy

---

## 🔗 Related

- **Backend Repository:** [serviceboard-backend](https://github.com/Danuja-Dewnith/serviceboard-backend)

---

## 👨‍💻 Author

**Danuja Dewnith**
- Email: danujadewnith@gmail.com
- GitHub: [@Danuja-Dewnith](https://github.com/Danuja-Dewnith)

---

## 📅 Submission

- **Assessment:** Full-Stack Developer Intern — GlobalTNA
- **Submission Date:** 18 May 2026