import { Inject, Injectable } from '@nestjs/common';
import { RepairInvoice } from './rapair-invoice.entity';

@Injectable()
export class RepairInvoiceService {
    constructor(
        @Inject('REPAIRINVOICE_REPOSITORY')
        private readonly repairInvoiceRepository: typeof RepairInvoice,
    ){}

    async createRepairInvoices(inputData: any) {
        const repairInvoices = inputData.repairInvoices.map((invoice) => ({
          truckBreakDownId: inputData.truckBreakDownId, 
          carNumber: inputData.carNumber,
          carNumberSystem: inputData.carNumberSystem,
          providerCode: inputData.providerCode,
          providerName: inputData.providerName,
          piece: invoice.piece,
          typeActivity: invoice.typeActivity,
          price: invoice.price,
        }));
      
        await RepairInvoice.bulkCreate(repairInvoices);
      
        return { status: 200 , message: 'فاکتور با موفقیت ثبت شد' };
      }

    async getAllPieces(){
      const pieces = await this.repairInvoiceRepository.findAll({
        attributes: ['piece'], 
      });

      if(pieces){
        return {
          status: 201 ,
          data : [] ,
          message : "قطعه ای یافت نشد"
        }
      }

      return {
        status: 200 ,
        data: pieces,
        message : "قطعات با موفقیت یافت شدند"
      }
      
    }


    async edit(){

    }

    async getById(){

    }

    async getAll(){
        
    }
}
