import { Test, TestingModule } from '@nestjs/testing';
import { KilometerController } from './kilometer.controller';
import { KilometerService } from './kilometer.service';

describe('KilometerController', () => {
  let controller: KilometerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KilometerController],
      providers: [KilometerService],
    }).compile();

    controller = module.get<KilometerController>(KilometerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
