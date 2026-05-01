import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-discord';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy, 'discord') {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {
    super({
      clientID: configService.get('DISCORD_CLIENT_ID') || '',
      clientSecret: configService.get('DISCORD_CLIENT_SECRET') || '',
      callbackURL: configService.get('DISCORD_CALLBACK_URL') || 'http://localhost:3001/auth/discord/callback',
      scope: ['identify', 'email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any,
  ): Promise<any> {
    const { id, username, email } = profile;
    const profilePicture = `https://cdn.discordapp.com/avatars/${id}/${profile.avatar || 'default'}.png`;

    if (!email) {
      return done(new Error('No email found in Discord profile'), null);
    }

    try {
      const user = await this.authService.validateOAuthLogin(email, 'discord', {
        providerId: id,
        email,
        displayName: username,
        profilePicture,
      });
      return done(null, user);
    } catch (error) {
      return done(error as Error, null);
    }
  }
}
