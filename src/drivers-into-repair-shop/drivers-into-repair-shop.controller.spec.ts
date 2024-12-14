import { Test, TestingModule } from '@nestjs/testing';
import { DriversIntoRepairShopController } from './drivers-into-repair-shop.controller';
import { DriversIntoRepairShopService } from './drivers-into-repair-shop.service';

describe('DriversIntoRepairShopController', () => {
  let controller: DriversIntoRepairShopController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DriversIntoRepairShopController],
      providers: [DriversIntoRepairShopService],
    }).compile();

    controller = module.get<DriversIntoRepairShopController>(DriversIntoRepairShopController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
