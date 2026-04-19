# Database Design

This backend uses MongoDB with a single main collection: `User`.

## Entity Relationship Diagram

```mermaid
erDiagram
    USER {
        ObjectId _id
        String username
        String name
        String email
        String password
        String authProvider
        String googleId
        String profileImage
        String tmdbSessionId
        String tmdbAccountId
        Boolean isVerified
        String verificationToken
        Date verificationTokenExpires
        String resetPasswordToken
        Date resetPasswordExpires
        Date createdAt
        Date updatedAt
    }

    BOOKMARK {
        Number tmdbId
        String type
        String title
        String poster
    }

    WATCHED_ITEM {
        Number tmdbId
        String type
        String title
        String poster
        Date watchedAt
    }

    USER ||--o{ BOOKMARK : has
    USER ||--o{ WATCHED_ITEM : has
```

## Notes

- `bookmarks` and `watchedList` are stored as embedded arrays inside the `User` document.
- This is a document-based design optimized for fast access to a single user's data.
- The schema is defined in `server/models/User.js`.

## API Flow Diagram

```mermaid
flowchart TD
    Client -->|POST /api/auth/register| AuthController[Auth Controller]
    Client -->|POST /api/auth/login| AuthController
    Client -->|GET /api/auth/verify/:token| AuthController
    Client -->|POST /api/auth/forgot-password| AuthController
    Client -->|POST /api/auth/reset-password/:token| AuthController
    Client -->|POST /api/auth/google| AuthController

    Client -->|GET /api/bookmarks| BookmarkController[Bookmark Controller]
    Client -->|POST /api/bookmarks| BookmarkController
    Client -->|DELETE /api/bookmarks/:id| BookmarkController

    Client -->|GET /api/user/profile| UserController[User Controller]
    Client -->|PUT /api/user/profile| UserController
    Client -->|DELETE /api/user/profile| UserController

    AuthController -->|creates/verifies user| UserDB[(User Collection)]
    BookmarkController -->|reads/writes bookmarks| UserDB
    UserController -->|reads/writes profile| UserDB

    subgraph Authentication
      AuthController
    end

    subgraph Protected Routes
      BookmarkController
      UserController
    end

    BookmarkController -->|requires Bearer token| AuthMiddleware[Auth Middleware]
    UserController -->|requires Bearer token| AuthMiddleware
```

### API Flow Notes

- `AuthController` handles user signup, login, email verification, password reset, and Google OAuth.
- `BookmarkController` uses `AuthMiddleware` to protect bookmark CRUD operations.
- `UserController` uses `AuthMiddleware` to protect profile read/update/delete operations.
- All protected routes read/write the same `User` document.


