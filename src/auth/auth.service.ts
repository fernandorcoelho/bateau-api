import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { SignInParams, SignInResultParams } from './types/sign-in';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { prisma } from 'src/lib/prisma';
import { CreateProfileDto } from 'src/profiles/dto/create-profile.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async createUser(
    email: string,
    password: string,
    profileData: CreateProfileDto,
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);

    // Verifique se já existe um usuário com o mesmo CPF
    const existingUser = await prisma.profile.findUnique({
      where: { cpf: profileData.cpf },
    });

    if (existingUser) {
      throw new BadRequestException('CPF já está em uso.');
    }

    try {
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          profile: {
            create: profileData,
          },
          roles: {
            create: [{ role: { connect: { name: 'Crowd' } } }],
          },
        },
      });

      return user;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async signIn(userData: SignInParams) {
    const { email, password } = userData;
    const user = await this.usersService.findOne(email);

    const isExistingUser = await this.usersService.validateUser(
      email,
      password,
    );

    if (!isExistingUser) {
      throw new UnauthorizedException('Usuário não encontrado.');
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
