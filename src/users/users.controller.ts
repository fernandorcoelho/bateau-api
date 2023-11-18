import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { RoleName } from '@prisma/client';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Public()
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.createUser(
      createUserDto.email,
      createUserDto.password,
      createUserDto.profile,
    );

    return user;
  }

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
