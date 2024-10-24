import { IsEmail, IsPhoneNumber, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password_hash: string;

  @IsPhoneNumber()
  @IsString()
  phone: string;
}
