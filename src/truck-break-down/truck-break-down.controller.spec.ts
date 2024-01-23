import { Test, TestingModule } from '@nestjs/testing';
import { TruckBreakDownController } from './truck-break-down.controller';

describe('TruckBreakDownController', () => {
  let controller: TruckBreakDownController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TruckBreakDownController],
    }).compile();

    controller = module.get<TruckBreakDownController>(TruckBreakDownController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
