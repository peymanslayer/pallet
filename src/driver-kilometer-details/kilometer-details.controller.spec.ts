import { Test, TestingModule } from '@nestjs/testing';
import { KilometerDetailsController } from './kilometer-details.controller';
import { KilometerDetailsService } from './kilometer-details.service';

describe('KilometerDetailsController', () => {
  let controller: KilometerDetailsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KilometerDetailsController],
      providers: [KilometerDetailsService],
    }).compile();

    controller = module.get<KilometerDetailsController>(KilometerDetailsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
