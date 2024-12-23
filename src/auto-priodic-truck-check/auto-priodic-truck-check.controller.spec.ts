import { Test, TestingModule } from '@nestjs/testing';
import { AutoPriodicTruckCheckController } from './auto-priodic-truck-check.controller';
import { AutoPriodicTruckCheckService } from './auto-priodic-truck-check.service';

describe('AutoPriodicTruckCheckController', () => {
  let controller: AutoPriodicTruckCheckController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AutoPriodicTruckCheckController],
      providers: [AutoPriodicTruckCheckService],
    }).compile();

    controller = module.get<AutoPriodicTruckCheckController>(AutoPriodicTruckCheckController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
