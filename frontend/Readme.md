# Bloggenix Frontend

A modern, feature-rich blog application frontend built with Next.js 13+ (App Router), React, Tailwind CSS, and Framer Motion.

## 🚀 Features

- **Modern UI/UX**: Clean, responsive design with engaging animations and transitions
- **User Authentication**: Email/password login and OAuth integration (Google, Facebook)
- **Role-Based Access Control**: Different interfaces and capabilities for regular users and administrators
- **Blog Content Management**: Create, edit, and manage blog posts with rich text editing
- **Interactive User Dashboard**: Track post statistics, manage content, and view performance metrics
- **Admin Dashboard**: Comprehensive management interface for content, users, comments, and analytics
- **Responsive Design**: Fully responsive layout adapting to all screen sizes
- **Commenting System**: Interactive comment section with replies, likes, and moderation
- **Category Management**: Organize and filter content by categories
- **Search Functionality**: Search posts by title, content, or tags

## 📋 Pages Overview

### Public Pages:

- **Home (`/`)**: Landing page with hero section, featured posts, and recent publications
- **Blogs (`/blogs`)**: Browse all blog posts with filters and search
- **Blog Details (`/blogs/[id]`)**: Individual blog post with comments and related content
- **About (`/about`)**: Information about the blog platform and team
- **Contact (`/contact`)**: Contact form and information

### Authentication:

- **Login (`/login`)**: User login with email/password and OAuth options
- **Register (`/register`)**: New user registration
- **Forgot Password (`/forgot-password`)**: Password reset request
- **Reset Password (`/reset-password/[token]`)**: Set new password with token
- **Email Verification (`/verify-email/[token]`)**: Verify email address

### User Area:

- **Dashboard (`/dashboard`)**: User dashboard with post stats and management
- **Create Post (`/dashboard/create-post`)**: Create new blog post with rich editor
- **Edit Post (`/dashboard/edit-post/[id]`)**: Edit existing blog post
- **Profile (`/profile`)**: User profile management

### Admin Area:

- **Admin Dashboard (`/admin`)**: Overview with key metrics and quick actions
- **Post Management (`/admin/posts`)**: List, filter, and manage all posts
- **Create Post (`/admin/posts/create`)**: Admin post creation interface
- **Edit Post (`/admin/posts/edit/[id]`)**: Admin post editing interface
- **User Management (`/admin/users`)**: List, create, and manage users
- **Comment Management (`/admin/comments`)**: Moderate and manage comments
- **Category Management (`/admin/category`)**: Create and manage categories
- **Analytics (`/admin/analytics`)**: Detailed performance metrics and data visualization

## 🛠️ Technology Stack

- **Framework**: Next.js 13+ (App Router)
- **UI Library**: React 18+
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State Management**: React Context API
- **Form Handling**: React Hook Form
- **Rich Text Editor**: React Quill
- **Authentication**: JWT, OAuth (Google, Facebook)
- **Data Fetching**: Native fetch API with SWR pattern
- **Icons**: React Icons (Font Awesome)
- **Charts**: Chart.js with React Chart.js 2

## 🏗️ Project Structure

```
frontend/
├── app/                    # Next.js app router structure
│   ├── components/         # Shared React components
│   │   ├── home/           # Homepage-specific components
│   │   ├── layout/         # Layout components (navbar, footer)
│   │   └── shared/         # Reusable UI components
│   ├── context/            # React Context providers
│   ├── data/               # Mock data for development/fallback
│   ├── fonts/              # Custom font files
│   ├── utils/              # Utility functions
│   ├── about/              # About page
│   ├── admin/              # Admin dashboard and related pages
│   ├── blogs/              # Blog listing and detail pages
│   ├── contact/            # Contact page
│   ├── dashboard/          # User dashboard and related pages
│   ├── login/              # Authentication pages
│   ├── profile/            # User profile page
│   ├── register/           # User registration page
│   ├── layout.js           # Root layout with providers
│   └── page.js             # Homepage
├── public/                 # Static assets
├── jsconfig.json           # JavaScript configuration
├── next.config.mjs         # Next.js configuration
├── package.json            # Project dependencies
├── postcss.config.mjs      # PostCSS configuration
└── tailwind.config.js      # Tailwind CSS configuration
```

## 💻 Getting Started

### Prerequisites

- Node.js 16.8.0 or newer
- npm, yarn or pnpm

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
NEXT_PUBLIC_FB_APP_ID=your_facebook_app_id
```

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
# or
yarn build
# or
pnpm build
```

## 🚀 Deployment

This project is configured for easy deployment on Vercel. For other platforms, refer to the [Next.js deployment documentation](https://nextjs.org/docs/deployment).

## 🔑 Authentication & Authorization

The app uses JWT for authentication with tokens stored in localStorage. OAuth integration with Google and Facebook is also available. Authentication state is managed via React Context.

Role-based access is implemented with protected routes requiring authentication to access user-specific content and admin privileges for administrative functions.

## 📱 Mobile Responsiveness

The application is fully responsive with:

- Mobile-first approach
- Dedicated mobile navigation
- Responsive layouts using Tailwind CSS
- Touch-friendly UI components

## 🎮 User Interaction Features

- Animated page transitions using Framer Motion
- Interactive components with hover, tap and focus states
- Toast notifications for user feedback
- Loading states and skeleton loaders
- Infinite scrolling for content lists
- Dynamic form validation
- Dropdowns and modal dialogs
- Rich text editing
