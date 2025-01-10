import { Test, TestingModule } from '@nestjs/testing';
import { TruckBreakDownService } from './truck-break-down.service';

describe('TruckBreakDownService', () => {
  let service: TruckBreakDownService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TruckBreakDownService],
    }).compile();

    service = module.get<TruckBreakDownService>(TruckBreakDownService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
