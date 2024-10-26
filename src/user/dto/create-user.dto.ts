import { IsEmail, IsPhoneNumber, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe', description: 'The name of the user' })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'The email of the user',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '123456',
    description: 'The password for the account',
  })
  @IsString()
  @MinLength(6)
  password_hash: string;

  @ApiProperty({
    example: '1234567890',
    description: 'The phone number of the user',
  })
  @IsString()
  phone: string;
}
