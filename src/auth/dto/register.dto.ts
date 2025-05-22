import { IsEmail, IsEnum, IsISO8601, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { UserRole } from '../../users/user.entity';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsISO8601()
  dateOfBirth: string;

  @IsEnum(UserRole)
  role: UserRole;
} 