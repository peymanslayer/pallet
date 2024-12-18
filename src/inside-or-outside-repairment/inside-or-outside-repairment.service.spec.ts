import { Test, TestingModule } from '@nestjs/testing';
import { InsideOrOutsideRepairmenttService } from './inside-or-outside-repairment.service';

describe('InternalOrExternalRepairmentService', () => {
  let service: InsideOrOutsideRepairmenttService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InsideOrOutsideRepairmenttService],
    }).compile();

    service = module.get<InsideOrOutsideRepairmenttService>(InsideOrOutsideRepairmenttService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
