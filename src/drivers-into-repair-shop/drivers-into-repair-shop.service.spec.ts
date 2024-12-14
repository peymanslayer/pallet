import { Test, TestingModule } from '@nestjs/testing';
import { DriversIntoRepairShopService } from './drivers-into-repair-shop.service';

describe('DriversIntoRepairShopService', () => {
  let service: DriversIntoRepairShopService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DriversIntoRepairShopService],
    }).compile();

    service = module.get<DriversIntoRepairShopService>(DriversIntoRepairShopService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
