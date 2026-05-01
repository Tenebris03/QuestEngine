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
}