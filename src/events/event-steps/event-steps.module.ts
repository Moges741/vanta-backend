import { Module } from '@nestjs/common';
import { EventStepsController } from './event-steps.controller';
import { EventStepsService } from './event-steps.service';
import { PrismaService } from '../../../prismar/prisma.service';
@Module({
  imports: [],
  controllers: [EventStepsController],
  providers: [EventStepsService, PrismaService]
})
export class EventStepsModule {}

