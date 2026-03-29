import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsModule } from './events/events.module';
import { EventImagesModule } from './event-images/event-images.module';
import { EventStepsModule } from './event-steps/event-steps.module';
import { UploadsModule } from './uploads/uploads.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [EventsModule, EventImagesModule, EventStepsModule, UploadsModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
