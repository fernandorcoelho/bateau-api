import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { SignInParams, SignInResultParams } from './types/sign-in';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(userData: SignInParams) {
    const { email, password } = userData;
    const user = await this.usersService.findOne(email);

    const isExistingUser = await this.usersService.validateUser(
      email,
      password,
    );

    if (!isExistingUser) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    const payload = {
      sub: user.id,
      profileId: user.profileId,
      email: user.email,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    const response: SignInResultParams = {
      accessToken,
      name: user.name,
      nickname: user.nickname,
      age: user.age,
      cpf: user.cpf,
      roles: user.roles,
    };

    return response;
  }
}
