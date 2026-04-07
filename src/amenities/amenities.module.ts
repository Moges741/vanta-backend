import { Module } from '@nestjs/common';
import { AmenitiesService } from './amenities.service';
import { AmenitiesController } from './amenities.controller';
import { EventAmenitiesService } from './event-amenities.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AmenitiesController],
  providers: [AmenitiesService, EventAmenitiesService],
  exports: [AmenitiesService, EventAmenitiesService], // Export for Events module
})
export class AmenitiesModule {}