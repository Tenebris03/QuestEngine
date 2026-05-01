# Social Login Integration TODO

## Phase 1: Database & Dependencies
- [x] Update User entity with social ID columns (googleId, githubId, discordId)
- [x] Install OAuth packages: @nestjs/passport, passport, passport-google-oauth20, passport-github2, passport-discord

## Phase 2: Passport Strategies
- [x] Create Google OAuth strategy
- [x] Create GitHub OAuth strategy
- [x] Create Discord OAuth strategy

## Phase 3: Backend Integration
- [x] Update AuthModule with strategies and env config
- [x] Update AuthService with social login validation logic
- [x] Update UsersService with social account methods
- [x] Update AuthController with OAuth endpoints

## Phase 4: Environment Setup
- [x] Add OAuth environment variables template (.env.oauth.example)
- [x] Document required OAuth credentials setup

## Phase 5: Frontend Integration
- [x] Add social login buttons to Login page
- [x] Handle OAuth callback flow
