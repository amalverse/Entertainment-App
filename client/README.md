client/
│
├── public/
│ └── index.html
│
├── src/
│ │
│ ├── redux/ # Redux store configuration
│ │ │ ├── store.js
│ │ │ └── rootReducer.js
│ │ │
│ │ features/ # Redux Toolkit slices (feature-based)
│ │ │
│ │ ├── auth/
│ │ │ ├── authSlice.js
│ │ │ └── authApi.js
│ │ │
│ │ ├── movies/
│ │ │ ├── moviesSlice.js
│ │ │ └── moviesApi.js
│ │ │
│ │ ├── tv/
│ │ │ ├── tvSlice.js
│ │ │ └── tvApi.js
│ │ │
│ │ ├── bookmarks/
│ │ │ ├── bookmarksSlice.js
│ │ │ └── bookmarksApi.js
│ │ │
│ │ └── search/
│ │ └── searchSlice.js
│ │
│ ├── pages/ # Route-level pages
│ │ ├── Home.jsx
│ │ ├── Movies.jsx
│ │ ├── MovieDetails.jsx
│ │ ├── TVSeries.jsx
│ │ ├── TVDetails.jsx
│ │ ├── Bookmarks.jsx
│ │ ├── Login.jsx
│ │ └── Register.jsx
│ │
│ ├── components/ # Reusable UI components
│ │ ├── layout/
│ │ │ ├── Navbar.jsx
│ │ │ └── Sidebar.jsx
│ │ │
│ │ ├── common/
│ │ │ ├── SearchBar.jsx
│ │ │ ├── Loader.jsx
│ │ │ └── ProtectedRoute.jsx
│ │ │
│ │ └── cards/
│ │ ├── MovieCard.jsx
│ │ └── TVCard.jsx
│ │
│ ├── services/ # External services (TMDB, auth)
│ │ ├── tmdbService.js
│ │ └── axiosInstance.js
│ │
│ ├── hooks/ # Custom hooks
│ │ └── useAuth.js
│ │
│ ├── utils/ # Helper functions
│ │ └── formatDate.js
│ │
│ │
│ ├── routes/
│ │ └── AppRoutes.jsx
│ │
│ ├── index.css # Tailwind entry
│ ├── App.jsx
│ └── main.jsx
│
├── tailwind.config.js
├── postcss.config.js
└── package.json
