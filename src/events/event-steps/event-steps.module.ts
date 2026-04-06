import { Module } from '@nestjs/common';
import { EventStepsController } from './event-steps.controller';
import { EventStepsService } from './event-steps.service';
@Module({
  imports: [],
  controllers: [EventStepsController],
  providers: [EventStepsService]
})
export class EventStepsModule {}

