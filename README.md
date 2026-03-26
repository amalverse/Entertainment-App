# 🎬 BingeHub.app

A full-stack web application for discovering, searching, and bookmarking movies and TV shows. Browse trending content from TMDB (The Movie Database), manage your watchlist, and explore comprehensive details with a modern, responsive interface.

![React](https://img.shields.io/badge/React-19.2.0-blue?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green?logo=mongodb)
![Vite](https://img.shields.io/badge/Vite-Latest-purple?logo=vite)

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running the Application](#-running-the-application)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Authentication](#-authentication)
- [Database Schema](#-database-schema)
- [Key Components](#-key-components)
- [Contributing](#-contributing)
- [License](#-license)

## 🎯 Overview

BingeHub.app is a modern entertainment discovery platform that leverages the power of TMDB API to provide users with access to thousands of movies and TV shows. The application features secure user authentication (both traditional and OAuth), personalized bookmarks, advanced search capabilities, and a beautiful responsive UI built with React and Tailwind CSS.

Whether you're looking to discover trending content, search for specific titles, or maintain a personalized watchlist, BingeHub.app provides an intuitive and engaging experience.

## ⭐ Features

### 🔐 Authentication & User Management
- **Traditional Authentication**: Email and password registration with email verification
- **OAuth 2.0 Integration**: Seamless Google and GitHub login
- **Email Verification**: Secure account activation via email verification tokens
- **Password Management**: Forgot password and password reset functionality
- **Profile Management**: Update profile information and manage profile images
- **Unique Usernames**: Automatically generated unique, lowercase usernames without spaces (works with OAuth too)

### 🎬 Content Discovery
- **Trending Movies**: Browse trending movies with real-time data from TMDB
- **Trending TV Shows**: Discover popular and trending TV series
- **Movie Details**: Comprehensive movie information including plot, cast, ratings, and more
- **TV Show Details**: In-depth TV series information with episodes and seasons
- **Advanced Search**: Full-text search across movies and TV shows with filters

### 📚 Bookmarking & Watchlist
- **Save Favorites**: Bookmark movies and TV shows for later viewing
- **Organized Bookmarks**: View all saved content in a dedicated bookmarks page
- **Quick Add/Remove**: One-click bookmark management
- **Persistent Storage**: Bookmarks are saved to user profile in the database

### 🎨 User Interface
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI**: Built with Tailwind CSS for a clean, professional look
- **Dark Theme**: Eye-friendly dark interface for extended browsing
- **Fast Navigation**: React Router for smooth, fast page transitions
- **Loading States**: Skeleton loaders and spinners for better UX
- **Toast Notifications**: Real-time user feedback for all actions

### 📊 Content Pages
- **Home Page**: Dashboard with trending content and quick navigation
- **Movies Page**: Browse and search all available movies
- **TV Series Page**: Browse television content
- **Search Results**: Dedicated page for search queries with filtering
- **Bookmarks Page**: View and manage saved content
- **User Profile**: View and edit user information

## 🏗️ Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React/Vite)                │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Pages: Home, Movies, TV, Details, Profile, etc  │  │
│  │  Components: Cards, Filter, Pagination, Sidebar  │  │
│  │  State: Redux (Auth, Movies, TV, Search, Books)  │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────┬──────────────────────────────────────┘
                  │ HTTPS/API Calls
                  ↓
┌─────────────────────────────────────────────────────────┐
│              Backend (Node.js/Express)                 │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Routes:                                         │  │
│  │  • /api/auth - Authentication & email verify    │  │
│  │  • /api/user - User profile management          │  │
│  │  • /api/bookmarks - Bookmark CRUD operations    │  │
│  ├──────────────────────────────────────────────────┤  │
│  │  Controllers: Auth, User, Bookmark Logic        │  │
│  ├──────────────────────────────────────────────────┤  │
│  │  Middleware: Auth, Error Handling, File Upload  │  │
│  ├──────────────────────────────────────────────────┤  │
│  │  Services:                                       │  │
│  │  • TMDB API Integration                         │  │
│  │  • Email Service (Nodemailer)                   │  │
│  │  • JWT Token Management                         │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────┬──────────────────────────────────────┘
                  │
        ┌─────────┴─────────┬────────────┐
        ↓                   ↓            ↓
    ┌────────┐        ┌──────────┐  ┌──────────┐
    │ MongoDB│        │ TMDB API │  │ Gmail    │
    │Database│        │(Movies)  │  │(Email)   │
    └────────┘        └──────────┘  └──────────┘
```

### Data Flow

```
Frontend                    Backend                Database
   │                          │                        │
   ├─── Register ───────────→ │                        │
   │                          ├─── Save User ────────→ │
   │                          ├─── Send Email          │
   │                          │                        │
   ├─ Verify Email Token ───→ │                        │
   │                          ├─── Verify & Update ──→ │
   │                          │                        │
   ├─── Login ────────────────→ │                        │
   │                          ├─── Check Credentials  │
   │                          │ ← ─ ─ Get User ────── ←
   │ ← ─── JWT Token ─────── ←│                        │
   │                          │                        │
   ├─ Google OAuth Signal ───→ │                        │
   │                          ├─── Verify Google Token
   │                          ├─── Find/Create User ──→ │
   │ ← ─── JWT Token ─────── ←│ ← ─ ─ Return User ─── ←
   │                          │                        │
```

## 🛠️ Tech Stack

### Frontend
- **React 19.2.0** - UI library for building interactive interfaces
- **Vite 7.2.4** - Next-generation frontend build tool
- **React Router DOM 6.20** - Client-side routing
- **Redux Toolkit 2.11** - State management
- **Axios 1.13** - HTTP client for API requests
- **Tailwind CSS 4.1** - Utility-first CSS framework
- **React Icons 5.5** - Icon library
- **React Toastify 11.0** - Toast notifications
- **Google OAuth 0.13** - OAuth authentication

### Backend
- **Node.js** - JavaScript runtime
- **Express 5.2** - Web framework
- **MongoDB 9.1** - NoSQL database
- **Mongoose 9.1** - MongoDB object modeling
- **JWT (jsonwebtoken 9.0)** - Token-based authentication
- **Bcryptjs 3.0** - Password hashing
- **Google Auth Library 10.5** - OAuth verification
- **Nodemailer 7.0** - Email service
- **Multer 2.0** - File upload handling
- **CORS 2.8** - Cross-origin resource sharing
- **Dotenv 17.2** - Environment variables

## 📦 Prerequisites

Ensure you have the following installed on your system:

- **Node.js** (v16 or higher)
- **npm** or **yarn** (latest version)
- **MongoDB** (v6.0 or higher) - local or cloud instance (MongoDB Atlas)
- **Git** for version control

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/bingehub.app.git
cd bingehub.app
```

### 2. Install Backend Dependencies

```bash
cd server
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../client
npm install
```

## ⚙️ Configuration

### Backend Configuration (.env)

Create a `.env` file in the `server` directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bingehub-app

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# Gmail Configuration (for email verification)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
EMAIL_FROM=noreply@bingehub.app

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# TMDB API Configuration
TMDB_API_KEY=your_tmdb_api_key
TMDB_BASE_URL=https://api.themoviedb.org/3

# Frontend URL (for CORS and redirects)
FRONTEND_URL=http://localhost:5173
```

**Obtaining Credentials:**
- **MongoDB**: Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **TMDB API Key**: Register at [TMDB](https://www.themoviedb.org/)
- **Google OAuth**: Set up at [Google Cloud Console](https://console.cloud.google.com/)
- **Gmail App Password**: Enable 2FA and create app password at [Google Account](https://myaccount.google.com/)

### Frontend Configuration (.env)

Create a `.env` file in the `client` directory:

```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

## 🏃 Running the Application

### Development Mode

**Terminal 1 - Backend Server:**
```bash
cd server
npm run dev
# Runs on http://localhost:5000
```

**Terminal 2 - Frontend Development Server:**
```bash
cd client
npm run dev
# Runs on http://localhost:5173
```

### Production Build

**Frontend:**
```bash
cd client
npm run build
npm run preview
```

**Backend:**
```bash
cd server
npm start
```

## 📁 Project Structure

### Frontend Structure
```
client/
├── src/
│   ├── components/
│   │   ├── cards/
│   │   │   ├── MovieCard.jsx       # Movie display card component
│   │   │   ├── TVCard.jsx          # TV show card component
│   │   │   └── TrendingCard.jsx    # Trending content card
│   │   ├── common/
│   │   │   ├── Filter.jsx          # Content filtering component
│   │   │   ├── Loader.jsx          # Loading spinner
│   │   │   ├── Pagination.jsx      # Pagination control
│   │   │   ├── ProtectedRoute.jsx  # Route protection wrapper
│   │   │   └── SearchBar.jsx       # Search input component
│   │   └── layout/
│   │       └── Sidebar.jsx         # Navigation sidebar
│   ├── pages/
│   │   ├── Home.jsx                # Landing/home page
│   │   ├── Movies.jsx              # Movies listing page
│   │   ├── TvSeries.jsx            # TV series listing page
│   │   ├── MovieDetails.jsx        # Movie detail page
│   │   ├── TVDetails.jsx           # TV series detail page
│   │   ├── SearchResults.jsx       # Search results page
│   │   ├── Bookmarks.jsx           # User bookmarks page
│   │   ├── Profile.jsx             # User profile page
│   │   ├── Login.jsx               # Login page
│   │   ├── Register.jsx            # Registration page
│   │   ├── ForgotPassword.jsx      # Forgot password page
│   │   ├── ResetPassword.jsx       # Reset password page
│   │   └── VerifyEmail.jsx         # Email verification page
│   ├── hooks/
│   │   ├── useAuth.js              # Authentication hook
│   │   ├── useBookmark.js          # Bookmark management hook
│   │   └── useFetchOnMount.js      # Data fetching hook
│   ├── redux/
│   │   ├── store.js                # Redux store configuration
│   │   └── features/
│   │       ├── auth/               # Auth state slice
│   │       ├── bookmarks/          # Bookmarks state slice
│   │       ├── movies/             # Movies state slice
│   │       ├── search/             # Search state slice
│   │       └── tv/                 # TV state slice
│   ├── services/
│   │   ├── axiosInstance.js        # Axios configuration
│   │   ├── tmdbAuthService.js      # TMDB authentication
│   │   └── tmdbService.js          # TMDB API service
│   ├── utils/
│   │   ├── formatDate.js           # Date formatting utility
│   │   ├── formatRating.js         # Rating formatting utility
│   │   ├── getImageUrl.js          # Image URL builder
│   │   ├── isBookmarked.js         # Bookmark checker
│   │   ├── storage.js              # Local storage utilities
│   │   └── truncateText.js         # Text truncation utility
│   ├── App.jsx                     # Root component
│   ├── main.jsx                    # Entry point
│   ├── index.css                   # Global styles
│   └── routes/
│       └── appRoutes.jsx           # Route definitions
├── public/                         # Static assets
├── index.html                      # HTML template
├── vite.config.js                  # Vite configuration
├── eslint.config.js                # ESLint configuration
├── tailwind.config.js              # Tailwind CSS config
└── package.json
```

### Backend Structure
```
server/
├── config/
│   ├── db.js                       # Database connection
│   └── jwt.js                      # JWT configuration
├── controllers/
│   ├── authController.js           # Auth logic (register, login, OAuth)
│   ├── userController.js           # User profile management
│   └── bookmarkController.js       # Bookmark CRUD operations
├── middleware/
│   ├── authMiddleware.js           # JWT verification middleware
│   ├── errorMiddleware.js          # Error handling middleware
│   └── uploadMiddleware.js         # File upload (Multer) configuration
├── models/
│   └── User.js                     # MongoDB user schema
├── routes/
│   ├── authRoutes.js               # Authentication endpoints
│   ├── userRoutes.js               # User profile endpoints
│   └── bookmarkRoutes.js           # Bookmark endpoints
├── services/
│   ├── tmdbAuthService.js          # TMDB session management
│   ├── tmdbService.js              # TMDB API integration
│   ├── generateUsername.js         # Unique username generation
│   └── sendEmail.js                # Email sending service
├── utils/
│   ├── generateToken.js            # JWT token generation
│   └── sendEmail.js                # Email utility
├── server.js                       # Express server setup
├── index.js                        # Entry point
└── package.json
```

## 🔌 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securePassword123"
}

Response: 201 Created
{
  "message": "Registration successful. Please check your email to verify your account."
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}

Response: 200 OK
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com",
    "profileImage": "url_to_image",
    "isVerified": true
  }
}
```

#### Verify Email
```http
GET /api/auth/verify/:token

Response: 200 OK
{
  "message": "Your email has been successfully verified! You can now login."
}
```

#### Google OAuth Login
```http
POST /api/auth/google
Content-Type: application/json

{
  "code": "google_auth_code"
}

Response: 200 OK
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "email": "john@example.com",
    "profileImage": "url_to_image",
    "isVerified": true
  }
}
```

#### Forgot Password
```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "john@example.com"
}

