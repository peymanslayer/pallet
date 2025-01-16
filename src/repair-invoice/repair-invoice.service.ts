import { Inject, Injectable } from '@nestjs/common';
import { RepairInvoice } from './rapair-invoice.entity';
import { TruckBreakDown } from 'src/truck-break-down/truck-break-down.entity';
import { Op } from 'sequelize';
import { AuthService } from 'src/auth/services/auth.service';
import { Auth } from 'src/auth/auth.entity';
import { TruckInfo } from 'src/truck-info/truck-info.entity';

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

    async getInvoicesWithFilters(
      startDate?: Date,
      endDate?: Date,
      company?: string,
      zone?: string,
    ) {
      // تنظیم شرط فیلتر تاریخ به‌صورت پویا
      const dateFilter = startDate && endDate ? {
        createdAt: {
          [Op.between]: [
            new Date(startDate.setHours(0, 0, 0, 0)),
            new Date(endDate.setHours(23, 59, 59, 999)),
          ],
        },
      } : {};
    
      // واکشی فاکتورها با اعمال فیلترهای تاریخ، شرکت و منطقه در صورت وجود
      const invoices = await this.repairInvoiceRepository.findAll({
        where: {
          ...dateFilter,
          ...(company && { company }),
          ...(zone && { zone }),
        },
      });
    
      // استخراج شماره خودروها از فاکتورها
      const carNumbers = invoices.map((invoice) => invoice.carNumber);
    
      // واکشی اطلاعات کامیون‌ها با اعمال فیلترهای شرکت و منطقه در صورت وجود
      const truckInfos = await this.truckInfoRepository.findAll({
        where: {
          carNumber: {
            [Op.in]: carNumbers,
          },
          ...(company && { company }),
          ...(zone && { zone }),
        },
      });
    
      // فیلتر کردن فاکتورها بر اساس اطلاعات کامیون‌ها
      const filteredInvoices = invoices.filter((invoice) =>
        truckInfos.some((truckInfo) => truckInfo.carNumber === invoice.carNumber),
      );
    
      // ساختاردهی داده‌های خروجی
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
    
      // بازگرداندن نتیجه با وضعیت و پیام مناسب
      return {
        status: 200,
        message: 'اطلاعات با موفقیت بازیابی شد',
        data: result,
      };
    }
  }


    

