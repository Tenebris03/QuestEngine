import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOne(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async create(userData: Partial<User>): Promise<User> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = this.usersRepository.create({
      ...userData,
      password: hashedPassword,
    });
    return this.usersRepository.save(user);
  }

async findById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async findBySocialId(provider: string, providerId: string): Promise<User | null> {
    const query: any = {};
    query[`${provider}Id`] = providerId;
    return this.usersRepository.findOne({ where: query });
  }

  async linkSocialAccount(userId: number, provider: string, providerId: string): Promise<User> {
    const user = await this.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    user[`${provider}Id`] = providerId;
    return this.usersRepository.save(user);
  }

  async createOAuthUser(userData: {
    email: string;
    name: string;
    profilePicture?: string;
    provider: 'google' | 'github' | 'discord';
    providerId: string;
  }): Promise<User> {
    const socialData: Partial<User> = {
      email: userData.email,
      password: '', // No password for OAuth users
      name: userData.name,
      profilePicture: userData.profilePicture,
      level: 1,
      experience: 0,
      maxExperience: 1000,
      stats: { strength: 10, agility: 10, intelligence: 10, vitality: 10 },
    };
    socialData[`${userData.provider}Id`] = userData.providerId;
    
    const user = this.usersRepository.create(socialData);
    return this.usersRepository.save(user);
  }
}
