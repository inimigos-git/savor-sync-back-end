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
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { RestaurantService } from './restaurant.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { RolesGuard } from 'src/role/roles.guard';
import { Roles } from 'src/role/roles.decorator';
import { userRole } from 'src/role/enums/role.num';

@ApiTags('Restaurants')
@Controller('restaurant')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @ApiOperation({
    summary: 'Create a new restaurant',
    description: 'Creates a new restaurant in the system',
  })
  @ApiBody({
    type: CreateRestaurantDto,
    description: 'Restaurant creation data',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Restaurant successfully created.',
    type: CreateRestaurantDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request - Invalid data.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden - Admin access required.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
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

  @ApiOperation({
    summary: 'Get all restaurants',
    description: 'Retrieves a paginated list of all restaurants',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of restaurants retrieved successfully.',
    type: [CreateRestaurantDto],
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of records to return',
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    type: Number,
    description: 'Number of records to skip',
  })
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

  @ApiOperation({
    summary: 'Get restaurant by ID',
    description: 'Retrieves a specific restaurant by its ID',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'Restaurant ID',
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Restaurant found and retrieved successfully.',
    type: CreateRestaurantDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Restaurant not found.',
  })
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

  @ApiOperation({
    summary: 'Update restaurant by ID',
    description: 'Updates an existing restaurant information',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'Restaurant ID',
    required: true,
  })
  @ApiBody({ type: UpdateRestaurantDto, description: 'Restaurant update data' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Restaurant updated successfully.',
    type: UpdateRestaurantDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Restaurant not found.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request - Invalid data.',
  })
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

  @ApiOperation({
    summary: 'Delete restaurant by ID',
    description: 'Removes a restaurant from the system',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'Restaurant ID',
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Restaurant deleted successfully.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Restaurant not found.',
  })
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
