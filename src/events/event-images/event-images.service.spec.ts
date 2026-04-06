import { Test, TestingModule } from '@nestjs/testing';
import { EventImagesService } from './event-images.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { UploadsService } from '../../uploads/uploads.service';

describe('EventImagesService', () => {
  let service: EventImagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventImagesService,
        { provide: PrismaService, useValue: {} },
        { provide: UploadsService, useValue: {} },
      ],
    }).compile();

    service = module.get<EventImagesService>(EventImagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
