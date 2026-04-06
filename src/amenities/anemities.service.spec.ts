import { Test, TestingModule } from '@nestjs/testing';
import { AnemitiesService } from './amenities.service';

describe('AnemitiesService', () => {
  let service: AnemitiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnemitiesService],
    }).compile();

    service = module.get<AnemitiesService>(AnemitiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
