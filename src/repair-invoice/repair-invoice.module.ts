import { Module } from '@nestjs/common';
import { RepairInvoiceService } from './repair-invoice.service';
import { RepairInvoiceController } from './repair-invoice.controller';
import { RepairInvoiceProviders } from './repair-invoice.provider';

@Module({
  providers: [RepairInvoiceService , ...RepairInvoiceProviders],
  controllers: [RepairInvoiceController ],
})
export class RepairInvoiceModule {}
