import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { PrismaService } from 'prisma/prisma.service';
import { PriceRange } from '@prisma/client';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PaginatedResponse } from 'src/common/interfaces/paginated-response.interface';
import { promises } from 'dns';

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

  async create(data: CreateRestaurantDto): Promise<RestaurantBasicSelect> {
    const existingRestaurant = await this.prisma.restaurants.findFirst({
      where: { name: data.name },
    });

    if (existingRestaurant) {
      throw new NotFoundException('Restaurant already exists');
    }

    const restaurant = await this.prisma.restaurants.create({
      data: {
        name: data.name,
        description: data.description,
        address: data.address,
        cuisine_type: data.cuisine_type,
        price_range: data.price_range,
        opening_hours: data.opening_hours,
      },
      select: restaurantBasicSelect,
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurant not created');
    }

    return restaurant;
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

  async findOne(id: number): Promise<RestaurantBasicSelect> {
    const restaurant = await this.prisma.restaurants.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        address: true,
        price_range: true,
        cuisine_type: true,
        opening_hours: true,
        MenuItems: {
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            category: true,
          },
        },
        Reviews: {
          select: {
            id: true,
            rating: true,
            comment: true,
            user_id: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        RestaurantPhotos: {
          select: {
            id: true,
            photo_url: true,
          },
        },
      },
    });

    if (!restaurant) {
      throw new NotFoundException(`Restaurant with ID ${id} not found`);
    }

    return restaurant;
  }

  update(id: number, updateRestaurantDto: UpdateRestaurantDto) {
    return `This action updates a #${id} restaurant`;
  }

  remove(id: number) {
    return `This action removes a #${id} restaurant`;
  }
}
