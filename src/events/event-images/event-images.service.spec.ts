import { Test, TestingModule } from '@nestjs/testing';
import { EventImagesService } from './event-images.service';

describe('EventImagesService', () => {
  let service: EventImagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventImagesService],
    }).compile();

    service = module.get<EventImagesService>(EventImagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
