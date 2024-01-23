import { Test, TestingModule } from '@nestjs/testing';
import { TrukBreakDownItemsService } from './truck-break-down-items.service';

describe('TrukBreakDownItemsService', () => {
  let service: TrukBreakDownItemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TrukBreakDownItemsService],
    }).compile();

    service = module.get<TrukBreakDownItemsService>(TrukBreakDownItemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
