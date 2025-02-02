import { Body, Controller, Get, Param, Post, Query, Res } from '@nestjs/common';
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

    @Get('pieces')
    async getInvoicePieces(@Res() response: Response){
        const res = await this.repairInvoiceService.getAllPieces();
        response
        .status(res.status)
        .json({data: res.data , message: res.message});
    }

    @Get('/:id')
    async getOneById(@Param('id') id : number,@Res() response: Response){
        const res = await this.repairInvoiceService.getById(id);
        response
        .status(res.status)
        .json({data: res.data , message: res.message});
    }

    @Get('all')
    async getAll(@Res() response: Response){
        const res = await this.repairInvoiceService.getAll();
        response
        .status(res.status)
        .json({data: res.data , message: res.message});
    }

    @Get('management/filter')
    async getInvoicesWithFilters(
        @Res() response: Response ,
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
        @Query('company') company?: string,
        @Query('zone') zone?: string,
    ){
        const res = await this.repairInvoiceService.getInvoicesWithFilters(new Date(startDate), new Date(endDate), company, zone);
        response
        .status(res.status)
        .json({data: res.data , message: res.message});

    }

    @Post('listOfinvoice')
    async listOfInvoice(@Body() input: any , @Res() response: Response){
     try{
       const listOfInvoice=await this.repairInvoiceService.listOfInvoice(input);
     }catch(err){
        response.status(500).json('internal server error')
     }
    }

    
}
