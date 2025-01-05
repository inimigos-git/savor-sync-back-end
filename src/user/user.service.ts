import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Prisma, Users } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';

const userSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
} as const;

type UserSelect = typeof userSelect;
export type UserWithoutPassword = Pick<Users, keyof UserSelect>;

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateUserDto): Promise<UserWithoutPassword> {
    const existingUser = await this.prisma.users.findUnique({
      where: {
        email: data.email,
      },
    });

    if (existingUser) {
      throw new ConflictException('Email is already in use');
    }

    const hash = await bcrypt.hash(data.password_hash, 10);

    const user = await this.prisma.users.create({
      data: {
        email: data.email,
        name: data.name,
        password_hash: hash,
        phone: data.phone,
      },
      select: userSelect,
    });

    return user;
  }

  async findAll(): Promise<UserWithoutPassword[]> {
    const users = await this.prisma.users.findMany({
      select: userSelect,
    });

    if (users.length === 0) {
      throw new NotFoundException('Users not found');
    }

    return users;
  }

  async findMe(userId: number | string): Promise<UserWithoutPassword> {
    const numericUserId =
      typeof userId === 'string' ? parseInt(userId, 10) : userId;

    if (isNaN(numericUserId)) {
      throw new Error('Invalid user ID');
    }

    const user = await this.prisma.users.findUnique({
      where: {
        id: numericUserId,
      },
      select: userSelect,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findOne(id: number): Promise<UserWithoutPassword> {
    const user = await this.prisma.users.findUnique({
      where: { id },
      select: userSelect,
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async update(id: number, data: UpdateUserDto): Promise<UserWithoutPassword> {
    if (!id) {
      throw new NotFoundException('User ID is required');
    }

    if (data.email) {
      const emailExisting = await this.prisma.users.findFirst({
        where: {
          email: data.email,
          NOT: {
            id: id,
          },
        },
      });

      if (emailExisting) {
        throw new ConflictException('Email is already in use');
      }
    }

    if (data.password_hash) {
      data.password_hash = await bcrypt.hash(data.password_hash, 10);
    }

    const updatedUser = await this.prisma.users.update({
      where: { id },
      data,
      select: userSelect,
    });

    return updatedUser;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
