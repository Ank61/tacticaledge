import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMovieDto {
  @ApiProperty({ example: 'Movie title' })
  @IsString()
  title: string;

  @ApiProperty({ example: 2021 })
  @Type(() => Number)
  @IsInt()
  @Min(1800)
  @Max(2999)
  publishingYear: number;

  @ApiProperty({ example: 'https://test/image.jpg', required: false })
  @IsOptional()
  @IsString()
  poster?: string;
}
