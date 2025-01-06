import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { PrismaService } from 'prisma/prisma.service';
import { PriceRange } from '@prisma/client';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PaginatedResponse } from 'src/common/interfaces/paginated-response.interface';

export interface RestaurantBasicSelect {
  id: number;
  name: string;
  address: string;
  price_range: PriceRange;
  cuisine_type: string;
}

export const restaurantBasicSelect = {
  id: true,
  name: true,
  address: true,
  price_range: true,
  cuisine_type: true,
} as const;

@Injectable()
export class RestaurantService {
  constructor(private prisma: PrismaService) {}

  create(createRestaurantDto: CreateRestaurantDto) {
    return 'This action adds a new restaurant';
  }

  async findAll(
    paginationDto: PaginationDto,
  ): Promise<PaginatedResponse<RestaurantBasicSelect>> {
    const { page, limit } = paginationDto;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    const skip = (pageNumber - 1) * limit >= 0 ? (pageNumber - 1) * limit : 0;

    const [total, restaurants] = await Promise.all([
      this.prisma.restaurants.count(),
      this.prisma.restaurants.findMany({
        select: {
          id: true,
          name: true,
          address: true,
          price_range: true,
          cuisine_type: true,
        },
        skip,
        take: limitNumber,
        orderBy: {
          created_at: 'desc',
        },
      }),
    ]);

    if (restaurants.length === 0) {
      throw new NotFoundException('Restaurants not found');
    }

    const lastPage = Math.ceil(total / limit);

    return {
      data: restaurants,
      meta: {
        total,
        currentPage: pageNumber,
        lastPage,
        limit: limitNumber,
        hasNextPage: pageNumber < lastPage,
        hasPreviousPage: pageNumber > 1,
      },
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} restaurant`;
  }

  update(id: number, updateRestaurantDto: UpdateRestaurantDto) {
    return `This action updates a #${id} restaurant`;
  }

  remove(id: number) {
    return `This action removes a #${id} restaurant`;
  }
}
