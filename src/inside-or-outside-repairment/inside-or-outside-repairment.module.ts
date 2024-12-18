import { Module } from '@nestjs/common';
import { InternalOrExternalRepairmentController } from './inside-or-outside-repairment.controller';
import { TruckBreakDownProviders } from 'src/truck-break-down/truck-break-down.provider';
import { InsideOrOutsideRepairmenttService } from './inside-or-outside-repairment.service';

@Module({
  controllers: [InternalOrExternalRepairmentController],
  providers: [InsideOrOutsideRepairmenttService , ...TruckBreakDownProviders],
})
export class InternalOrExternalRepairmentModule {}
