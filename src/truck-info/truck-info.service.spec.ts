import { Test, TestingModule } from '@nestjs/testing';
import { TruckInfoService } from './truck-info.service';

describe('TruckInfoService', () => {
  let service: TruckInfoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TruckInfoService],
    }).compile();

    service = module.get<TruckInfoService>(TruckInfoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
