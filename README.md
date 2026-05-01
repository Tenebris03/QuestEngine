# QuestEngine

A fitness quest generator application with AI-powered training plan generation. QuestEngine creates personalized weekly workout plans based on user preferences, using either client-side WebLLM (local AI) or algorithmic generation.

## Features

- **AI-Powered Generation**: Uses WebLLM (Llama-3.2-1B-Instruct) running entirely in the browser for personalized training plans
- **Personalized Workouts**: Customizes plans based on fitness goals, available time, equipment, intensity, and experience level
- **Weekly Quests**: Creates 5 or 7-day workout programs ("quests") with exercises, sets, reps, and rest periods
- **Progress Tracking**: Mark quests as completed and track your fitness journey
- **Multi-Language Support**: Full i18n support for German and English
- **JWT Authentication**: Secure user authentication with registration and login
- **Modern Stack**: Built with React 19, NestJS, TypeScript, and CSS Modules

## Tech Stack

| Layer | Technology | Notes |
|-------|------------|-------|
| **Backend** | NestJS | TypeScript-first Node.js framework |
| **Database** | PostgreSQL | Via Docker and TypeORM |
| **Authentication** | JWT + Passport | Secure API authentication |
| **Frontend** | React 19 | With Vite and TypeScript (Strict) |
| **Styling** | CSS Modules | Zero-runtime, locally scoped styles |
| **I18n** | i18next | Co-located translations |
| **AI** | WebLLM | Client-side LLM for plan generation |

## Prerequisites

- Node.js 20.x or higher
- Docker and Docker Compose
- A WebGPU-capable browser (Chrome/Edge) for AI features

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd QuestEngine-1
```

### 2. Set up the backend

```bash
cd backend
npm install
```

### 3. Set up the frontend

```bash
cd frontend
npm install
```

### 4. Set up environment variables

Create a `.env` file in `backend/` based on the example:

```bash
cp backend/.env.example backend/.env
```

Edit the `.env` file with your database credentials:

```env
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=password
DATABASE_NAME=questengine

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRATION=1d

# App
PORT=3000
FRONTEND_URL=http://localhost:5173
```

## Running the Application

### Using Docker Compose (Recommended)

Start the PostgreSQL database:

```bash
docker-compose up -d
```

This starts a PostgreSQL 15 container on port 5432.

### Running the Backend

```bash
cd backend
npm run start:dev
```

The backend API runs on `http://localhost:3000`.

### Running the Frontend

```bash
cd frontend
npm run dev
```

The frontend runs on `http://localhost:5173`.

### Running Both Simultaneously

In separate terminals:

```bash
# Terminal 1: Database
docker-compose up -d

# Terminal 2: Backend
cd backend && npm run start:dev

# Terminal 3: Frontend
cd frontend && npm run dev
```

## Project Structure

```
QuestEngine-1/
├── backend/                 # NestJS API
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   │   ├── dto/        # Data Transfer Objects
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── jwt-auth.guard.ts
│   │   │   └── jwt.strategy.ts
│   │   ├── users/          # User management
│   │   │   ├── user.entity.ts
│   │   │   ├── users.module.ts
│   │   │   └── users.service.ts
│   │   ├── app.controller.ts
│   │   ├── app.module.ts
│   │   ├── app.service.ts
│   │   └── main.ts
│   └── package.json
├── frontend/               # React 19 application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   │   ├── Card/
│   │   │   ├── Footer/
│   │   │   ├── Header/
│   │   │   ├── PreferenceForm/
│   │   │   ├── QuestCard/
│   │   │   └── WeeklyOverview/
│   │   ├── pages/        # Page components
│   │   │   ├── Auth/
│   │   │   ├── Dashboard/
│   │   │   ├── Home/
│   │   │   ├── QuestGenerator/
│   │   │   └── Settings/
│   │   ├── services/     # Business logic
│   │   │   ├── LocalAIService.ts   # WebLLM integration
│   │   │   └── QuestGeneratorService.ts
│   │   ├── context/      # React Context
│   │   │   └── UserContext.tsx
│   │   ├── hooks/       # Custom hooks
│   │   ├── types/       # TypeScript definitions
│   │   └── theme/      # Global styles
│   └── package.json
├── docker-compose.yml     # PostgreSQL setup
└── README.md
```

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Login and get JWT token |
| GET | `/auth/profile` | Get current user profile (protected) |

### Request/Response Formats

#### Register
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123", "name": "John Doe"}'
```

#### Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'
```

Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Testing

### Backend Tests

```bash
cd backend
npm run test           # Unit tests
npm run test:e2e       # E2E tests
npm run test:cov       # With coverage
```

### Frontend Tests

```bash
cd frontend
npm run test          # Run tests in watch mode
npm run test:run       # Run tests once
npm run test:ui       # Run tests with UI
npm run test:coverage # With coverage
```

## Building for Production

### Backend

```bash
cd backend
npm run build
npm run start:prod
```

### Frontend

```bash
cd frontend
npm run build
npm run preview
```

## Browser Support

For AI features (WebLLM), a WebGPU-capable browser is required:
- Chrome 113+
- Edge 113+
- (WebGPU support is experimental in Firefox and Safari)

The application works without WebGPU but uses algorithmic generation instead of AI.

## Contributing

1. Follow the coding standards in `agents/CODING_STANDARDS.md`
2. Run linting before committing:
   ```bash
   cd backend && npm run lint
   cd frontend && npm run lint
   ```
3. Ensure all tests pass

## License

MIT
