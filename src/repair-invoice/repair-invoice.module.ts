import { Module } from '@nestjs/common';
import { RepairInvoiceService } from './repair-invoice.service';
import { RepairInvoiceController } from './repair-invoice.controller';

@Module({
  providers: [RepairInvoiceService],
  controllers: [RepairInvoiceController]
})
export class RepairInvoiceModule {}
