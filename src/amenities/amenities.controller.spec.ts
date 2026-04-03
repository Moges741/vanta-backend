import { Test, TestingModule } from '@nestjs/testing';
import { AnemitiesController } from './amenities.controller';

describe('AnemitiesController', () => {
  let controller: AnemitiesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnemitiesController],
    }).compile();

    controller = module.get<AnemitiesController>(AnemitiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
