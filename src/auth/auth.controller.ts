import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in';
import { Public } from './decorators/public.decorator';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  async createUser(@Body() createUserDto: CreateUserDto) {
    const user = await this.authService.createUser(
      createUserDto.email,
      createUserDto.password,
      createUserDto.profile,
    );

    return user;
  }

  @Get('check-token')
  checkToken(@Request() req) {
    return {
      message: 'Token válido',
      user: req.user, // Retorna informações do usuário extraídas do token
    };
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: SignInDto) {
    const { email, password } = signInDto;
    return this.authService.signIn({ email, password });
  }

  // TODO: AJUSTAR E COMPREENDER MELHOR ESSA ROTA
  @Get('profile')
  getProfile(@Request() req) {
    const user = {
      id: req.sub.id,
      profileId: req.profileId,
      email: req.email,
    };

    return user;
  }
}
