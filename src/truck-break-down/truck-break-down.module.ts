import { Module } from '@nestjs/common';
import { TruckBreakDownController } from './truck-break-down.controller';
import { TruckBreakDownService } from './truck-break-down.service';
import { TruckBreakDownProviders } from './truck-break-down.provider';
import { TruckBreakDownItemsProviders } from 'src/truck-break-down-items/truck-break-down-items.provider';
import { TruckInfoProviders } from 'src/truck-info/truck-info.provider';
import { AuthModule } from 'src/auth/auth.module';
import { RepairInvoiceProviders } from 'src/repair-invoice/repair-invoice.provider';
@Module({
  imports: [AuthModule],
  controllers: [TruckBreakDownController],
  providers: [
    TruckBreakDownService,
    ...TruckBreakDownProviders,
    ...TruckBreakDownItemsProviders,
    ...TruckInfoProviders,
    ...RepairInvoiceProviders
  ],
  exports: [TruckBreakDownService],
})
export class TruckBreakDownModule {}