Response: 200 OK
{
  "message": "Password reset email sent"
}
```

#### Reset Password
```http
POST /api/auth/reset-password/:token
Content-Type: application/json

{
  "password": "newPassword123"
}

Response: 200 OK
{
  "message": "Password reset successful"
}
```

### User Endpoints

#### Get Profile
```http
GET /api/user/profile
Authorization: Bearer {token}

Response: 200 OK
{
  "id": "507f1f77bcf86cd799439011",
  "username": "john_doe",
  "email": "john@example.com",
  "name": "John Doe",
  "profileImage": "url",
  "bookmarks": [...]
}
```

#### Update Profile
```http
PUT /api/user/profile
Authorization: Bearer {token}
Content-Type: multipart/form-data

Fields:
- name: "John Doe Updated"
- profileImage: <file>

Response: 200 OK
{
  "message": "Profile updated successfully",
  "user": {...}
}
```

#### Delete Account
```http
DELETE /api/user/profile
Authorization: Bearer {token}

Response: 200 OK
{
  "message": "User account deleted successfully"
}
```

### Bookmark Endpoints

#### Get All Bookmarks
```http
GET /api/bookmarks
Authorization: Bearer {token}

Response: 200 OK
{
  "bookmarks": [
    {
      "tmdbId": 550,
      "type": "movie",
      "title": "Fight Club",
      "poster": "url"
    }
  ]
}
```

#### Add Bookmark
```http
POST /api/bookmarks
Authorization: Bearer {token}
Content-Type: application/json

