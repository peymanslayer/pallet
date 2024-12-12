import { Test, TestingModule } from '@nestjs/testing';
import { PeriodicTypeController } from './periodic-type.controller';

describe('PeriodicTypeController', () => {
  let controller: PeriodicTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PeriodicTypeController],
    }).compile();

    controller = module.get<PeriodicTypeController>(PeriodicTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
