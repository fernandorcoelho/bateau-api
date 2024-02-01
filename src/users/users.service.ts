import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { RoleName, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { prisma } from 'src/lib/prisma';
import { CreateProfileDto } from 'src/profiles/dto/create-profile.dto';
import { FindUserParams } from './types/user';

@Injectable()
export class UsersService {
  async validateUser(email: string, pass: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user && user.password) {
      const isMatch = await bcrypt.compare(pass, user.password);
      return isMatch;
    }

    return false;
  }

  async findOne(email: string): Promise<FindUserParams | undefined> {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        profileId: true,
        profile: {
          select: {
            name: true,
            nickname: true,
            age: true,
            cpf: true,
          },
        },
        roles: {
          select: {
            role: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!user || !user.profile) {
      throw new BadRequestException('Usuário não encontrado');
    }

    const response: FindUserParams = {
      id: user.id,
      profileId: user.profileId,
      email: user.email,
      name: user.profile.name,
      nickname: user.profile.nickname,
      age: user.profile.age,
      cpf: user.profile.cpf,
      roles: user.roles.map((roleConnection) => roleConnection.role.name),
    };

    return response;
  }

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
      throw new BadRequestException('CPF já está em uso');
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

  async updateUserRole(userId: number, newRole: RoleName): Promise<User> {
    await prisma.usersRoles.deleteMany({
      where: {
        userId: userId,
      },
    });

    return prisma.user.update({
      where: { id: userId },
      data: {
        roles: {
          create: [{ role: { connect: { name: newRole } } }],
        },
      },
    });
  }
}
