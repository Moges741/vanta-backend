import { Module } from '@nestjs/common';
import { EventImagesController } from './event-images.controller';
import { EventImagesService } from './event-images.service';
import { PrismaService } from '../../../prismar/prisma.service';
import { UploadsService } from '../../uploads/uploads.service';
@Module({
  imports: [],
  controllers: [EventImagesController],
  providers: [EventImagesService, PrismaService, UploadsService]
})
export class EventImagesModule {}
