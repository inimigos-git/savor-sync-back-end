import { PartialType } from '@nestjs/swagger';
import { CreateRestaurantDto } from './create-restaurant.dto';
import { PriceRange } from '@prisma/client';

export class UpdateRestaurantDto extends PartialType(CreateRestaurantDto) {
  name?: string;
  description?: string;
  address?: string;
  cuisine_type?: string;
  price_range?: PriceRange;
  opening_hours?: Record<string, { open: string; close: string }>;
}
