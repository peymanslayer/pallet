import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { Response } from 'express';
// import * as XLSX from 'xlsx';
import { ExcelReportsService } from './excel-reports.service';
import { ExcelFilterDto } from './dto/excel-filter.dto';

@Controller('api/excel')
export class ExcelReportsController {
  constructor(private readonly excelReportsService: ExcelReportsService) {}

  @Post('generate-excel-breakdown-report')
  async generateBreakdownExcelReport(
    @Body() excelFilterDto: ExcelFilterDto ,
    @Res() res: Response,
  ) {
    try {
      const breakdownData = await this.excelReportsService.exportAllBreakdownFieldsToExcel(
        excelFilterDto
      );
  
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="exported-data.xlsx"',
      );
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.send(breakdownData);
    } catch (error) {
      console.error('Error generating Excel report:', error);
      return res.status(500).send('Internal Server Error');
    }
  }


  @Post('generate-excel-checklist-report')
  async generateExcelChecklistReport(
    @Body() excelFilterDto: ExcelFilterDto ,
    @Res() res: Response,
  ) {
    try {
      const checklistData = await this.excelReportsService.exportAllChecklistsToExcel(
        excelFilterDto
      );
  
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="exported-data.xlsx"',
      );
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.send(checklistData);
    } catch (error) {
      console.error('Error generating Excel report:', error);
      return res.status(500).send('Internal Server Error');
    }
  }


  @Post('generate-excel-periodic-check-report')
  async exportPriodicCheckTruckData(
    @Body() excelFilterDto: ExcelFilterDto ,
    @Res() res: Response,
  ) {
    try {
      const checklistData = await this.excelReportsService.generatePeriodicCheckExcelReport(
        excelFilterDto
      );
  
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="exported-data.xlsx"',
      );
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.send(checklistData);
    } catch (error) {
      console.error('Error generating Excel report:', error);
      return res.status(500).send('Internal Server Error');
    }
  }
}
