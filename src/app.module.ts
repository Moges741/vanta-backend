import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { UsersService } from './users/users.service';
import { UsersModule } from './users/users.module';
// import { UsersController } from './users/users.controller';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
// import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
      envFilePath: '.env',
    }),
    PrismaModule,
    UsersModule,
    // AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}