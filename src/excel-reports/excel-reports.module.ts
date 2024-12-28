import { Module } from '@nestjs/common';
import { ExcelReportsService } from './excel-reports.service';
import { ExcelReportsController } from './excel-reports.controller';
import { TruckInfoProviders } from 'src/truck-info/truck-info.provider';
import { AuthProviders } from 'src/auth/auth.provider';

@Module({
  controllers: [ExcelReportsController],
  providers: [ExcelReportsService , ...TruckInfoProviders , ...AuthProviders],
})
export class ExcelReportsModule {}
