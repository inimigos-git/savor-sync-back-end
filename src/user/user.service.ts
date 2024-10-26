import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'prisma/prisma.service';
import { Prisma, Users } from '@prisma/client';
import * as bcrypt from 'bcrypt';

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

  async create(data: Prisma.UsersCreateInput): Promise<UserWithoutPassword> {
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

  async findOne(id: number): Promise<UserWithoutPassword> {
    const user = await this.prisma.users.findUnique({
      where: { id },
      select: userSelect,
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
