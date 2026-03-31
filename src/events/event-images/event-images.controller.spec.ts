import { Test, TestingModule } from '@nestjs/testing';
import { EventImagesController } from './event-images.controller';

describe('EventImagesController', () => {
  let controller: EventImagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventImagesController],
    }).compile();

    controller = module.get<EventImagesController>(EventImagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
