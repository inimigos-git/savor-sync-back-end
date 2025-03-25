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
import { RolesGuard } from 'src/role/roles.guard';
import { Roles } from 'src/role/roles.decorator';
import { userRole } from 'src/role/enums/role.num';

@Controller('restaurant')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(userRole.Admin)
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
    try {
      return this.restaurantService.update(+id, updateRestaurantDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Error updating restaurant with ID ${id}`,
      );
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    try {
      return this.restaurantService.remove(+id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Error deleting restaurant with ID ${id}`,
      );
    }
  }
}
