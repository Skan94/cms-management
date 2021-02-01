import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSiteDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'new site I made',
    type: String,
  })
  name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'soon an influencer ?',
    type: String,
  })
  slug: string;
}
