import { Test, TestingModule } from '@nestjs/testing';
import { EventImagesController } from './event-images.controller';
import { EventImagesService } from './event-images.service';

describe('EventImagesController', () => {
  let controller: EventImagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventImagesController],
      providers: [{ provide: EventImagesService, useValue: {} }],
    }).compile();

    controller = module.get<EventImagesController>(EventImagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
