import { Controller } from '@nestjs/common';
import { ExcelReportsService } from './excel-reports.service';

@Controller('excel-reports')
export class ExcelReportsController {
  constructor(private readonly excelReportsService: ExcelReportsService) {}
}
