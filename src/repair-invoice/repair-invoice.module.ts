import { Module } from '@nestjs/common';
import { RepairInvoiceService } from './repair-invoice.service';
import { RepairInvoiceController } from './repair-invoice.controller';
import { RepairInvoiceProviders } from './repair-invoice.provider';
import { TruckBreakDownProviders } from 'src/truck-break-down/truck-break-down.provider';
import { AuthProviders } from 'src/auth/auth.provider';

@Module({
  providers: [RepairInvoiceService , ...RepairInvoiceProviders , ...TruckBreakDownProviders , ...AuthProviders],
  controllers: [RepairInvoiceController ],
})
export class RepairInvoiceModule {}
