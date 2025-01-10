import { Body, Controller, Post, Res } from '@nestjs/common';
import { RepairInvoiceService } from './repair-invoice.service';
import { Response } from 'express';

@Controller('/api/repair-invoice')
export class RepairInvoiceController {
    constructor(private readonly repairInvoiceService: RepairInvoiceService) {}

    @Post('add')
    async add (@Body() input: any , @Res() response: Response){
        const res = await this.repairInvoiceService.createRepairInvoices(
            input
          );
        response
        .status(res.status)
        .json(res.message);
    }
}
