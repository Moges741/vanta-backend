import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { PrismaService } from '../../prismar/prisma.service';

@Module({
  controllers: [EventsController],
  providers: [EventsService, PrismaService],
})
export class EventsModule {}