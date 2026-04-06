import { Express } from 'express';
import { Controller,Delete, Post, UploadedFiles, UseInterceptors, Param, UseGuards, Req, Patch } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { EventImagesService } from './event-images.service';
import { JwtAuthGuard } from '../../../prismar/auth/jwt-auth.guard';

@Controller('events/:eventId/images')
export class EventImagesController {
  constructor(private eventImagesService: EventImagesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileFieldsInterceptor([{ name: 'images', maxCount: 10 }]))
  async uploadImages(
    @Param('eventId') eventId: string,
    @UploadedFiles() files: { images?: Express.Multer.File[] },
    @Req() req,
  ) {
    // Optional: We can check event ownership here with req.user.id
    const images = await this.eventImagesService.uploadEventImages(
      eventId,
      req.user.id,
      files.images || [],
    );
    return images;
  }

@Patch(':imageId/featured')
@UseGuards(JwtAuthGuard)
setFeatured(
  @Param('imageId') imageId: string,
  @Req() req,
) {
  return this.eventImagesService.setFeaturedImage(
    imageId,
    req.user.id,
  );
}

@Delete(':imageId')
@UseGuards(JwtAuthGuard)
deleteImage(
  @Param('imageId') imageId: string,
  @Req() req,
) {
  return this.eventImagesService.deleteImage(
    imageId,
    req.user.id,
  );
}
}