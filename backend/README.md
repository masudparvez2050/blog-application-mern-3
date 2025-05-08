# Blog Application Backend API

This is the backend server for a full-featured blog application built with Express.js and MongoDB. It provides robust APIs for authentication, user management, post creation and management, commenting, and administrative functions.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
  - [Authentication](#authentication)
  - [User Management](#user-management)
  - [Posts](#posts)
  - [Comments](#comments)
  - [Categories](#categories)
  - [Admin](#admin)
- [Features](#features)
- [Error Handling](#error-handling)
- [Security](#security)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Cloudinary account (for image uploads)
- Gmail account or other email service (for sending emails)

### Installation

1. Clone the repository

```bash
git clone https://your-repository-url.git
cd blog-application-mern-3/backend
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables (see next section)

4. Start the development server

```bash
npm run dev
```

The server will run on port 5000 by default.

### Environment Variables

Create a `.env` file in the backend directory with the following variables:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/blog-app
JWT_SECRET=your_jwt_secret_key

# Frontend URL for email link generation
FRONTEND_URL=http://localhost:3000

# Email configuration
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-email-password

# OAuth credentials
GOOGLE_CLIENT_ID=your_google_client_id
FACEBOOK_APP_ID=your_facebook_app_id

# Cloudinary config
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## API Endpoints

### Authentication

| Method | Endpoint                              | Description                 | Access  |
| ------ | ------------------------------------- | --------------------------- | ------- |
| POST   | `/api/auth/register`                  | Register a new user         | Public  |
| POST   | `/api/auth/login`                     | Login user                  | Public  |
| POST   | `/api/auth/oauth/google`              | Authenticate with Google    | Public  |
| POST   | `/api/auth/oauth/facebook`            | Authenticate with Facebook  | Public  |
| GET    | `/api/auth/verify-email/:token`       | Verify email with token     | Public  |
| POST   | `/api/auth/resend-verification`       | Resend verification email   | Private |
| POST   | `/api/auth/forgot-password`           | Request password reset      | Public  |
| POST   | `/api/auth/reset-password/:token`     | Reset password              | Public  |
| GET    | `/api/auth/verify-reset-token/:token` | Verify reset token is valid | Public  |
| GET    | `/api/auth/profile`                   | Get user profile            | Private |
| PUT    | `/api/auth/profile`                   | Update user profile         | Private |

### User Management

| Method | Endpoint                            | Description                 | Access  |
| ------ | ----------------------------------- | --------------------------- | ------- |
| GET    | `/api/users/profile`                | Get current user profile    | Private |
| PUT    | `/api/users/profile`                | Update current user profile | Private |
| POST   | `/api/users/upload-profile-picture` | Upload profile picture      | Private |
| GET    | `/api/users`                        | Get all users               | Admin   |
| GET    | `/api/users/:id`                    | Get user by ID              | Admin   |
| PUT    | `/api/users/:id`                    | Update user                 | Admin   |
| DELETE | `/api/users/:id`                    | Delete user                 | Admin   |

### Posts

| Method | Endpoint                     | Description                     | Access  |
| ------ | ---------------------------- | ------------------------------- | ------- |
| GET    | `/api/posts`                 | Get all posts                   | Public  |
| GET    | `/api/posts/with-comments`   | Get posts with comments         | Public  |
| GET    | `/api/posts/:id`             | Get post by ID                  | Public  |
| GET    | `/api/posts/:id/similar`     | Get similar posts               | Public  |
| POST   | `/api/posts`                 | Create a new post               | Private |
| PUT    | `/api/posts/:id`             | Update post                     | Private |
| DELETE | `/api/posts/:id`             | Delete post                     | Private |
| PUT    | `/api/posts/:id/like`        | Like a post                     | Private |
| PUT    | `/api/posts/:id/dislike`     | Dislike a post                  | Private |
| GET    | `/api/posts/:id/like-status` | Get user's like status for post | Private |
| GET    | `/api/posts/user/posts`      | Get current user's posts        | Private |
| GET    | `/api/posts/user/:userId`    | Get posts by user ID            | Private |

### Comments

| Method | Endpoint                     | Description             | Access  |
| ------ | ---------------------------- | ----------------------- | ------- |
| GET    | `/api/comments/post/:postId` | Get comments for a post | Public  |
| POST   | `/api/comments`              | Add a comment           | Private |
| PUT    | `/api/comments/:id`          | Update a comment        | Private |
| DELETE | `/api/comments/:id`          | Delete a comment        | Private |
| PUT    | `/api/comments/:id/like`     | Like a comment          | Private |
| PUT    | `/api/comments/:id/dislike`  | Dislike a comment       | Private |

### Categories

| Method | Endpoint                     | Description           | Access |
| ------ | ---------------------------- | --------------------- | ------ |
| GET    | `/api/categories`            | Get all categories    | Public |
| GET    | `/api/categories/:id`        | Get category by ID    | Public |
| GET    | `/api/categories/slug/:slug` | Get category by slug  | Public |
| POST   | `/api/categories`            | Create a new category | Admin  |
| PUT    | `/api/categories/:id`        | Update category       | Admin  |
| DELETE | `/api/categories/:id`        | Delete category       | Admin  |

### Admin

| Method | Endpoint                          | Description              | Access |
| ------ | --------------------------------- | ------------------------ | ------ |
| GET    | `/api/admin/dashboard`            | Get admin dashboard data | Admin  |
| GET    | `/api/admin/users`                | Get all users            | Admin  |
| POST   | `/api/admin/users`                | Create a user            | Admin  |
| PUT    | `/api/admin/users/:id/activate`   | Activate user            | Admin  |
| PUT    | `/api/admin/users/:id/deactivate` | Deactivate user          | Admin  |
| PUT    | `/api/admin/users/:id/role`       | Update user role         | Admin  |
| GET    | `/api/admin/posts`                | Get all posts            | Admin  |
| PUT    | `/api/admin/posts/:id/status`     | Update post status       | Admin  |
| PUT    | `/api/admin/posts/:id/feature`    | Feature/unfeature post   | Admin  |
| GET    | `/api/admin/comments`             | Get all comments         | Admin  |
| PUT    | `/api/admin/comments/:id`         | Update comment status    | Admin  |
| DELETE | `/api/admin/comments/:id`         | Delete comment           | Admin  |
| GET    | `/api/admin/analytics`            | Get site analytics       | Admin  |

## Features

- **Authentication**: JWT-based authentication with refresh token mechanism
- **Email Verification**: Email verification for new user registration
- **OAuth Integration**: Login with Google and Facebook
- **Password Reset**: Secure password reset functionality
- **Role-Based Authorization**: Different access levels (user, admin)
- **User Management**: Complete user management system
- **Post Management**: Create, update, delete posts with rich text editor support
- **Comment System**: Threaded comments with like/dislike functionality
- **Category Management**: Organize posts by categories
- **Search & Filtering**: Search posts by keywords and filter by categories
- **Image Upload**: Profile picture and post image uploads with Cloudinary
- **Admin Dashboard**: Comprehensive admin dashboard with analytics

## Error Handling

The API implements a robust error handling mechanism with:

- Custom error middleware for formatting error responses
- JSON parsing error handling
- Global error handler
- Detailed error logging

## Security

- Password hashing with bcrypt
- JWT token authentication
- CORS configuration
- Input validation
- Rate limiting for sensitive endpoints
- XSS protection
