import { Module } from '@nestjs/common';
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule], // This is critical
  controllers: [LikesController],
  providers: [LikesService],
})
export class LikesModule {}
