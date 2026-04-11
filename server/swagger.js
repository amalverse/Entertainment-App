const swaggerJSDoc = require("swagger-jsdoc");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "BingeHub.app API",
    version: "1.0.0",
    description: "API documentation for the BingeHub.app backend.",
    contact: {
      name: "BingeHub.app",
    },
  },
  servers: [
    {
      url: "http://localhost:5000",
      description: "Local development server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      ErrorResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          message: { type: "string", example: "Route not found" },
        },
      },
      AuthRegister: {
        type: "object",
        required: ["username", "email", "password"],
        properties: {
          username: { type: "string", example: "john_doe" },
          email: { type: "string", format: "email", example: "john@example.com" },
          password: { type: "string", example: "securePassword123" },
        },
      },
      AuthLogin: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email", example: "john@example.com" },
          password: { type: "string", example: "securePassword123" },
        },
      },
      TokenResponse: {
        type: "object",
        properties: {
          token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
          user: {
            type: "object",
            properties: {
              _id: { type: "string", example: "507f1f77bcf86cd799439011" },
              username: { type: "string", example: "john_doe" },
              email: { type: "string", format: "email", example: "john@example.com" },
            },
          },
        },
      },
      Bookmark: {
        type: "object",
        properties: {
          tmdbId: { type: "integer", example: 550 },
          type: { type: "string", example: "movie" },
          title: { type: "string", example: "Fight Club" },
          poster: { type: "string", example: "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg" },
        },
      },
      BookmarkRequest: {
        type: "object",
        required: ["tmdbId", "type", "title", "poster"],
        properties: {
          tmdbId: { type: "integer", example: 550 },
          type: { type: "string", example: "movie" },
          title: { type: "string", example: "Fight Club" },
          poster: { type: "string", example: "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg" },
        },
      },
      UserProfile: {
        type: "object",
        properties: {
          _id: { type: "string", example: "507f1f77bcf86cd799439011" },
          username: { type: "string", example: "john_doe" },
          email: { type: "string", format: "email", example: "john@example.com" },
          profileImage: { type: "string", example: "/uploads/profileImage-1234567890-123456789.jpg" },
          bookmarks: {
            type: "array",
            items: { $ref: "#/components/schemas/Bookmark" },
          },
        },
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
  tags: [
    { name: "Auth", description: "Authentication operations" },
    { name: "Bookmarks", description: "Bookmark management" },
    { name: "User", description: "User profile operations" },
  ],
  paths: {
    "/api/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register a new user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AuthRegister" },
            },
          },
        },
        responses: {
          200: {
            description: "Registration successful",
            content: { "application/json": { schema: { type: "object" } } },
          },
          400: { description: "Bad request" },
        },
      },
    },
    "/api/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login with email and password",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AuthLogin" },
            },
          },
        },
        responses: {
          200: {
            description: "Login successful",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/TokenResponse" },
              },
            },
          },
          401: { description: "Unauthorized" },
        },
      },
    },
    "/api/auth/verify/{token}": {
      get: {
        tags: ["Auth"],
        summary: "Verify email address",
        parameters: [
          {
            name: "token",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Email verification token",
          },
        ],
        responses: {
          200: { description: "Email verified successfully" },
          400: { description: "Invalid or expired token" },
        },
      },
    },
    "/api/auth/forgot-password": {
      post: {
        tags: ["Auth"],
        summary: "Request a password reset link",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email"],
                properties: {
                  email: { type: "string", format: "email", example: "user@example.com" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Password reset email sent" },
        },
      },
    },
    "/api/auth/reset-password/{token}": {
      post: {
        tags: ["Auth"],
        summary: "Reset password using a token",
        parameters: [
          {
            name: "token",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["password"],
                properties: {
                  password: { type: "string", example: "newPassword123" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Password reset successfully" },
        },
      },
    },
    "/api/auth/google": {
      post: {
        tags: ["Auth"],
        summary: "Login or register with Google OAuth code",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["code"],
                properties: {
                  code: { type: "string", example: "authorization_code_from_google" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Google login successful",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/TokenResponse" },
              },
            },
          },
        },
      },
    },
    "/api/bookmarks": {
      get: {
        tags: ["Bookmarks"],
        summary: "Get all bookmarks for the authenticated user",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Bookmark list returned successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    bookmarks: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Bookmark" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Bookmarks"],
        summary: "Add a bookmark for the authenticated user",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/BookmarkRequest" },
            },
          },
        },
        responses: {
          200: { description: "Bookmark added successfully" },
        },
      },
    },
    "/api/bookmarks/{id}": {
      delete: {
        tags: ["Bookmarks"],
        summary: "Remove a bookmark by TMDB ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "TMDB ID of the bookmark to remove",
          },
        ],
        responses: {
          200: { description: "Bookmark removed successfully" },
        },
      },
    },
    "/api/user/profile": {
      get: {
        tags: ["User"],
        summary: "Get the authenticated user's profile",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "User profile returned successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UserProfile" },
              },
            },
          },
        },
      },
      put: {
        tags: ["User"],
        summary: "Update the authenticated user's profile",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: false,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  username: { type: "string", example: "new_username" },
                  email: { type: "string", format: "email", example: "new@email.com" },
                  password: { type: "string", example: "newPassword123" },
                  profileImage: { type: "string", format: "binary" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "User profile updated successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UserProfile" },
              },
            },
          },
        },
      },
      delete: {
        tags: ["User"],
        summary: "Delete the authenticated user's account",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "User account deleted successfully" },
        },
      },
    },
  },
};

const swaggerSpecBase = swaggerJSDoc({
  definition: swaggerDefinition,
  apis: [],
});

const getSwaggerSpec = (baseUrl) => ({
  ...swaggerSpecBase,
  servers: [
    {
      url: baseUrl,
      description: "API server",
    },
  ],
});

module.exports = { getSwaggerSpec };
