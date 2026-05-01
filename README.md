# 🍔 Crave Food — Premium Food Social Media App

A visually stunning, full-stack food social media web application built with React, Node.js, Express, and MySQL. Inspired by Instagram, Zomato, Pinterest, and TikTok — designed for food lovers.

![Crave Food](https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200)

## ✨ Features

### Core Features
- 🔐 **Authentication** — JWT-based signup/login with bcrypt password hashing
- 📸 **Photo Posts** — Upload and share food images with captions and restaurant tags
- 🎬 **Video Reels** — TikTok-style food reels with auto-play and viewport detection
- ❤️ **Likes** — Like/unlike posts with double-tap animation
- 💬 **Comments** — Real-time comment threads on posts
- 🔖 **Save Posts** — Bookmark your favorite food posts
- 👥 **Follow System** — Follow/unfollow users with real-time follower counts
- 🍽️ **Restaurants** — Browse and discover restaurants with ratings and Google Maps links
- 🔍 **Search** — Search for users and restaurants with debounced queries
- 👤 **Profiles** — View and edit profiles with posts grid and saved posts tab
- 🌙 **Dark Mode** — Toggle dark/light theme with system preference detection

### UI/UX Features
- ✅ Premium glassmorphism design with backdrop blur
- ✅ Smooth Framer Motion animations on all pages
- ✅ Floating Action Button (FAB) for quick upload access
- ✅ Toast notifications for all actions (like, save, comment, upload)
- ✅ Skeleton loaders for loading states
- ✅ Empty states with animated icons
- ✅ Responsive design (desktop sidebar, mobile bottom nav)
- ✅ Page transition animations on route changes
- ✅ Double-tap heart animation on posts and reels
- ✅ Hover effects and micro-interactions everywhere

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite 8, React Router 7 |
| **Styling** | Tailwind CSS 4, Custom CSS Variables |
| **Animations** | Framer Motion 12 |
| **Icons** | Lucide React |
| **HTTP Client** | Axios |
| **Notifications** | React Hot Toast |
| **Backend** | Node.js, Express |
| **Database** | MySQL (Sequelize ORM) |
| **Auth** | JWT + bcrypt |
| **File Uploads** | Multer (local disk storage) |

## 📁 Folder Structure

```
Crave-Food/
├── backend/
│   └── src/
│       ├── config/         # DB connection, multer config
│       ├── controllers/    # Route handlers (auth, post, user, etc.)
│       ├── middleware/      # Auth, validation, error handling
│       ├── models/          # Sequelize models (User, Post, Comment, etc.)
│       ├── routes/          # Express route definitions
│       ├── services/        # Business logic layer
│       ├── uploads/         # Local file storage
│       ├── utils/           # Helper functions
│       ├── app.js           # Express app setup
│       └── server.js        # Server startup + DB seeding
├── frontend/
│   └── src/
│       ├── components/      # Reusable UI components
│       │   ├── auth/        # Login/Signup forms
│       │   ├── common/      # Avatar, Modal, Loader, EmptyState
│       │   ├── feed/        # PostCard, PostActions, CommentSection
│       │   └── layout/      # MainLayout, Sidebar, Navbar
│       ├── context/         # React Contexts (Auth, Theme, Post)
│       ├── pages/           # Page components (Home, Profile, etc.)
│       ├── routes/          # AppRoutes with protected routes
│       ├── services/        # API service functions
│       └── styles/          # CSS design system
├── database/
│   ├── schema.sql           # Full database schema with constraints
│   ├── seed.sql             # Sample data for testing
│   └── queries.sql          # Academic demonstration queries
└── README.md
```

## 🗄️ Database Design (ER Diagram)

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   USERS     │────<│    POSTS     │>────│  RESTAURANTS │
│─────────────│     │──────────────│     │─────────────│
│ id (PK)     │     │ id (PK)      │     │ id (PK)     │
│ fullName    │     │ userId (FK)  │     │ name        │
│ username    │     │ caption      │     │ location    │
│ email       │     │ imageUrl     │     │ cuisine     │
│ password    │     │ videoUrl     │     │ rating      │
│ bio         │     │ restaurant   │     │ mapLink     │
│ avatar      │     │ type         │     │ imageUrl    │
└──────┬──────┘     └──────┬───┬──┘     └─────────────┘
       │                   │   │
       │    ┌──────────┐   │   │    ┌──────────────┐
       │───<│  LIKES   │>──┘   └──<│  COMMENTS    │
       │    │──────────│           │──────────────│
       │    │ id (PK)  │           │ id (PK)      │
       │    │ postId(FK)│           │ postId (FK)  │
       │    │ userId(FK)│           │ userId (FK)  │
       │    └──────────┘           │ text         │
       │                           └──────────────┘
       │    ┌──────────────┐   ┌──────────────┐
       │───<│ SAVED_POSTS  │   │  FOLLOWERS   │>───┐
            │──────────────│   │──────────────│    │
            │ id (PK)      │   │ id (PK)      │    │
            │ postId (FK)  │   │ followerId(FK)│───┘
            │ userId (FK)  │   │ followingId(FK)│
            └──────────────┘   └──────────────┘
```

### Key DBMS Concepts Demonstrated
- **Normalization**: 3NF — no transitive dependencies
- **Foreign Keys**: All relationships use CASCADE on DELETE/UPDATE
- **Junction Tables**: likes, saved_posts, followers (M:N relationships)
- **Self-Referencing**: followers table (users follow users)
- **Indexes**: On all foreign keys and frequently queried columns
- **Unique Constraints**: Prevent duplicate likes, saves, and follows
- **CHECK Constraints**: Rating must be between 0.0 and 5.0
- **ENUM Types**: Post type restricted to 'post' or 'reel'

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MySQL 8.x
- npm

### 1. Clone and Setup
```bash
git clone <repo-url>
cd Crave-Food
```

### 2. Setup Database
```sql
-- In MySQL CLI:
CREATE DATABASE food_creed;
```

### 3. Configure Backend
```bash
cd backend
cp .env.example .env
# Edit .env with your MySQL credentials
npm install
```

**`.env` file:**
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=food_creed
JWT_SECRET=foodcreed_secret_key_2024
CLIENT_URL=http://localhost:5173
```

### 4. Configure Frontend
```bash
cd frontend
npm install
```

### 5. Start Both Servers
```bash
# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — Frontend
cd frontend && npm run dev
```

### 6. Open the App
Navigate to **http://localhost:5173**

**Demo Login:** `shankar@gmail.com` / `password123`

## 📝 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/posts` | Get all posts (paginated) |
| POST | `/api/posts` | Create new post |
| GET | `/api/posts/reels` | Get all reels |
| GET | `/api/posts/:id` | Get single post |
| GET | `/api/posts/user/:username` | Get user's posts |
| POST | `/api/likes/:postId/toggle` | Like/unlike post |
| POST | `/api/saves/:postId/toggle` | Save/unsave post |
| GET | `/api/saves` | Get saved posts |
| GET | `/api/comments/:postId` | Get post comments |
| POST | `/api/comments/:postId` | Add comment |
| POST | `/api/follows/:userId/toggle` | Follow/unfollow user |
| GET | `/api/follows/:userId/status` | Check follow status |
| GET | `/api/users/:username` | Get user profile |
| PUT | `/api/users/profile` | Update own profile |
| GET | `/api/users/search?q=` | Search users |
| GET | `/api/restaurants` | Get all restaurants |
| POST | `/api/upload/image` | Upload image |
| POST | `/api/upload/video` | Upload video |

## 👨‍💻 Author

**Crave Food** — Built with ❤️ for food lovers.
