import { Test, TestingModule } from '@nestjs/testing';
import { ExcelReportsController } from './excel-reports.controller';
import { ExcelReportsService } from './excel-reports.service';

describe('ExcelReportsController', () => {
  let controller: ExcelReportsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExcelReportsController],
      providers: [ExcelReportsService],
    }).compile();

    controller = module.get<ExcelReportsController>(ExcelReportsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
