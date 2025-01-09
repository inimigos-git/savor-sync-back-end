import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Create new user',
    description: 'Create a new user account',
  })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User successfully created',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        name: { type: 'string' },
        email: { type: 'string' },
        phone: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Email already in use',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      return await this.userService.create(createUserDto);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Error creating user');
    }
  }

  @UseGuards(AuthGuard)
  @Get()
  @ApiOperation({
    summary: 'Get all users',
    description: 'Retrieve a list of all users',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of users retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number' },
          name: { type: 'string' },
          email: { type: 'string' },
          phone: { type: 'string' },
        },
      },
    },
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'No users found' })
  async findAll() {
    try {
      return await this.userService.findAll();
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error fetching all users');
    }
  }

  @UseGuards(AuthGuard)
  @Get('me/reservations')
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
  async findReservations(@Req() request: Request) {
    try {
      return await this.userService.findReservations(request['id'].sub);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof Error) {
        throw new InternalServerErrorException(error.message);
      }

      throw new InternalServerErrorException(
        'Error fetching user reservations',
      );
    }
  }

  @UseGuards(AuthGuard)
  @Get('me')
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
  async findMe(@Req() request: Request) {
    try {
      return await this.userService.findMe(request['id'].sub);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof Error) {
        throw new InternalServerErrorException(error.message);
      }

      throw new InternalServerErrorException('Error fetching logged user');
    }
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  @ApiOperation({
    summary: 'Get user by ID',
    description: 'Retrieve a specific user by their ID',
  })
  @ApiParam({ name: 'id', type: 'number', description: 'User ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User found',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        name: { type: 'string' },
        email: { type: 'string' },
        phone: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
  async findOne(@Param('id') id: string) {
    try {
      return await this.userService.findOne(+id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error fetching user by ID');
    }
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
  async updateMe(
    @Req() request: Request,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      return await this.userService.updateMe(request['id'].sub, updateUserDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Error updating user');
    }
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  @ApiOperation({
    summary: 'Update user',
    description: 'Update user information by ID',
  })
  @ApiParam({ name: 'id', type: 'number', description: 'User ID' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User updated successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        name: { type: 'string' },
        email: { type: 'string' },
        phone: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    try {
      return await this.userService.update(+id, updateUserDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Error updating user');
    }
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete user', description: 'Delete a user by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'User ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User deleted successfully',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
  async remove(@Param('id') id: string) {
    try {
      return await this.userService.remove(+id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error deleting user by ID');
    }
  }
}
