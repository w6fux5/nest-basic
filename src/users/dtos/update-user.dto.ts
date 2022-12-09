import { IsString, IsEmail, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsEmail()
  @IsOptional() // 可選，有提供可以，不提供也可以
  email: string;

  @IsString()
  @IsOptional()
  password: string;
}
