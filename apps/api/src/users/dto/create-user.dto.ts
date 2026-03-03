import {
  IsEmail,
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsString()
  password: string;

  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsNumber()
  salary: number;

  @IsOptional()
  @IsBoolean()
  salarySubtraction: boolean;
}
