import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateResourceDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Here we go',
    minimum: 1,
    default: 1,
  })
  title: string;

  @IsString()
  @ApiProperty({
    example: 'To the moon and higher',
    type: String,
  })
  subtitle: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'mmmh not bad',
    type: String,
  })
  content: string;

  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    example: '8bfba543-fc02-4430-b90f-5996da31443c',
    type: String,
  })
  siteId: string;
}
