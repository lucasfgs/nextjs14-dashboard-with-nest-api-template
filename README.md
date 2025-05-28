# Frontend Application

A Next.js-based frontend application with authentication, role-based access control, and modern UI components. This is part of a full-stack application with a [NestJS backend](https://github.com/lucasfgs/nestjs-template).

## Features

- 🔐 Secure authentication with JWT and refresh tokens
- 🎨 Modern UI with Tailwind CSS
- 🔄 Automatic token refresh handling
- 🍪 Cookie-based token management
- 🛡️ Protected routes and middleware
- 📱 Responsive design
- 🔍 TypeScript for better development experience
- 🧩 Modular component architecture

## Prerequisites

- Node.js (v16 or higher)
- Yarn package manager
- Backend API running (see backend README)

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# API Configuration
NEXT_PUBLIC_API_URL="http://localhost:4000"
APP_PREFIX=""

# Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"
```

## Installation

```bash
# Install dependencies
$ yarn install

# Run development server
$ yarn dev
```

## Project Structure

```
src/
├── app/                    # Next.js 13+ app directory
│   ├── (auth)/            # Authentication routes
│   │   ├── login/         # Login page
│   │   └── ...
│   ├── api/               # API routes
│   └── ...
├── components/            # Reusable components
│   ├── ui/               # UI components
│   └── ...
├── configs/              # Configuration files
│   ├── api.ts           # API client configuration
│   └── ...
├── middlewares/          # Next.js middlewares
│   └── authentication.ts # Auth middleware
└── utils/               # Utility functions
```

## Authentication Flow

1. **Login**
   - User submits credentials
   - Backend validates and returns tokens
   - Tokens are stored in cookies
   - Access token is used for API requests

2. **Token Refresh**
   - Automatic refresh on 401 responses
   - Uses refresh token from cookies
   - Updates access token cookie
   - Retries failed request

3. **Protected Routes**
   - Middleware checks authentication
   - Redirects to login if not authenticated
   - Passes user info via headers

## API Integration

The frontend uses a custom API client that:
- Handles authentication automatically
- Manages token refresh
- Provides type-safe API calls
- Handles errors consistently

Example usage:
```typescript
import api from '@/configs/api';

// Make authenticated request
const { data } = await api.get('/protected-route');
```

## Development

```bash
# Start development server
$ yarn dev

# Build for production
$ yarn build

# Start production server
$ yarn start

# Run tests
$ yarn test
```

## Styling

- Tailwind CSS for utility-first styling
- Custom components for consistent UI
- Responsive design patterns
- Dark mode support

## Best Practices

- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Husky for pre-commit hooks

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## License

This project is [MIT licensed](LICENSE).
