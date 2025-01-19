import { Inject, Injectable } from '@nestjs/common';
import { RepairInvoice } from './rapair-invoice.entity';
import { TruckBreakDown } from 'src/truck-break-down/truck-break-down.entity';
import { Op } from 'sequelize';
import { AuthService } from 'src/auth/services/auth.service';
import { Auth } from 'src/auth/auth.entity';
import { TruckInfo } from 'src/truck-info/truck-info.entity';
import { TruckBreakDownItems } from 'src/truck-break-down-items/truck-break-down-items.entity';

@Injectable()
export class RepairInvoiceService {
    constructor(
        @Inject('REPAIRINVOICE_REPOSITORY')
        private readonly repairInvoiceRepository: typeof RepairInvoice,
        @Inject('TRUCKBREAKDOWN_REPOSITORY')
        private readonly truckBreakdownRepository: typeof TruckBreakDown,
        @Inject('TRUCKINFO_REPOSITORY')
        private readonly truckInfoRepository: typeof TruckInfo,
        @Inject('AUTH_REPOSITORY')
        private readonly authRepository: typeof Auth,
        @Inject('TRUCKBREAKDOWNITEMS_REPOSITORY') 
        private readonly truckBreakDownItems:typeof TruckBreakDownItems
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
        
      
       const factor= await RepairInvoice.bulkCreate(repairInvoices);
      
        return { status: 200 , message: factor };
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

    async getInvoicesWithFilters(
      startDate?: Date,
      endDate?: Date,
      company?: string,
      zone?: string,
    ) {
      const start = startDate ? new Date(startDate) : undefined;
      const end = endDate ? new Date(endDate) : undefined;
    
      const dateFilter = start && end ? {
        createdAt: {
          [Op.between]: [
            new Date(start.setHours(0, 0, 0, 0)),
            new Date(end.setHours(23, 59, 59, 999)),
          ],
        },
      } : {};
  
      const invoices = await this.repairInvoiceRepository.findAll({
        where: {
          ...dateFilter,
        },
      });
      
      const carNumbers = invoices.map((invoice) => invoice.carNumber);
    
      const truckInfos = await this.truckInfoRepository.findAll({
        where: {
          carNumber: {
            [Op.in]: carNumbers,
          },
          ...(company && { company }),
          ...(zone && { zone }),
        },
      });
    
      const filteredInvoices = invoices.filter((invoice) =>
        truckInfos.some((truckInfo) => truckInfo.carNumber === invoice.carNumber),
      );
    
      const result = filteredInvoices.map((invoice) => {
        const truckInfo = truckInfos.find(
          (info) => info.carNumber === invoice.carNumber,
        );
        return {
          ...invoice.get(),
          company: truckInfo?.company,
          zone: truckInfo?.zone,
        };
      });
    
      return {
        status: 200,
        message: 'اطلاعات با موفقیت بازیابی شد',
        data: result,
      };
    }
    async listOfInvoice(body:any){
      const findTruckBreakDown=await this.truckBreakdownRepository.findOne({
        where:{id:body.id},
      });
      if(findTruckBreakDown){
        const findTruckBreakDownList=await this.truckBreakDownItems.findOne({
          where:{id:findTruckBreakDown.truckBreakDownItemsId},
          attributes:{
            exclude:['question_3','question_10']
          }
        });
      }
    }
  }


    

