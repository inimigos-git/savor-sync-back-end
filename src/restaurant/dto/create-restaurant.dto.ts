import {
  IsString,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PriceRange } from '@prisma/client';

export class CreateRestaurantDto {
  @ApiProperty({
    example: 'Pizza Hut',
    description: 'The name of the restaurant',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Best pizza in town since 1990',
    description: 'Description of the restaurant',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: '123 Main Street, New York, NY',
    description: 'Physical address of the restaurant',
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    example: 'Italian',
    description: 'Type of cuisine served',
  })
  @IsString()
  @IsNotEmpty()
  cuisine_type: string;

  @ApiProperty({
    enum: PriceRange,
    example: PriceRange.two,
    description: 'Price range category (one, two, three, four)',
  })
  @IsEnum(PriceRange)
  @IsNotEmpty()
  price_range: PriceRange;

  @ApiProperty({
    example: {
      monday: { open: '09:00', close: '22:00' },
      tuesday: { open: '09:00', close: '22:00' },
    },
    description: 'Operating hours for each day of the week',
  })
  @IsObject()
  @IsNotEmpty()
  opening_hours: Record<string, { open: string; close: string }>;

  @ApiProperty({
    example: -23.5505,
    description: 'Latitude coordinate of the restaurant location',
    required: false,
  })
  @IsNumber()
  @IsOptional() // Add this decorator
  latitude?: number;

  @ApiProperty({
    example: -46.6333,
    description: 'Longitude coordinate of the restaurant location',
    required: false,
  })
  @IsNumber()
  @IsOptional() // Add this decorator
  longitude?: number;
}
