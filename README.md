# Hono Drizzle OpenAPI Bun Starter

A modern, high-performance API starter template combining Hono, Drizzle ORM, OpenAPI documentation, and Bun runtime.

## Features
- Hono - Fast, lightweight web framework for Bun
- Drizzle ORM - Type-safe, lightweight ORM for PostgreSQL
- OpenAPI - API specification and documentation
- Bun - Fast JavaScript runtime and package manager
- Authentication - Complete auth flow with JWT
- Rate Limiting - Built-in request rate limiting
- Request Validation - Comprehensive validation using Zod
- i18n Support - Internationalization ready
- Redis Integration - For caching and rate limiting
- API Reference UI - Interactive API documentation

## Prerequisites
- Bun (latest version)
- PostgreSQL database
- Redis server

## Getting Started

### Installation

```bash
# Clone the repository
git clone https://github.com/de-n3xus/hono-drizzle-openapi-bun-starter.git  
cd hono-drizzle-openapi-bun-starter

# Install dependencies
bun install
```

### Environment Variables

Create a .env file in the root directory and add the following variables:

```dotenv
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# Redis
REDIS_HOST=localhost  
REDIS_PORT=6379  
REDIS_USERNAME=  
REDIS_PASSWORD=  
REDIS_DB=0

# Server
PORT=3000
```

### Database Setup

Initialize your database schema:

```bash
# Generate migration files
bun db:generate

# Push schema changes to database
bun db:push
```

### Running the Application

```bash
# Development mode with hot reloading
bun dev

# Production mode
bun src/index.ts
```

## Database

The project uses Drizzle ORM with PostgreSQL. The schema includes:
- User table - Stores user information
- Session table - Manages authentication sessions

Database Commands

```bash
# Generate migration files
bun db:generate

# Push schema changes to database
bun db:push

# Run migrations
bun db:migrate

# Open Drizzle Studio
bun db:studio
```

## API Structure

### Authentication Routes

The API includes complete authentication flows:
- POST /auth/signin - User login
- POST /auth/signup - User registration
- POST /auth/refresh - Refresh access token
- POST /auth/logout - User logout

### User Routes
- User management endpoints are available at /user

### Middleware
- Authentication - Protects secure routes
- Rate Limiting - Prevents abuse
- CORS - Cross-Origin Resource Sharing
- Request ID - Adds unique identifiers to requests
- Logging - Request logging

## API Documentation

Interactive API documentation is available at:
- OpenAPI specs: /openapi
- Scalar API Reference UI: /ui

## Validation

All API endpoints are validated using Zod schemas:

```typescript
// Example validation schema for signin  
export const authSigninSchema = z.object({
	email: z
		.string({
			invalid_type_error: 'Неверная почта',
			required_error: 'Введите почту',
		})
		.email('Неверная почта'),
	password: z
		.string({
			invalid_type_error: 'Неверный тип пароля',
			required_error: 'Введите пароль',
		})
		.min(8, 'Минимальная длина пароля - 8 символов')
		.max(52, 'Максимальная длина пароля - 52 символа'),
})
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License
Published under the [MIT](https://github.com/de-n3xus/hono-drizzle-openapi-bun-starter/blob/main/LICENSE) license.

