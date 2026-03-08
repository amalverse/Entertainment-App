server/
│
├── config/
│ ├── db.js # MongoDB connection
│ └── jwt.js # JWT config
│
├── controllers/
│ ├── authController.js
│ ├── bookmarkController.js
│ └── userController.js
│
├── models/
│ └── User.js
│
├── routes/
│ ├── authRoutes.js
│ ├── bookmarkRoutes.js
│ └── userRoutes.js
│
├── middleware/
│ ├── authMiddleware.js
│ └── errorMiddleware.js
│
├── utils/
│ ├── generateToken.js
│ └── hashPassword.js
│
├── index.js # Express app config
├── server.js # Server entry point
├── .env
└── package.json
