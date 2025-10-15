# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

### Core Development
```bash
npm run dev          # Start development server with Vite + HMR
npm run build        # Build production bundle
npm run preview      # Preview production build locally
npm run lint         # Run ESLint for code quality checks
```

### Testing
No test framework is currently configured in this project.

## Architecture Overview

This is a React e-commerce application built with Vite, featuring both customer-facing and admin interfaces.

### Tech Stack
- **Frontend**: React 19.1.1 with Vite for build tooling
- **Styling**: TailwindCSS 4.x (using @tailwindcss/vite plugin)
- **State Management**: Redux Toolkit with Redux Persist for data persistence
- **Database**: Supabase (PostgreSQL) for backend services
- **Authentication**: Firebase Auth with Google provider
- **Routing**: React Router v7 with nested routing structure
- **Data Fetching**: TanStack Query (React Query) for server state management
- **UI Components**: Various third-party libraries (react-slick, rc-drawer, react-select, etc.)

### Key Application Structure

#### State Management Architecture
- **Redux Store**: Centralized state with persistence using redux-persist
- **Main Slice**: `espremium` reducer handles core application state including user favorites
- **Context Providers**: LocationProvider for tracking user navigation context

#### Routing Architecture
The app uses a sophisticated nested routing structure:

**Main Route Structure:**
- `/` - Public routes (home, shop, products, cart, auth)
  - `/profil/*` - User dashboard and account management (protected)
  - `/boutique` - Product catalog
  - `/produit/:slug/*` - Individual product pages
  - `/cart` - Shopping cart
- `/checkout` - Checkout process (separate layout)
- `/admin/*` - Admin panel (protected with ProtectedRoute component)

**Layout Hierarchy:**
- `Root` → `LocationProvider` → route-specific layouts
- `FirstLayout` - Main public site wrapper
- `Layout` - User profile section wrapper
- `AdminLayout` - Admin panel wrapper

#### Data Layer
- **Supabase Integration**: Main database operations through `supase-client.js`
- **Firebase**: Authentication services only
- **Query Functions**: Centralized in `src/utils/queries.js` for reusable data operations

#### Component Organization
- `src/components/` - Reusable UI components
- `src/components/Acceuil/` - Homepage-specific components
- `src/routes/` - Page-level components
- `src/routes/Admin/` - Admin panel pages
- `src/routes/Profil/` - User profile pages

### Environment Configuration
- Uses Vite environment variables (`import.meta.env.VITE_*`)
- Supabase configuration in root-level `supase-client.js`
- Firebase config exposed in `src/config/firebase.js` (contains API keys)

### Key Features
- **E-commerce**: Product catalog, shopping cart, user accounts
- **Admin Panel**: Product management, order management, user management
- **Authentication**: Firebase Auth with email verification flow
- **Favorites System**: Users can save products to favorites (stored in Supabase)
- **Responsive Design**: Built with TailwindCSS
- **File Handling**: Image resizing, PDF generation capabilities

### Development Notes
- No TypeScript - pure JavaScript/JSX codebase
- ESLint configured with React-specific rules
- Uses modern React patterns (hooks, functional components)
- Supabase handles backend API operations
- Redux state persists between sessions