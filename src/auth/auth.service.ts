import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
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

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new UnauthorizedException();
    }

    const payload: SignInResultParams = {
      sub: user.id,
      profileId: user.profileId,
      email: user.email,
    };

    // TODO: Generate a JWT and return it here
    // instead of the user object

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
