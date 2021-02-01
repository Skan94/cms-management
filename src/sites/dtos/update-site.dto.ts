import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSiteDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'my super site',
    type: String,
  })
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'my super site name',
  })
  slug: string;
}
