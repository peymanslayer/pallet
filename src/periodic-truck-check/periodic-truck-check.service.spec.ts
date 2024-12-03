import { Test, TestingModule } from '@nestjs/testing';
import { PeriodicTruckCheckService } from './periodic-truck-check.service';

describe('PeriodicTruckCheckService', () => {
  let service: PeriodicTruckCheckService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PeriodicTruckCheckService],
    }).compile();

    service = module.get<PeriodicTruckCheckService>(PeriodicTruckCheckService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
