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
  @Min(18, { message: 'Você deve ter pelo menos 18 anos.' })
  age: number;

  @IsString()
  @IsNotEmpty()
  cpf: string;
}
