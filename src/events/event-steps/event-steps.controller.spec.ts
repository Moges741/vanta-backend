import { Test, TestingModule } from '@nestjs/testing';
import { EventStepsController } from './event-steps.controller';
import { EventStepsService } from './event-steps.service';

describe('EventStepsController', () => {
  let controller: EventStepsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventStepsController],
      providers: [{ provide: EventStepsService, useValue: {} }],
    }).compile();

    controller = module.get<EventStepsController>(EventStepsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
