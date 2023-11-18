import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './entities/user.module';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/guards/roles.guard';

@Module({
  imports: [UserModule],
  controllers: [AppController, UsersController],
  providers: [
    AppService,
    UsersService,
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
