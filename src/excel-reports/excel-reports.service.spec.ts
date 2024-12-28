import { Test, TestingModule } from '@nestjs/testing';
import { ExcelReportsService } from './excel-reports.service';

describe('ExcelReportsService', () => {
  let service: ExcelReportsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExcelReportsService],
    }).compile();

    service = module.get<ExcelReportsService>(ExcelReportsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
