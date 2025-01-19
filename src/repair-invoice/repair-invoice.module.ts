import { Module } from '@nestjs/common';
import { RepairInvoiceService } from './repair-invoice.service';
import { RepairInvoiceController } from './repair-invoice.controller';
import { RepairInvoiceProviders } from './repair-invoice.provider';
import { TruckBreakDownProviders } from 'src/truck-break-down/truck-break-down.provider';
import { AuthProviders } from 'src/auth/auth.provider';
import { TruckInfoProviders } from 'src/truck-info/truck-info.provider';
import { TruckBreakDownItemsProviders } from 'src/truck-break-down-items/truck-break-down-items.provider';

@Module({
  providers: [RepairInvoiceService , ...RepairInvoiceProviders , ...TruckBreakDownProviders ,...TruckBreakDownItemsProviders , ...AuthProviders , ...TruckInfoProviders],
  controllers: [RepairInvoiceController ],
})
export class RepairInvoiceModule {}
