import { Test, TestingModule } from '@nestjs/testing';
import { EventStepsService } from './event-steps.service';
import { PrismaService } from '../../../prisma/prisma.service';

describe('EventStepsService', () => {
  let service: EventStepsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventStepsService,
        { provide: PrismaService, useValue: {} },
      ],
    }).compile();

    service = module.get<EventStepsService>(EventStepsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
