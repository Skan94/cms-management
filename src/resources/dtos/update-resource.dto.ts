import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateResourceDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'who am I ?',
    type: String,
  })
  title: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'subtitling is very important',
    type: String,
  })
  subtitle: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'change this content !!',
    type: String,
  })
  content: string;
}
