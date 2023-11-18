import { Injectable } from '@nestjs/common';
import { RoleName, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { prisma } from 'src/lib/prisma';
import { CreateProfileDto } from 'src/profiles/dto/create-profile.dto';

@Injectable()
export class UsersService {
  async createUser(
    email: string,
    password: string,
    profileData: CreateProfileDto,
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);

    return prisma.user.create({
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
