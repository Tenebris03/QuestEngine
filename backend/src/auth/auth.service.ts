import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: user,
    };
  }

async register(userData: { email: string; password: string; firstName?: string; lastName?: string }) {
    const existingUser = await this.usersService.findOne(userData.email);
    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }
    const user = await this.usersService.create({
      ...userData,
      name: userData.firstName ? `${userData.firstName} ${userData.lastName || ''}`.trim() : userData.email.split('@')[0],
      profilePicture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.email}`,
      stats: { strength: 10, agility: 10, intelligence: 10, vitality: 10 },
    });
    const { password, ...result } = user;
    return result;
  }

  async validateOAuthLogin(
    email: string,
    provider: 'google' | 'github' | 'discord',
    profile: { providerId: string; email: string; displayName?: string; profilePicture?: string },
  ): Promise<any> {
    // Find user by social ID first
    let user = await this.usersService.findBySocialId(provider, profile.providerId);
    
    if (!user) {
      // Check if user exists with this email (could be regular login)
      user = await this.usersService.findOne(email);
      
      if (user) {
        // Link existing account to social login
        user = await this.usersService.linkSocialAccount(user.id, provider, profile.providerId);
      } else {
        // Create new user with social login (Level 1 - starter)
        user = await this.usersService.createOAuthUser({
          email,
          name: profile.displayName || email.split('@')[0],
          profilePicture: profile.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
          provider,
          providerId: profile.providerId,
        });
      }
    }
    
    const { password, ...result } = user;
    return result;
  }
}
