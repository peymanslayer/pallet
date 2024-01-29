import { Test, TestingModule } from '@nestjs/testing';
import { TruckInfoController } from './truck-info.controller';

describe('TruckInfoController', () => {
  let controller: TruckInfoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TruckInfoController],
    }).compile();

    controller = module.get<TruckInfoController>(TruckInfoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
