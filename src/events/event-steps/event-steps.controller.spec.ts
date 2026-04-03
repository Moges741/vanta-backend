import { Test, TestingModule } from '@nestjs/testing';
import { EventStepsController } from './event-steps.controller';

describe('EventStepsController', () => {
  let controller: EventStepsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventStepsController],
    }).compile();

    controller = module.get<EventStepsController>(EventStepsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
