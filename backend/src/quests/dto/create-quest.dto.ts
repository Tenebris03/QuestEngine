import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateQuestDto {
  @ApiProperty({ description: 'Quest title' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ description: 'Quest description' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ description: 'Quest difficulty' })
  @IsNotEmpty()
  @IsString()
  difficulty: string;
}
