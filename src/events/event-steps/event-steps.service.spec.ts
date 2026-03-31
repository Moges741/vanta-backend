import { Test, TestingModule } from '@nestjs/testing';
import { EventStepsService } from './event-steps.service';

describe('EventStepsService', () => {
  let service: EventStepsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventStepsService],
    }).compile();

    service = module.get<EventStepsService>(EventStepsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
