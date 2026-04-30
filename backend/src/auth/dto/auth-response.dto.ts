import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({ description: 'JWT access token' })
  accessToken: string;

  @ApiProperty({ description: 'Authenticated user' })
  user: {
    id: string;
    name: string;
    email: string;
    level: number;
    experience: number;
    maxExperience: number;
    strength: number;
    agility: number;
    intelligence: number;
    vitality: number;
    profilePicture: string | null;
  };
}
