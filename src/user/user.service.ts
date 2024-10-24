import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'prisma/prisma.service';
import { Prisma, Users } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.UsersCreateInput): Promise<Users> {
    const existingUser = await this.prisma.users.findUnique({
      where: {
        email: data.email,
      },
    });

    if (existingUser) {
      throw new ConflictException('Email is already in use');
    }

    return await this.prisma.users.create({
      data,
    });
  }

  async findAll() {
    const users = await this.prisma.users.findMany({});

    if (users.length === 0) {
      throw new NotFoundException('Users not found');
    }

    return users;
  }

  async findOne(id: number) {
    const user = await this.prisma.users.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
