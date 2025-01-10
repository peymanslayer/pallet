import { Test, TestingModule } from '@nestjs/testing';
import { PeriodicTruckCheckController } from './periodic-truck-check.controller';

describe('PeriodicTruckCheckController', () => {
  let controller: PeriodicTruckCheckController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PeriodicTruckCheckController],
    }).compile();

    controller = module.get<PeriodicTruckCheckController>(PeriodicTruckCheckController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
