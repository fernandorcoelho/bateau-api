import { APP_GUARD } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { UserModule } from './users/user.module';
import { AppController } from './app.controller';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { AppService } from './app.service';
import { RolesGuard } from './auth/guards/roles.guard';
import { AuthGuard } from './auth/guards/auth.guard';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AuthModule, UserModule],
  controllers: [AppController, UsersController],
  providers: [
    AppService,
    UsersService,
    AuthService,
    JwtService,
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_GUARD, useClass: AuthGuard },
  ],
})
export class AppModule {}
