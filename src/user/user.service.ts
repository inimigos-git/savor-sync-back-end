import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async update(
    id: number,
    data: Prisma.UsersUpdateInput,
  ): Promise<UserWithoutPassword> {
    if (!id) {
      throw new NotFoundException('User ID is required');
    }
    const user = await this.prisma.users.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (typeof data.email === 'string') {
      const emailExisting = await this.prisma.users.findUnique({
        where: {
          email: data.email,
        },
      });

      if (emailExisting) {
        throw new ConflictException('Email is already in use');
      }
    }

    if (typeof data.password_hash === 'string') {
      data.password_hash = await bcrypt.hash(data.password_hash, 10);
    }

    return await this.prisma.users.update({
      where: { id },
      data,
      select: userSelect,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
