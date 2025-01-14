import { Inject, Injectable } from '@nestjs/common';
import { RepairInvoice } from './rapair-invoice.entity';
import { TruckBreakDown } from 'src/truck-break-down/truck-break-down.entity';
import { Op } from 'sequelize';
import { AuthService } from 'src/auth/services/auth.service';
import { Auth } from 'src/auth/auth.entity';

@Injectable()
export class RepairInvoiceService {
    constructor(
        @Inject('REPAIRINVOICE_REPOSITORY')
        private readonly repairInvoiceRepository: typeof RepairInvoice,
        @Inject('TRUCKBREAKDOWN_REPOSITORY')
        private readonly truckBreakdownRepository: typeof TruckBreakDown,
        @Inject('AUTH_REPOSITORY')
        private readonly authRepository: typeof Auth,
        
    ){}

    async createRepairInvoices(inputData: any) {
        const repairInvoices = inputData.repairInvoices.map((invoice) => ({
          truckBreakDownId: Number(inputData.truckBreakDownId), 
          carNumber: inputData.carNumber,
          carNumberSystem: inputData.carNumberSystem,
          providerCode: inputData.providerCode,
          providerName: inputData.providerName,
          piece: invoice.piece,
          typeActivity: invoice.typeActivity,
          amount: invoice.amount,
        }));
        console.log((inputData.truckBreakDownId));
        
      
        await RepairInvoice.bulkCreate(repairInvoices);
      
        return { status: 200 , message: 'فاکتور با موفقیت ثبت شد' };
      }

    async getAllPieces(){
      const pieces = await this.repairInvoiceRepository.findAll({
        attributes: ['piece'], 
      });

      if(!pieces){
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

    async getById(id: number){
      const invoice = await this.repairInvoiceRepository.findOne({where : {id}})
      if (!invoice) {
        return {
          status : 201 ,
          data : [],
          message : "فاکتوری یافت نشد"
        }
      }
      return {
        status : 200 ,
        data : invoice , 
        message : "فاکتور با موفقیت بازیابی شد"
      }
    }

    async getAll(){
      const invoices = await this.repairInvoiceRepository.findAll({
        include: [
          {
            model: TruckBreakDown,
            attributes: ['id', 'driverName', 'carNumber', 'createdAt'], 
          },
        ],
      });

      if (!invoices) {
        return {
          status : 201 ,
          data : [],
          message : "فاکتوری یافت نشد"
        }
      }

      return {
        status: 200 ,
        data : invoices ,
        message: "فاکتور ها با موفقیت بازیابی شدند"
      }
      
    }

    async getInvoicesByZoneAndCompany(
      zone?: string ,
      company?: string
    ) {
    
      const driverFilter: any = {};
      if (zone) driverFilter.zone = { [Op.eq]: zone };
      if (company) driverFilter.company = { [Op.eq]: company };
    
      const drivers = await this.authRepository.findAll({
        where: driverFilter,
        attributes: ['id'],
      });

    
      const driverIds = drivers.map((driver) => driver.id);
    
      const breakDownFilter: any = {};
      if (driverIds.length > 0) breakDownFilter.driverId = { [Op.in]: driverIds };
    
      const breakdowns = await this.truckBreakdownRepository.findAll({
        where: breakDownFilter,
        attributes: ['id'], 
      });

      const breakdownIds = breakdowns.map((breakdown) => breakdown.id);
    
      const invoiceFilter: any = {};
      if (breakdownIds.length > 0)
        invoiceFilter.truckBreakDownId = { [Op.in]: breakdownIds };
    
      const invoices = await this.repairInvoiceRepository.findAll({
        where: invoiceFilter,
      });
    
      return {
        status: 200 ,
        data : invoices ,
        message: "فاکتور ها با موفقیت بازیابی شدند"
      }
    }
    

}
