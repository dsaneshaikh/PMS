# Permission Management System

A comprehensive permission management system built with React, Redux Toolkit, and React Router. This system allows administrators to manage permissions, roles, and users while providing a tailored experience for users based on their assigned permissions.

## Features

### Admin Panel
- Create and manage permissions
- Create roles with specific permissions
- Manage users and assign roles to them
- Set login credentials for users

### User Panel
- Login with credentials provided by admin
- View personalized navigation menu based on assigned permissions
- Access feature pages based on permissions

## Technology Stack

- **Frontend Framework**: React
- **State Management**: Redux Toolkit
- **Routing**: React Router
- **Styling**: Tailwind CSS
- **Build Tool**: Vite

## Project Structure

The project follows a feature-based architecture:

```
src/
├── app/              # Application-wide configurations
├── features/         # Feature modules
│   ├── admin/        # Admin-specific features
│   ├── auth/         # Authentication features
│   └── user/         # User-specific features
├── shared/           # Shared components/utilities
└── utils/            # Utility functions
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```
