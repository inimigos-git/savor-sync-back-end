import { Prisma } from '@prisma/client';

export class Users implements Prisma.UsersUncheckedCreateInput {
  id?: number;
  email: string;
  name: string;
  password_hash: string;
  phone: string;
}
