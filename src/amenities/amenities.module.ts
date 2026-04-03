import { Module } from '@nestjs/common';
import { AmenitiesService } from './amenities.service';
import { AmenitiesController } from './amenities.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AmenitiesController],
  providers: [AmenitiesService],
  exports: [AmenitiesService], // Export for Events module
})
export class AmenitiesModule {}