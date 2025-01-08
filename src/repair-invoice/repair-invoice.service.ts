import { Inject, Injectable } from '@nestjs/common';
import { RepairInvoice } from './rapair-invoice.entity';

@Injectable()
export class RepairInvoiceService {
    constructor(
        @Inject('REPAIRINVOICE_REPOSITORY')
        private readonly repairInvoiceRepository: typeof RepairInvoice,
    ){}

    async create(){

    }

    async edit(){

    }

    async getById(){

    }

    async getAll(){
        
    }
}
