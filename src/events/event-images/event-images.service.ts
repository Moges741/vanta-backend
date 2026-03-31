import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { UploadsService } from '../../uploads/uploads.service';

@Injectable()
export class EventImagesService {
  constructor(
    private prisma: PrismaService,
    private uploadsService: UploadsService,
  ) {}

async uploadEventImages(eventId: string, userId: string, files: Express.Multer.File[]) {
      await this.checkOwnership(eventId, userId);

  const savedImages: { id: string; url: string; isFeatured: boolean; eventId: string; }[] = [];

  for (const file of files) {
    const url = await this.uploadsService.uploadImage(file, 'events');

    const image = await this.prisma.eventImage.create({
      data: {
        eventId,
        url,
        isFeatured: false,
      },
    });

    savedImages.push(image);
  }

  return savedImages;
}
async checkOwnership(eventId: string, userId: string) {
  const event = await this.prisma.event.findUnique({
    where: { id: eventId },
  });

  if (!event) {
    throw new Error('Event not found');
  }

  if (event.creatorId !== userId) {
    throw new Error('You are not allowed to modify this event');
  }

  return event;
}

async setFeaturedImage(imageId: string, userId: string) {
  const image = await this.prisma.eventImage.findUnique({
    where: { id: imageId },
  });

  if (!image) throw new Error('Image not found');

  // check ownership
  await this.checkOwnership(image.eventId, userId);

  // remove old featured
  await this.prisma.eventImage.updateMany({
    where: { eventId: image.eventId },
    data: { isFeatured: false },
  });

  // set new one
  return this.prisma.eventImage.update({
    where: { id: imageId },
    data: { isFeatured: true },
  });
}

async deleteImage(imageId: string, userId: string) {
  const image = await this.prisma.eventImage.findUnique({
    where: { id: imageId },
  });

  if (!image) throw new Error('Image not found');

  await this.checkOwnership(image.eventId, userId);

  return this.prisma.eventImage.delete({
    where: { id: imageId },
  });
}
}