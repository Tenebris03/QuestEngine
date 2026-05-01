import { Controller, Request, Post, UseGuards, Body, Get, Redirect } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    return this.authService.login(user);
  }

  // Google OAuth
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Initiates Google OAuth flow
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @Redirect('http://localhost:5173/dashboard', 302)
  async googleAuthCallback(@Request() req: any) {
    const token = await this.authService.login(req.user);
    return {
      url: `http://localhost:5173/dashboard?token=${token.access_token}`,
    };
  }

  // GitHub OAuth
  @Get('github')
  @UseGuards(AuthGuard('github'))
  async githubAuth() {
    // Initiates GitHub OAuth flow
  }

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  @Redirect('http://localhost:5173/dashboard', 302)
  async githubAuthCallback(@Request() req: any) {
    const token = await this.authService.login(req.user);
    return {
      url: `http://localhost:5173/dashboard?token=${token.access_token}`,
    };
  }

  // Discord OAuth
  @Get('discord')
  @UseGuards(AuthGuard('discord'))
  async discordAuth() {
    // Initiates Discord OAuth flow
  }

  @Get('discord/callback')
  @UseGuards(AuthGuard('discord'))
  @Redirect('http://localhost:5173/dashboard', 302)
  async discordAuthCallback(@Request() req: any) {
    const token = await this.authService.login(req.user);
    return {
      url: `http://localhost:5173/dashboard?token=${token.access_token}`,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