{
  "tmdbId": 550,
  "type": "movie",
  "title": "Fight Club",
  "poster": "url"
}

Response: 201 Created
{
  "message": "Bookmark added successfully"
}
```

#### Remove Bookmark
```http
DELETE /api/bookmarks/:tmdbId
Authorization: Bearer {token}

Response: 200 OK
{
  "message": "Bookmark removed successfully"
}
```

## 🔐 Authentication

### JWT Token-Based Authentication

The application uses JWT (JSON Web Tokens) for secure, stateless authentication:

1. **User registers/logs in** → Server generates JWT token
2. **JWT stored** in frontend (localStorage/sessionStorage)
3. **Token sent** with each API request in Authorization header
4. **Server validates** token before processing request
5. **Token refresh** handled automatically on token expiry

**Token Structure:**
```javascript
{
  "userId": "507f1f77bcf86cd799439011",
  "iat": 1234567890,     // Issued at
  "exp": 1234654290      // Expiration (7 days)
}
```

### OAuth 2.0 (Google Authentication)

Google OAuth integration allows users to sign up/login with their Google accounts:

1. **Frontend initiates** Google OAuth flow
2. **User authenticates** with Google
3. **Authorization code** sent to backend
4. **Backend verifies** code with Google servers
5. **User auto-linked** or created if new
6. **JWT token issued** for seamless login

**Key Features:**
- Auto-verified accounts (no email verification needed)
- Profile image auto-populated from Google
- Unique usernames automatically generated
- Existing email accounts can be linked to Google

## 📊 Database Schema

### User Model

```javascript
{
  _id: ObjectId,
  username: {
    type: String,
    required: true,
    unique: true,        // Ensures each username is unique
    lowercase: true,     // Stores as lowercase
    trim: true           // Removes whitespace
  },
  name: String,
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: String,      // Required for local auth only
  authProvider: {        // "local" or "google"
    type: String,
    enum: ["local", "google"],
    default: "local"
  },
  googleId: String,      // For OAuth users
  profileImage: String,
  bookmarks: [
    {
      tmdbId: Number,
      type: String,      // "movie" or "tv"
      title: String,
      poster: String
    }
  ],
  isVerified: Boolean,
  verificationToken: String,
  verificationTokenExpires: Date,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Key Validations:
- **Unique Email**: Each user has a unique email
- **Unique Username**: Each username is unique and lowercase
- **No Spaces in Username**: Automatically cleaned during creation/OAuth
- **Required Password**: Only for local authentication
- **Auto-verified OAuth**: Users logging in with OAuth are auto-verified

## 🎨 Key Components

### Frontend Components

#### Pages
- **Home**: Trending showcase with featured content
- **Movies/TV Series**: Paginated listings with filters
- **Details Pages**: Comprehensive info with cast, ratings, reviews
- **Search Results**: Dynamic filtered results
- **Bookmarks**: User's saved content library
- **Profile**: User information and settings
- **Auth Pages**: Register, Login, Password recovery, Email verification

#### Common Components
- **MovieCard/TVCard**: Responsive content cards with hover effects
- **SearchBar**: Real-time search with suggestions
- **Filter**: Genre, year, rating filters
- **Pagination**: Navigation for large datasets
- **Loader**: Skeleton screens for loading states
- **ProtectedRoute**: Route guard for authenticated pages

### Backend Features

#### Controllers
- **authController**: Handles registration, login, OAuth, password management
- **userController**: Manages user profiles and settings
- **bookmarkController**: CRUD operations for bookmarks

#### Middleware
- **authMiddleware**: JWT verification and user injection
- **errorMiddleware**: Global error handling
- **uploadMiddleware**: File upload with size/type validation

#### Services
- **tmdbService**: Movie/TV data fetching from TMDB API
- **generateUsername**: Creates unique, validated usernames
- **sendEmail**: Nodemailer integration for emails

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Coding Standards
- Follow existing code style
- Write meaningful commit messages
- Add comments for complex logic
- Test features before submitting PR

## 📝 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 🙋 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Contact: amal.kishoor@example.com

---

**Made with ❤️ by Amal Kishor**

**Last Updated**: March 2026

