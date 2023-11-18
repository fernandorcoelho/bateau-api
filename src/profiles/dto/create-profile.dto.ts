import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateProfileDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  nickname: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(16, { message: 'You must be at least 16 years old.' })
  age: number;

  @IsString()
  @IsNotEmpty()
  cpf: string;
}
