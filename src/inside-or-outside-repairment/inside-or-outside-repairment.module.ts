import { Module } from '@nestjs/common';
import { InternalOrExternalRepairmentController } from './inside-or-outside-repairment.controller';
import { TruckBreakDownProviders } from 'src/truck-break-down/truck-break-down.provider';
import { InsideOrOutsideRepairmenttService } from './inside-or-outside-repairment.service';
import { AuthModule } from 'src/auth/auth.module';
import { TruckBreakDownItemsProviders } from 'src/truck-break-down-items/truck-break-down-items.provider';

@Module({
  imports : [AuthModule] ,
  controllers: [InternalOrExternalRepairmentController],
  providers: [InsideOrOutsideRepairmenttService , ...TruckBreakDownProviders , ...TruckBreakDownItemsProviders],
})
export class InternalOrExternalRepairmentModule {}
