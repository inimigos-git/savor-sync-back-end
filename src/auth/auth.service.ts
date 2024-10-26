import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignInDto } from './dto/signIn.dto';
import { PrismaService } from 'prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Users } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

const userSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
} as const;

type UserSelect = typeof userSelect;
export type UserWithoutPassword = Pick<Users, keyof UserSelect>;

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signIn(data: SignInDto): Promise<{ access_token: string }> {
    const user = await this.prisma.users.findUnique({
      where: {
        email: data.email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(
      data.password_hash,
      user.password_hash,
    );

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { id: user.id };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
