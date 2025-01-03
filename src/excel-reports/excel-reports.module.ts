import { Module } from '@nestjs/common';
import { ExcelReportsService } from './excel-reports.service';
import { ExcelReportsController } from './excel-reports.controller';
import { TruckInfoProviders } from 'src/truck-info/truck-info.provider';
import { AuthProviders } from 'src/auth/auth.provider';
import { TruckBreakDownProviders } from 'src/truck-break-down/truck-break-down.provider';
import { AuthModule } from 'src/auth/auth.module';
import { TruckBreakDownItemsProviders } from 'src/truck-break-down-items/truck-break-down-items.provider';
import { CheckListProviders } from 'src/check-list/check-list.provider';
import { PeriodicTruckCheckProviders } from 'src/periodic-truck-check/periodic-truck-check.provider';

@Module({
  imports : [AuthModule] ,
  controllers: [ExcelReportsController],
  providers: [ExcelReportsService ,
     ...TruckBreakDownProviders ,
     ...AuthProviders ,
     ...TruckBreakDownItemsProviders,
     ...CheckListProviders ,
     ...PeriodicTruckCheckProviders,
     ...TruckInfoProviders
    ],
})
export class ExcelReportsModule {}
