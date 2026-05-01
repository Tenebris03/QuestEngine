# TODO: Backend with Docker Postgres + User Management

## Phase 1: Backend Development

- [ ] 1.1 Install backend dependencies (typeorm, pg, jwt, passport, bcrypt, etc.)
- [ ] 1.2 Create User entity
- [ ] 1.3 Create UsersModule and UsersService
- [ ] 1.4 Create AuthModule with JWT authentication
- [ ] 1.5 Create DTOs (RegisterDto, LoginDto)
- [ ] 1.6 Update app.module.ts for TypeORM integration
- [ ] 1.7 Update main.ts with validation pipe

## Phase 2: Docker Setup

- [ ] 2.1 Create docker-compose.yml with PostgreSQL
- [ ] 2.2 Create .env file template

## Phase 3: Frontend Integration

- [ ] 3.1 Install axios in frontend
- [ ] 3.2 Update UserContext.tsx to call backend API
- [ ] 3.3 Add environment variable for backend URL

## Phase 4: Testing

- [ ] 4.1 Test backend build
- [ ] 4.2 Start Docker and verify connection
- [ ] 4.3 Test registration/login API
- [ ] 4.4 Test frontend login flow
