import { Test, TestingModule } from '@nestjs/testing';
import { AutoPriodicTruckCheckService } from './auto-priodic-truck-check.service';

describe('AutoPriodicTruckCheckService', () => {
  let service: AutoPriodicTruckCheckService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AutoPriodicTruckCheckService],
    }).compile();

    service = module.get<AutoPriodicTruckCheckService>(AutoPriodicTruckCheckService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
