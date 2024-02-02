import { Body, Controller, Param, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { RoleName } from '@prisma/client';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Patch(':userId/role')
  @Roles(['Admin'])
  async updateUserRole(
    @Param('userId') userId: number,
    @Body('role') role: RoleName,
  ) {
    const user = await this.usersService.updateUserRole(userId, role);
    return user;
  }
}
