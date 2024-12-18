import { Test, TestingModule } from '@nestjs/testing';
import { InternalOrExternalRepairmentController } from './inside-or-outside-repairment.controller';
import { InsideOrOutsideRepairmenttService } from './inside-or-outside-repairment.service';

describe('InternalOrExternalRepairmentController', () => {
  let controller: InternalOrExternalRepairmentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InternalOrExternalRepairmentController],
      providers: [InsideOrOutsideRepairmenttService],
    }).compile();

    controller = module.get<InternalOrExternalRepairmentController>(InternalOrExternalRepairmentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
