# GovTrack Kenya
**A Web-Based Platform for Integrated Tracking & Retrieval of Lost Government Documents**

> Machakos University CS Project · Victor Mauti Cosmas · J17-1239-2022

---

## 📁 Project Structure

```
govtrack-kenya/
├── backend/                  ← Node.js + Express + MongoDB API
│   ├── models/               ← Mongoose data models
│   │   ├── User.js
│   │   ├── Document.js
│   │   ├── LostReport.js
│   │   └── FoundItem.js
│   ├── routes/               ← Express API routes
│   │   ├── auth.js           ← Register / Login / JWT
│   │   ├── documents.js      ← Track & view documents
│   │   ├── lostReports.js    ← Submit & view lost reports
│   │   ├── foundItems.js     ← Search found items
│   │   └── admin.js          ← Admin-only endpoints
│   ├── middleware/
│   │   └── auth.js           ← JWT protect & adminOnly middleware
│   ├── server.js             ← Express app entry point
│   ├── seed.js               ← Seed database with sample data
│   ├── .env                  ← Environment variables
│   └── package.json
│
└── frontend/                 ← React app
    └── src/
        ├── api/
        │   └── axios.js      ← All API calls (Axios)
        ├── context/
        │   └── AuthContext.jsx ← Global auth state + JWT storage
        ├── components/
        │   ├── Icon.jsx       ← SVG icon library
        │   ├── Sidebar.jsx    ← Navigation sidebar
        │   └── StatusBadge.jsx ← StatusBadge + DocTypeIcon
        ├── pages/
        │   ├── LandingPage.jsx
        │   ├── AuthPage.jsx   ← Login + Register
        │   ├── Dashboard.jsx
        │   ├── CitizenPages.jsx ← Track, MyDocs, ReportLost, FoundItems, MyReports
        │   └── admin/
        │       └── AdminPages.jsx ← All 5 admin pages
        ├── styles/
        │   └── global.css
        ├── App.jsx            ← Main router
        └── index.js
```

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (local or MongoDB Atlas)
- Windsurf / VS Code

---

### 1. Backend Setup

```bash
cd backend
npm install
```

Edit `.env` with your MongoDB URI:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/govtrack_kenya
JWT_SECRET=govtrack_kenya_super_secret_key_2026
JWT_EXPIRES_IN=7d
```

Seed the database with sample data:
```bash
npm run seed
```

Start the backend server:
```bash
npm run dev        # Development (with auto-restart)
npm start          # Production
```

API runs at: `http://localhost:5000`

---

### 2. Frontend Setup

```bash
cd frontend
npm install
npm start
```

App runs at: `http://localhost:3000`

The `"proxy": "http://localhost:5000"` in `package.json` routes all `/api` calls to the backend automatically.

---

## 🔐 Demo Credentials

| Role    | Email                  | Password     |
|---------|------------------------|--------------|
| Citizen | victor@example.com     | password123  |
| Admin   | admin@govtrack.ke      | admin2026    |

---

## 🛠 Tech Stack (MERN)

| Layer     | Technology               |
|-----------|--------------------------|
| Frontend  | React.js, Axios          |
| Styling   | Custom CSS (no framework)|
| Backend   | Node.js, Express.js      |
| Database  | MongoDB, Mongoose        |
| Auth      | JWT (jsonwebtoken)       |
| Security  | bcryptjs, RBAC           |

---

## 📋 API Endpoints

### Auth
- `POST /api/auth/register` — Register citizen
- `POST /api/auth/login` — Login, get JWT
- `GET /api/auth/me` — Get logged-in user

### Documents (Protected)
- `GET /api/documents/my` — Get my documents
- `GET /api/documents/track/:docNumber` — Track by number

### Lost Reports (Protected)
- `POST /api/lost-reports` — Submit report
- `GET /api/lost-reports/my` — My reports

### Found Items
- `GET /api/found-items` — Search (protected)
- `GET /api/found-items/public` — Public search

### Admin (Admin only)
- `GET /api/admin/stats` — System stats
- `GET /api/admin/documents` — All documents
- `PATCH /api/admin/documents/:id/status` — Update status
- `GET /api/admin/lost-reports` — All lost reports
- `GET /api/admin/found-items` — All found items
- `POST /api/admin/found-items` — Log found item
- `GET /api/admin/users` — All citizens
