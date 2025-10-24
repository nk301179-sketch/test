# Home4Paws - Login Related Frontend Files

This folder contains all the frontend files specifically related to the login functionality of the Home4Paws application. These files work together to provide user authentication, route protection, and login/logout capabilities.

## File Structure

```
login-files/
├── README.md                           # This file
├── package.json                        # Dependencies and scripts
└── src/
    ├── App.jsx                         # Main app component with routing
    ├── main.jsx                        # App entry point
    ├── index.css                       # Global styles
    ├── pages/
    │   └── Login.jsx                   # Login page component
    ├── contexts/
    │   └── AuthContext.jsx            # Authentication context provider
    └── components/
        ├── ProtectedRoute.jsx         # Route protection component
        └── Navbar.jsx                 # Navigation with login/logout links
```

## Core Files Description

### 🔐 **Login.jsx** - Main Login Page
- Contains the login form with username and password fields
- Handles form validation and error messages
- Integrates with AuthContext for authentication
- Redirects to dashboard after successful login
- Responsive design with Tailwind CSS

### 🔑 **AuthContext.jsx** - Authentication Management
- Provides authentication state management across the app
- Handles login/logout functionality
- Manages JWT tokens and local storage
- Makes API calls to backend authentication endpoints
- Provides user context to other components

### 🛡️ **ProtectedRoute.jsx** - Route Protection
- Protects secured routes from unauthenticated access
- Redirects users to login page if not authenticated
- Shows loading state while checking authentication

### 🧭 **Navbar.jsx** - Navigation Component
- Contains login/logout buttons
- Shows different navigation based on authentication status
- Uses AuthContext to determine user state

## Supporting Files

### **App.jsx** - Main Application Component
- Defines routing structure including `/login` route
- Integrates AuthContext provider
- Handles app-wide loading states

### **main.jsx** - Application Entry Point
- Wraps app with necessary providers (AuthProvider, Router)
- Renders the main App component

### **index.css** - Global Styles
- Contains Tailwind CSS imports
- Global styling that affects login page appearance

### **package.json** - Dependencies
- Lists all required npm packages
- Includes React, React Router, Axios, Lucide React icons, etc.

## Key Dependencies

The login functionality relies on these key packages:
- `react` & `react-dom` - Core React framework
- `react-router-dom` - Client-side routing
- `axios` - HTTP client for API calls
- `lucide-react` - Icons used in login form
- `@tailwindcss/forms` - Form styling

## Authentication Flow

1. **Login Page**: User enters credentials in `Login.jsx`
2. **AuthContext**: Handles API call to backend authentication endpoint
3. **Token Storage**: JWT token stored in localStorage
4. **Route Protection**: `ProtectedRoute.jsx` checks authentication status
5. **Navigation**: `Navbar.jsx` updates to show logout option
6. **Persistence**: Authentication state persists across page refreshes

## API Integration

The login system expects these backend endpoints:
- `POST /api/auth/login` - Login with username/password
- `GET /api/users/me` - Get current user information

## Usage

These files can be integrated into any React application that needs authentication. Key integration points:

1. Wrap your app with `AuthProvider` from `AuthContext.jsx`
2. Use `ProtectedRoute` to protect secured routes
3. Import and use the `Login` component for the login page
4. Update API endpoints in `AuthContext.jsx` to match your backend

## Notes

- All files use ES6+ syntax and React hooks
- Tailwind CSS is used for styling
- Error handling is built into the login flow
- Responsive design works on mobile and desktop
- Loading states provide good UX during authentication