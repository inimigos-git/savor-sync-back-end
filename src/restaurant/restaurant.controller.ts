import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  InternalServerErrorException,
  NotFoundException,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('restaurant')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Post('create')
  async create(@Body() createRestaurantDto: CreateRestaurantDto) {
    try {
      return this.restaurantService.create(createRestaurantDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error creating a new restaurants',
      );
    }
  }

  @Get()
  async(@Query() query: PaginationDto) {
    try {
      return this.restaurantService.findAll(query);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error fetching all restaurants');
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return this.restaurantService.findOne(+id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Error fetching restaurant with ID ${id}`,
      );
    }
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRestaurantDto: UpdateRestaurantDto,
  ) {
    return this.restaurantService.update(+id, updateRestaurantDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.restaurantService.remove(+id);
  }
}
