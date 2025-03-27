import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class FiltersService {
  private prisma = new PrismaClient();

  async getCuisineTypes(): Promise<string[]> {
    const restaurants = await this.prisma.restaurants.findMany({
      select: {
        cuisine_type: true,
      },
    });

    return [
      ...new Set(restaurants.map((restaurant) => restaurant.cuisine_type)),
    ];
  }
}
