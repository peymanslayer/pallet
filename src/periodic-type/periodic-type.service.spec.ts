import { Test, TestingModule } from '@nestjs/testing';
import { PeriodicTypeService } from './periodic-type.service';

describe('PeriodicTypeService', () => {
  let service: PeriodicTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PeriodicTypeService],
    }).compile();

    service = module.get<PeriodicTypeService>(PeriodicTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
