import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Workbook } from 'exceljs';
import { Response } from 'express';
import { Op } from 'sequelize';
import { Auth } from 'src/auth/auth.entity';
import { AuthService } from 'src/auth/services/auth.service';
import { CheckList } from 'src/check-list/check-list.entity';
import { PeriodicTruckCheck } from 'src/periodic-truck-check/periodic-truck-check.entity';
// import { FIELDS_OF_EXCEL_REPORT_BREAKDOWN } from 'src/static/enum';
// import { COLUMNS_NAME_EXCEL_REPORT_BREAKDOWN_FILTER } from 'src/static/fields-excelFile';
import { TruckBreakDownItems } from 'src/truck-break-down-items/truck-break-down-items.entity';
import { TruckBreakDown } from 'src/truck-break-down/truck-break-down.entity';
import { TruckInfo } from 'src/truck-info/truck-info.entity';
import { generateDataExcel } from 'src/utility/export_excel';
import { ExcelFilterDto } from './dto/excel-filter.dto';
import { RepairInvoice } from 'src/repair-invoice/rapair-invoice.entity';
import { PeriodicType } from 'src/periodic-type/periodic-type.entity';

@Injectable()
export class ExcelReportsService {

    constructor(
        @Inject('TRUCKBREAKDOWN_REPOSITORY')
        private readonly truckBreakDownRepository: typeof TruckBreakDown,
        @Inject('AUTH_REPOSITORY')
        private readonly authRepository: typeof Auth,
        @Inject('TRUCKBREAKDOWNITEMS_REPOSITORY')
        private readonly truckBreakDownItemsRepository: typeof TruckBreakDownItems,
        @Inject('CHECKLIST_REPOSITORY')
        private readonly checkListRepository: typeof CheckList,
        @Inject('PERIODIC_TRUCK_CHECK_REPOSITORY')
        private readonly periodicTruckCheckRepository: typeof PeriodicTruckCheck,
        @Inject('TRUCKINFO_REPOSITORY')
        private readonly truckInfoRepository: typeof TruckInfo,
        @Inject('REPAIRINVOICE_REPOSITORY')
        private readonly repairInvoiceRepository: typeof RepairInvoice,
        private readonly authService: AuthService,
    ){}
    

    // async exportAllBreakdownFieldsToExcel(
    //     excelFilterDto: ExcelFilterDto
    //   ) {
    //     const {driverNames , companies , zones , startDate , endDate , pieces , carNumbers} = excelFilterDto
    //     const authFilter: any = {};
    //     const breakdownFilter: any = {};
      
    //     if (zones && zones.length > 0) authFilter.zone = { [Op.in]: zones };
    //     if (companies && companies.length > 0) authFilter.company = { [Op.in]: companies };
      
    //     const authRecords = await this.authRepository.findAll({
    //       where: authFilter,
    //       attributes: ['id', 'name', 'company', 'zone'],
    //     });
      
    //     const driverIds = authRecords.map((auth) => auth.id);
      
    //     if (carNumbers && carNumbers.length > 0) {
    //       breakdownFilter.carNumber = { [Op.in]: carNumbers };
    //     }
      
    //     if (startDate && endDate) {
    //         const start = new Date(startDate);
    //         start.setHours(0, 0, 0, 0);
        
    //         const end = new Date(endDate);
    //         end.setHours(0, 0, 0, 0);
        
    //         breakdownFilter.createdAt = {
    //             [Op.between]: [start, end],
    //         };
    //     }
      
    //     if (driverNames && driverNames.length > 0) {
    //       breakdownFilter.driverName = { [Op.in]: driverNames };
    //     }
      
    //     if (pieces && pieces.length > 0) {
    //       breakdownFilter.piece = { [Op.in]: pieces };
    //     }
      
    //     if (driverIds.length > 0) breakdownFilter.driverId = { [Op.in]: driverIds };
      
    //     const breakdownRecords = await this.truckBreakDownRepository.findAll({
    //       where: breakdownFilter,
    //     });
      
    //     const combinedData = breakdownRecords.map((breakdown) => {
    //       const auth = authRecords.find((auth) => auth.id === breakdown.driverId);
    //       return {
    //         ...breakdown.toJSON(),
    //         company: auth?.company || 'نامشخص',
    //         zone: auth?.zone || 'نامشخص',
    //       };
    //     });
      
    //     const workbook = new Workbook();
    //     const worksheet = workbook.addWorksheet('گزارش خرابی‌ها');
      
    //     worksheet.columns = [
    //         { header: 'شناسه راننده', key: 'driverId', width: 15 },
    //         { header: 'نام راننده', key: 'driverName', width: 20 },
    //         { header: 'شماره ماشین', key: 'carNumber', width: 15 },
    //         { header: 'تاریخ ثبت', key: 'historyDriverRegister', width: 20 },
    //         { header: 'تعداد خرابی', key: 'numberOfBreakDown', width: 15 },
    //         { header: 'شرکت', key: 'company', width: 20 },
    //         { header: 'منطقه', key: 'zone', width: 15 },
    //         { header: 'نظر لجستیک', key: 'logisticComment', width: 20 },
    //         { header: 'ساعت ثبت راننده', key: 'hoursDriverRegister', width: 15 },
    //         { header: 'سابقه تعمیرات', key: 'historyRepairComment', width: 20 },
    //         { header: 'کیلومتر', key: 'carLife', width: 20 },
    //         { header: 'تایید لجستیک', key: 'logisticConfirm', width: 20 },
    //         { header: 'تاریخ ثبت راننده', key: 'historyDriverRegister', width: 25 },
    //         { header: 'نظر ترابری' , key: 'transportComment', width: 20 },
    //         { header: 'تاریخ ارسال به مکانیک' , key: 'historySendToRepair', width: 25 },
    //         { header: 'تاریخ دریافت از مکانیک' , key: 'historyReciveToRepair', width: 25 },
    //         { header: 'تاریخ تحویل ماشین', key: 'histroyDeliveryTruck', width: 25 },
    //         { header: 'تاریخ تحویل به راننده', key: 'historyDeliveryDriver', width: 20 },
    //         { header: 'قطعه' , key: 'piece', width: 50 },
    //         { header: 'نظر مکانیک' , key: 'repairmanComment', width: 20 },
    //         { header: 'ساعت نظر مکانیک' , key: 'hoursRepairComment', width: 25 },
    //         { header: 'تاریخ نظر مکانیک' , key: 'historyRepairComment', width: 25 },
    //         { header: 'تاریخ نظر ترابری' , key: 'transportCommentHistory', width: 20 },
    //         { header: 'نوع کارتکس' , key: 'cartexType', width: 20 },
    //         { header: 'تاریخ ایجاد' , key: 'createdAt', width: 20 },
    //     ];
      
    //     const headerRow = worksheet.getRow(1);
    //     headerRow.eachCell((cell) => {
    //       cell.font = {
    //         bold: true,
    //         size: 12,
    //         name: 'Arial',
    //       };
    //       cell.alignment = {
    //         vertical: 'middle',
    //         horizontal: 'center',
    //       };
    //       cell.fill = {
    //         type: 'pattern',
    //         pattern: 'solid',
    //         fgColor: { argb: 'FFFF00' },
    //       };
    //     });
      
    //     headerRow.height = 20;
      
    //     if (combinedData.length > 0) {
    //       combinedData.forEach((data) => {
    //         const row = worksheet.addRow(data);
    //         row.eachCell((cell) => {
    //           cell.alignment = {
    //             vertical: 'middle',
    //             horizontal: 'center',
    //           };
    //         });
    //       });
    //     } else {
    //       const row = worksheet.addRow(['اطلاعاتی یافت نشد']);
    //       row.eachCell((cell) => {
    //         cell.alignment = {
    //           vertical: 'middle',
    //           horizontal: 'center',
    //         };
    //       });
    //     }
      
    //     const buffer = await workbook.xlsx.writeBuffer();
    //     return buffer;
    //   }
      
  
    
      // async exportAllBreakdownFieldsToExcel(excelFilterDto: ExcelFilterDto) {
      //   const { driverNames, companies, zones, startDate, endDate, pieces, carNumbers } = excelFilterDto;
      //   const authFilter: any = {};
      //   const breakdownFilter: any = {};
      
      //   // فیلتر منطقه و شرکت
      //   if (zones && zones.length > 0) authFilter.zone = { [Op.in]: zones };
      //   if (companies && companies.length > 0) authFilter.company = { [Op.in]: companies };
      
      //   // دریافت رانندگان با توجه به فیلتر
      //   const authRecords = await this.authRepository.findAll({
      //     where: authFilter,
      //     attributes: ['id', 'name', 'company', 'zone', 'personelCode'], // اضافه کردن personelCode
      //   });
      
      //   const driverIds = authRecords.map((auth) => auth.id);
      
      //   // فیلتر شماره ماشین
      //   if (carNumbers && carNumbers.length > 0) {
      //     breakdownFilter.carNumber = { [Op.in]: carNumbers };
      //   }
      
      //   // فیلتر تاریخ
      //   if (startDate && endDate) {
      //     const start = new Date(startDate);
      //     start.setHours(0, 0, 0, 0);
      
      //     const end = new Date(endDate);
      //     end.setHours(23, 59, 59, 999);
      
      //     breakdownFilter.createdAt = {
      //       [Op.between]: [start, end],
      //     };
      //   }
      
      //   // فیلتر نام راننده
      //   if (driverNames && driverNames.length > 0) {
      //     breakdownFilter.driverName = { [Op.in]: driverNames };
      //   }
      
      //   // فیلتر راننده
      //   if (driverIds.length > 0) breakdownFilter.driverId = { [Op.in]: driverIds };
      
      //   // دریافت رکوردهای خرابی
      //   const breakdownRecords = await this.truckBreakDownRepository.findAll({
      //     where: breakdownFilter,
      //     attributes: [
      //       'id',
      //       'driverId',
      //       'driverName',
      //       'carNumber',
      //       'driverMobile', // اضافه کردن شماره موبایل راننده
      //       'historyDriverRegister',
      //       'numberOfBreakDown',
      //       'logisticComment',
      //       'hoursDriverRegister',
      //       'historyRepairComment',
      //       'carLife',
      //       'logisticConfirm',
      //       'historySendToRepair',
      //       'historyReciveToRepair',
      //       'histroyDeliveryTruck',
      //       'historyDeliveryDriver',
      //       'repairmanComment',
      //       'hoursRepairComment',
      //       'transportCommentHistory',
      //       'cartexType',
      //       'createdAt',
      //     ],
      //   });
      
      //   if (!breakdownRecords || breakdownRecords.length === 0) {
      //     return {
      //       status: 200,
      //       data: [],
      //       message: 'اطلاعاتی یافت نشد',
      //     };
      //   }
      
      //   const breakdownIds = breakdownRecords.map((record) => record.id);
      //   const invoiceFactors = await this.repairInvoiceRepository.findAll({
      //     where: { truckBreakDownId: { [Op.in]: breakdownIds } },
      //     attributes: ['truckBreakDownId', 'piece', 'amount', 'providerName', 'carNumber'],
      //   });
      
      //   // ترکیب داده‌ها
      //   // ترکیب داده‌ها
      // const combinedData = breakdownRecords.flatMap((breakdown) => {
      //   const invoiceData = invoiceFactors.filter((invoice) => invoice.truckBreakDownId === breakdown.id);
      //   const auth = authRecords.find((auth) => auth.id === breakdown.driverId);

      //   // اگر هیچ فاکتوری برای خرابی وجود نداشت، یک سطر بدون فاکتور اضافه شود
      //   if (invoiceData.length === 0) {
      //     return {
      //       id: breakdown.id || 'نامشخص',
      //       driverId: breakdown.driverId || 'نامشخص',
      //       driverName: breakdown.driverName || 'نامشخص',
      //       driverMobile: breakdown.driverMobile || 'نامشخص',
      //       personelCode: auth?.personelCode || 'نامشخص',
      //       carNumber: breakdown.carNumber || 'نامشخص',
      //       historyDriverRegister: breakdown.historyDriverRegister || 'نامشخص',
      //       numberOfBreakDown: breakdown.numberOfBreakDown || 0,
      //       logisticComment: breakdown.logisticComment || '',
      //       hoursDriverRegister: breakdown.hoursDriverRegister || '',
      //       historyRepairComment: breakdown.historyRepairComment || '',
      //       carLife: breakdown.carLife || '',
      //       logisticConfirm: breakdown.logisticConfirm || '',
      //       historySendToRepair: breakdown.historySendToRepair || '',
      //       historyReciveToRepair: breakdown.historyReciveToRepair || '',
      //       histroyDeliveryTruck: breakdown.histroyDeliveryTruck || '',
      //       historyDeliveryDriver: breakdown.historyDeliveryDriver || '',
      //       repairmanComment: breakdown.repairmanComment || '',
      //       hoursRepairComment: breakdown.hoursRepairComment || '',
      //       transportCommentHistory: breakdown.transportCommentHistory || '',
      //       transportComment: breakdown.transportComment || '',
      //       cartexType: breakdown.cartexType || '',
      //       createdAt: breakdown.createdAt || '',
      //       company: auth?.company || 'نامشخص',
      //       zone: auth?.zone || 'نامشخص',
      //       brokenPiece: breakdown.piece || 'نامشخص',
      //       piece: 'بدون فاکتور', // نشان‌دهنده عدم وجود فاکتور
      //       amount: '',
      //       carNumberSystem: '',
      //       providerName: '',
      //       carNumberFromInvoice: '',
      //     };
      //   }

      //   // اگر فاکتور وجود دارد، برای هر قطعه یک سطر جداگانه اضافه شود
      //   return invoiceData.map((invoice) => ({
      //     id: breakdown.id || 'نامشخص',
      //     driverId: breakdown.driverId || 'نامشخص',
      //     driverName: breakdown.driverName || 'نامشخص',
      //     driverMobile: breakdown.driverMobile || 'نامشخص',
      //     personelCode: auth?.personelCode || 'نامشخص',
      //     carNumber: breakdown.carNumber || 'نامشخص',
      //     historyDriverRegister: breakdown.historyDriverRegister || 'نامشخص',
      //     numberOfBreakDown: breakdown.numberOfBreakDown || 0,
      //     logisticComment: breakdown.logisticComment || '',
      //     hoursDriverRegister: breakdown.hoursDriverRegister || '',
      //     historyRepairComment: breakdown.historyRepairComment || '',
      //     carLife: breakdown.carLife || '',
      //     logisticConfirm: breakdown.logisticConfirm || '',
      //     historySendToRepair: breakdown.historySendToRepair || '',
      //     historyReciveToRepair: breakdown.historyReciveToRepair || '',
      //     histroyDeliveryTruck: breakdown.histroyDeliveryTruck || '',
      //     historyDeliveryDriver: breakdown.historyDeliveryDriver || '',
      //     repairmanComment: breakdown.repairmanComment || '',
      //     hoursRepairComment: breakdown.hoursRepairComment || '',
      //     transportCommentHistory: breakdown.transportCommentHistory || '',
      //     transportComment: breakdown.transportComment || '',
      //     cartexType: breakdown.cartexType || '',
      //     createdAt: breakdown.createdAt || '',
      //     company: auth?.company || 'نامشخص',
      //     zone: auth?.zone || 'نامشخص',
      //     brokenPiece: breakdown.piece || 'نامشخص',
      //     piece: invoice.piece || 'نامشخص', // قطعه مربوط به این فاکتور
      //     amount: invoice.amount || '', // هزینه قطعه مربوط به این فاکتور
      //     carNumberSystem: invoice.carNumberSystem || '',
      //     providerName: invoice.providerName || '', // نام تأمین‌کننده قطعه
      //     carNumberFromInvoice: invoice.carNumber || '',
      //   }));
      // });

      //   // ساخت فایل اکسل
      //   const workbook = new Workbook();
      //   const worksheet = workbook.addWorksheet('گزارش خرابی‌ها');
      
      //   worksheet.columns = [
      //     { header: 'شناسه ثبت ( شماره سفارش )', key: 'id', width: 25 },
      //     { header: 'تاریخ ثبت', key: 'historyDriverRegister', width: 20 },
      //     { header: 'ساعت ثبت', key: 'hoursDriverRegister', width: 20 },
      //     { header: 'کد پرسنلی', key: 'personelCode', width: 15 }, // کد پرسنلی
      //     { header: 'نام راننده', key: 'driverName', width: 20 },
      //     { header: 'تلفن راننده', key: 'driverMobile', width: 15 }, // شماره موبایل
      //     { header: 'شماره پلاک', key: 'carNumber', width: 15 },
      //     { header: 'کیلومتر ثبت شده خودرو', key: 'carLife', width: 20 },
      //     { header: 'نام منطقه ثبت', key: 'zone', width: 15 },
      //     { header: 'نام شرکت ثبت', key: 'company', width: 20 },
      //     { header: 'نام خرابی اعلام شده توسط راننده ', key: 'brokenPiece', width: 25 },
      //     { header: 'نظر سرپرست لجستیک', key: 'logisticComment', width: 20 },
      //     { header: 'نظر سرپرست ترابری', key: 'transportComment', width: 20 },
      //     { header: 'نظر سرپرست تعمیرگاه', key: 'repairmanComment', width: 20 },
      //     { header: 'تاریخ اعزام به تعمیرگاه', key: 'historySendToRepair', width: 25 },
      //     { header: 'قطعه مصرفی', key: 'piece', width: 15 },
      //     { header: 'هزینه قطعه مصرفی', key: 'amount', width: 15 },
      //     { header: 'پلاک سیستمی خودرو', key: 'carNumberSystem', width: 15 },
      //     { header: 'تاریخ تحویل به راننده', key: 'historyDeliveryDriver', width: 25 },
      //     { header: 'شماره ماشین از فاکتور', key: 'carNumberFromInvoice', width: 20 },
      //     { header: 'سابقه تعمیرات', key: 'historyRepairComment', width: 20 },
      //   ];
      
      //   const headerRow = worksheet.getRow(1);
      //   headerRow.eachCell((cell) => {
      //     cell.font = {
      //       bold: true,
      //       size: 12,
      //       name: 'B Titr',
      //       color: { argb: 'FFFFA500' },
      //     };
      //     cell.alignment = { vertical: 'middle', horizontal: 'center' };
      //     cell.fill = {
      //       type: 'pattern',
      //       pattern: 'solid',
      //       fgColor: { argb: '000080' },
      //     };
      //   });
      //   headerRow.height = 20;
      
      //   combinedData.forEach((data) => {
      //     const row = worksheet.addRow(data);
      //     row.eachCell((cell) => {
      //       cell.alignment = {
      //         vertical: 'middle',
      //         horizontal: 'center',
      //       };
      //       cell.font = { size: 11 };
      //     });
      //   });

      //   console.log(combinedData);
        
      
      //   // worksheet.eachRow((row, rowNumber) => {
      //   //   if (rowNumber !== 1) {
      //   //     row.height = 18;
      //   //   }
      //   // });
      
      //   // تولید خروجی اکسل
      //   const buffer = await workbook.xlsx.writeBuffer();
      //   return buffer;
      // }


    //   async exportAllBreakdownFieldsToExcel(excelFilterDto: ExcelFilterDto) {
    //     const { driverNames, companies, zones, startDate, endDate, pieces, carNumbers } = excelFilterDto;
    //     const authFilter: any = {};
    //     const breakdownFilter: any = {};
    
    //     // فیلتر منطقه و شرکت
    //     if (zones && zones.length > 0) authFilter.zone = { [Op.in]: zones };
    //     if (companies && companies.length > 0) authFilter.company = { [Op.in]: companies };
    
    //     // دریافت رانندگان با توجه به فیلتر
    //     const authRecords = await this.authRepository.findAll({
    //         where: authFilter,
    //         attributes: ['id', 'name', 'company', 'zone', 'personelCode'], // اضافه کردن personelCode
    //     });
    
    //     const driverIds = authRecords.map((auth) => auth.id);
    
    //     // فیلتر شماره ماشین
    //     if (carNumbers && carNumbers.length > 0) {
    //         breakdownFilter.carNumber = { [Op.in]: carNumbers };
    //     }
    
    //     // فیلتر تاریخ
    //     if (startDate && endDate) {
    //         const start = new Date(startDate);
    //         start.setHours(0, 0, 0, 0);
    
    //         const end = new Date(endDate);
    //         end.setHours(23, 59, 59, 999);
    
    //         breakdownFilter.createdAt = {
    //             [Op.between]: [start, end],
    //         };
    //     }
    
    //     // فیلتر نام راننده
    //     if (driverNames && driverNames.length > 0) {
    //         breakdownFilter.driverName = { [Op.in]: driverNames };
    //     }
    
    //     // فیلتر راننده
    //     if (driverIds.length > 0) breakdownFilter.driverId = { [Op.in]: driverIds };
    
    //     // دریافت رکوردهای خرابی با استفاده از روابط
    //     const breakdownRecords = await this.truckBreakDownRepository.findAll({
    //         where: breakdownFilter,
    //         attributes: ['id', 'driverId', 'driverName', 'carNumber', 'driverMobile', 'createdAt'],
    //         include: [
    //             {
    //                 model: TruckBreakDownItems,
    //                 attributes: [
    //                     'question_1', 'answer_1',
    //                     'question_2', 'answer_2',
    //                     'question_3', 'answer_3',
    //                     'question_4', 'answer_4',
    //                     'question_6', 'answer_6',
    //                     'question_7', 'answer_7',
    //                     'question_8', 'answer_8',
    //                     'question_9', 'answer_9',
    //                     'question_10', 'answer_10',
    //                     'question_11', 'answer_11',
    //                     'question_12', 'answer_12',
    //                     'question_13', 'answer_13',
    //                     'question_14', 'answer_14',
    //                     'question_15', 'answer_15',
    //                     'question_16', 'answer_16',
    //                     'question_17', 'answer_17',
    //                     'question_18', 'answer_18',
    //                     'question_19', 'answer_19',
    //                     'question_20', 'answer_20',
    //                     'question_21', 'answer_21',
    //                     'question_22', 'answer_22',
    //                     'question_23', 'answer_23',
    //                     'question_24', 'answer_24',
    //                     'question_25', 'answer_25',
    //                     'question_26', 'answer_26',
    //                     'question_27', 'answer_27',
    //                     'question_28', 'answer_28',
    //                     'question_29', 'answer_29',
    //                     'question_30', 'answer_30',
    //                     'question_31', 'answer_31',
    //                     'question_32', 'answer_32',
    //                     'question_33', 'answer_33',
    //                     'question_34', 'answer_34',
    //                 ], 
    //             },
    //         ],
    //     });
    
    //     if (!breakdownRecords || breakdownRecords.length === 0) {
    //         return {
    //             status: 200,
    //             data: [],
    //             message: 'اطلاعاتی یافت نشد',
    //         };
    //     }
    
    //     // ترکیب داده‌ها
    //     const combinedData = breakdownRecords.flatMap((breakdown) => {
    //         const items = Array.isArray(breakdown.truckBreakDownItems) ? breakdown.truckBreakDownItems : []; // بررسی آرایه بودن truckBreakDownItems
    //         const auth = authRecords.find((auth) => auth.id === breakdown.driverId);
    
    //         // اگر سوالات و جواب‌ها وجود داشته باشد
    //         return items.flatMap((item) => {
    //             // جمع آوری تمام سوالات و جواب‌ها به صورت یک آرایه
    //             const questionsAndAnswers = [];
    //             for (let i = 1; i <= 34; i++) { // فرض بر این است که حداکثر 5 سوال داریم
    //                 const question = item[`question_${i}`];
    //                 const answer = item[`answer_${i}`];
    //                 if (question && answer) {
    //                     questionsAndAnswers.push({
    //                         question,
    //                         answer,
    //                     });
    //                 }
    //             }
    
    //             // برای هر سوال و جواب یک ردیف ایجاد می‌کنیم
    //             return questionsAndAnswers.map(({ question, answer }) => ({
    //                 id: breakdown.id || 'نامشخص',
    //                 driverId: breakdown.driverId || 'نامشخص',
    //                 driverName: breakdown.driverName || 'نامشخص',
    //                 hours: breakdown.hoursDriverRegister || 'نامشخص',
    //                 driverMobile: breakdown.driverMobile || 'نامشخص',
    //                 personelCode: auth?.personelCode || 'نامشخص',
    //                 carNumber: breakdown.carNumber || 'نامشخص',
    //                 kilometer: breakdown.carLife || 'نامشخص',
    //                 logestic: breakdown.logisticComment || 'نامشخص',
    //                 transport: breakdown.transportComment || 'نامشخص',
    //                 dateToMechanic: breakdown.historySendToRepair || 'نامشخص',
    //                 question: question || 'نامشخص', // سوال
    //                 answer: answer || 'نامشخص', // جواب
    //                 createdAt: breakdown.createdAt || '',
    //                 company: auth?.company || 'نامشخص',
    //                 zone: auth?.zone || 'نامشخص',
    //             }));
    //         });
    //     });


    //     console.log(combinedData);
        
        
    
    //     // ساخت فایل اکسل
    //     const workbook = new Workbook();
    //     const worksheet = workbook.addWorksheet('گزارش خرابی‌ها');
    
    //     worksheet.columns = [
    //         { header:' شناسه ثبت ( شماره سفارش )', key: 'id', width: 20 },
    //         { header: 'تاریخ ثبت', key: 'createdAt', width: 20 },
    //         { header: 'ساعت ثبت', key: 'hours', width: 20 },
    //         { header: 'نام راننده', key: 'driverName', width: 20 },
    //         { header: 'کد پرسنلی', key: 'personelCode', width: 15 },
    //         { header: 'تلفن راننده', key: 'driverMobile', width: 15 },
    //         { header: 'شماره پلاک', key: 'carNumber', width: 15 },
    //         { header: 'کیلومتر ثبت شده خودرو', key: 'kilometer', width: 15 },
    //         { header: 'نام منطقه ثبت', key: 'zone', width: 15 },
    //         { header: 'نام شرکت ثبت', key: 'company', width: 20 },
    //         { header: 'نام خرابی اعلام شده توسط راننده', key: 'question', width: 30 },
    //         { header: 'توضیحات راننده', key: 'answer', width: 30 },
    //     ];
    
    //     const headerRow = worksheet.getRow(1);
    //     headerRow.eachCell((cell) => {
    //         cell.font = {
    //             bold: true,
    //             size: 12,
    //             name: 'B Titr',
    //             color: { argb: 'FFFFA500' },
    //         };
    //         cell.alignment = { vertical: 'middle', horizontal: 'center' };
    //         cell.fill = {
    //             type: 'pattern',
    //             pattern: 'solid',
    //             fgColor: { argb: '000080' },
    //         };
    //     });
    //     headerRow.height = 20;
    
    //     combinedData.forEach((data) => {
    //         const row = worksheet.addRow(data);
    //         row.eachCell((cell) => {
    //             cell.alignment = {
    //                 vertical: 'middle',
    //                 horizontal: 'center',
    //             };
    //             cell.font = { size: 11 };
    //         });
    //     });
    
    //     worksheet.eachRow((row, rowNumber) => {
    //         if (rowNumber !== 1) {
    //             row.height = 18;
    //         }
    //     });
    
    //     // تولید خروجی اکسل
    //     const buffer = await workbook.xlsx.writeBuffer();
    //     return buffer;
    // }




    // async exportAllBreakdownFieldsToExcel(
    //   excelFilterDto: ExcelFilterDto
    // ) {
    //   const { driverNames, companies, zones, startDate, endDate, pieces, carNumbers } = excelFilterDto;
    //   const authFilter: any = {};
    //   const breakdownFilter: any = {};
    
    //   if (zones && zones.length > 0) authFilter.zone = { [Op.in]: zones };
    //   if (companies && companies.length > 0) authFilter.company = { [Op.in]: companies };
    
    //   const authRecords = await this.authRepository.findAll({
    //     where: authFilter,
    //     attributes: ['id', 'name', 'company', 'zone'],
    //   });
    
    //   const driverIds = authRecords.map((auth) => auth.id);
    
    //   if (carNumbers && carNumbers.length > 0) {
    //     breakdownFilter.carNumber = { [Op.in]: carNumbers };
    //   }
    
    //   if (startDate && endDate) {
    //     const start = new Date(startDate);
    //     start.setHours(0, 0, 0, 0);
    
    //     const end = new Date(endDate);
    //     end.setHours(0, 0, 0, 0);
    
    //     breakdownFilter.createdAt = {
    //       [Op.between]: [start, end],
    //     };
    //   }
    
    //   if (driverNames && driverNames.length > 0) {
    //     breakdownFilter.driverName = { [Op.in]: driverNames };
    //   }
    
    //   if (pieces && pieces.length > 0) {
    //     breakdownFilter.piece = { [Op.in]: pieces };
    //   }
    
    //   if (driverIds.length > 0) breakdownFilter.driverId = { [Op.in]: driverIds };
    
    //   const breakdownRecords = await this.truckBreakDownRepository.findAll({
    //     where: breakdownFilter,
    //   });
    
    //   const combinedData = await Promise.all(breakdownRecords.map(async (breakdown) => {
    //     const auth = authRecords.find((auth) => auth.id === breakdown.driverId);
    
    //     // استخراج سوالات و جواب‌ها و قطعات مصرفی از جدول truckBreakDownItems
    //     const breakdownItems = await this.truckBreakDownItemsRepository.findAll({
    //       where: { breakdownId: breakdown.id },
    //     });
    
    //     const items = breakdownItems.map((item) => ({
    //       question: item.question,
    //       answer: item.answer,
    //       piece: item.piece,
    //     }));
    
    //     return {
    //       ...breakdown.toJSON(),
    //       company: auth?.company || 'نامشخص',
    //       zone: auth?.zone || 'نامشخص',
    //       breakdownItems: items, // اضافه کردن سوالات و جواب‌ها و قطعات مصرفی
    //     };
    //   }));
    
    //   const workbook = new Workbook();
    //   const worksheet = workbook.addWorksheet('گزارش خرابی‌ها');
    
    //   worksheet.columns = [
    //     { header: 'شناسه راننده', key: 'driverId', width: 15 },
    //     { header: 'نام راننده', key: 'driverName', width: 20 },
    //     { header: 'شماره ماشین', key: 'carNumber', width: 15 },
    //     { header: 'تاریخ ثبت', key: 'historyDriverRegister', width: 20 },
    //     { header: 'تعداد خرابی', key: 'numberOfBreakDown', width: 15 },
    //     { header: 'شرکت', key: 'company', width: 20 },
    //     { header: 'منطقه', key: 'zone', width: 15 },
    //     { header: 'نظر لجستیک', key: 'logisticComment', width: 20 },
    //     { header: 'ساعت ثبت راننده', key: 'hoursDriverRegister', width: 15 },
    //     { header: 'سابقه تعمیرات', key: 'historyRepairComment', width: 20 },
    //     { header: 'کیلومتر', key: 'carLife', width: 20 },
    //     { header: 'تایید لجستیک', key: 'logisticConfirm', width: 20 },
    //     { header: 'تاریخ ثبت راننده', key: 'historyDriverRegister', width: 25 },
    //     { header: 'نظر ترابری' , key: 'transportComment', width: 20 },
    //     { header: 'تاریخ ارسال به مکانیک' , key: 'historySendToRepair', width: 25 },
    //     { header: 'تاریخ دریافت از مکانیک' , key: 'historyReciveToRepair', width: 25 },
    //     { header: 'تاریخ تحویل ماشین', key: 'histroyDeliveryTruck', width: 25 },
    //     { header: 'تاریخ تحویل به راننده', key: 'historyDeliveryDriver', width: 20 },
    //     { header: 'قطعه' , key: 'piece', width: 50 },
    //     { header: 'نظر مکانیک' , key: 'repairmanComment', width: 20 },
    //     { header: 'ساعت نظر مکانیک' , key: 'hoursRepairComment', width: 25 },
    //     { header: 'تاریخ نظر مکانیک' , key: 'historyRepairComment', width: 25 },
    //     { header: 'تاریخ نظر ترابری' , key: 'transportCommentHistory', width: 20 },
    //     { header: 'نوع کارتکس' , key: 'cartexType', width: 20 },
    //     { header: 'تاریخ ایجاد' , key: 'createdAt', width: 20 },
    //     { header: 'سوال', key: 'question', width: 50 },
    //     { header: 'جواب', key: 'answer', width: 50 },
    //   ];
    
    //   const headerRow = worksheet.getRow(1);
    //   headerRow.eachCell((cell) => {
    //     cell.font = {
    //       bold: true,
    //       size: 12,
    //       name: 'Arial',
    //     };
    //     cell.alignment = {
    //       vertical: 'middle',
    //       horizontal: 'center',
    //     };
    //     cell.fill = {
    //       type: 'pattern',
    //       pattern: 'solid',
    //       fgColor: { argb: 'FFFF00' },
    //     };
    //   });
    
    //   headerRow.height = 20;
    
    //   if (combinedData.length > 0) {
    //     combinedData.forEach((data) => {
    //       // برای هر قطعه و سوال و جواب یک سطر جدید اضافه می‌شود
    //       data.breakdownItems.forEach((item) => {
    //         const row = worksheet.addRow({
    //           ...data,
    //           question: item.question,  // اضافه کردن سوال
    //           answer: item.answer,      // اضافه کردن جواب
    //         });
    //         row.eachCell((cell) => {
    //           cell.alignment = {
    //             vertical: 'middle',
    //             horizontal: 'center',
    //           };
    //         });
    //       });
    //     });
    //   } else {
    //     const row = worksheet.addRow(['اطلاعاتی یافت نشد']);
    //     row.eachCell((cell) => {
    //       cell.alignment = {
    //         vertical: 'middle',
    //         horizontal: 'center',
    //       };
    //     });
    //   }
    
    //   const buffer = await workbook.xlsx.writeBuffer();
    //   return buffer;
    // }



    // async exportAllBreakdownFieldsToExcel(excelFilterDto: ExcelFilterDto) {
    //   const { driverNames, companies, zones, startDate, endDate, pieces, carNumbers } = excelFilterDto;
    //   const authFilter: any = {};
    //   const breakdownFilter: any = {};
    
    //   if (zones && zones.length > 0) authFilter.zone = { [Op.in]: zones };
    //   if (companies && companies.length > 0) authFilter.company = { [Op.in]: companies };
    
    //   const authRecords = await this.authRepository.findAll({
    //     where: authFilter,
    //     attributes: ['id', 'name', 'company', 'zone'],
    //   });
    
    //   const driverIds = authRecords.map((auth) => auth.id);
    
    //   if (carNumbers && carNumbers.length > 0) {
    //     breakdownFilter.carNumber = { [Op.in]: carNumbers };
    //   }
    
    //   if (startDate && endDate) {
    //     breakdownFilter.createdAt = {
    //       [Op.between]: [
    //         new Date(startDate).setHours(0, 0, 0, 0),
    //         new Date(endDate).setHours(23, 59, 59, 999),
    //       ],
    //     };
    //   }
    
    //   if (driverNames && driverNames.length > 0) {
    //     breakdownFilter.driverName = { [Op.in]: driverNames };
    //   }
    
    //   if (pieces && pieces.length > 0) {
    //     breakdownFilter.piece = { [Op.in]: pieces };
    //   }
    
    //   if (driverIds.length > 0) breakdownFilter.driverId = { [Op.in]: driverIds };
    
    //   const breakdownRecords = await this.truckBreakDownRepository.findAll({
    //     where: breakdownFilter,
    //   });
    
    //   const combinedData = await Promise.all(
    //     breakdownRecords.map(async (breakdown) => {
    //       const auth = authRecords.find((auth) => auth.id === breakdown.driverId);
    
    //       // دریافت اطلاعات سوالات و جواب‌ها
    //       const breakdownItems = await this.truckBreakDownItemsRepository.findOne({
    //         where: { id: breakdown.truckBreakDownItemsId },
    //       });
    
    //       // دریافت اطلاعات فاکتورها
    //       const repairInvoices = await this.repairInvoiceRepository.findAll({
    //         where: { truckBreakDownId: breakdown.id },
    //       });
    
    //       const items = [];
    //       if (breakdownItems) {
    //         for (let i = 1; i <= 34; i++) {
    //           const question = breakdownItems[`question_${i}`];
    //           const answer = breakdownItems[`answer_${i}`];
    //           if (question && answer) {
    //             items.push({ question, answer });
    //           }
    //         }
    //       }
    
    //       const parts = repairInvoices.length > 0
    //         ? repairInvoices.map((invoice) => invoice.piece).join(', ')
    //         : 'بدون قطعه';
    
    //       return {
    //         ...breakdown.toJSON(),
    //         company: auth?.company || 'نامشخص',
    //         zone: auth?.zone || 'نامشخص',
    //         breakdownItems: items,
    //         repairParts: parts,
    //       };
    //     })
    //   );
    
    //   // ایجاد فایل اکسل
    //   const workbook = new Workbook();
    //   const worksheet = workbook.addWorksheet('گزارش خرابی‌ها');
    
    //   worksheet.columns = [
    //     { header: 'شناسه راننده', key: 'driverId', width: 15 },
    //     { header: 'نام راننده', key: 'driverName', width: 20 },
    //     { header: 'شماره ماشین', key: 'carNumber', width: 15 },
    //     { header: 'تاریخ ثبت', key: 'createdAt', width: 20 },
    //     { header: 'شرکت', key: 'company', width: 20 },
    //     { header: 'منطقه', key: 'zone', width: 15 },
    //     { header: 'قطعه', key: 'repairParts', width: 50 },
    //     { header: 'سوال', key: 'question', width: 50 },
    //     { header: 'جواب', key: 'answer', width: 50 },
    //   ];
    
    //   const headerRow = worksheet.getRow(1);
    //   headerRow.eachCell((cell) => {
    //     cell.font = { bold: true, size: 12 };
    //     cell.alignment = { vertical: 'middle', horizontal: 'center' };
    //     cell.fill = {
    //       type: 'pattern',
    //       pattern: 'solid',
    //       fgColor: { argb: 'FFFF00' },
    //     };
    //   });
    
    //   if (combinedData.length > 0) {
    //     combinedData.forEach((data) => {
    //       if (data.breakdownItems.length > 0) {
    //         data.breakdownItems.forEach((item) => {
    //           worksheet.addRow({
    //             ...data,
    //             question: item.question,
    //             answer: item.answer,
    //           });
    //         });
    //       } else {
    //         worksheet.addRow({
    //           ...data,
    //           question: 'بدون سوال',
    //           answer: 'بدون جواب',
    //         });
    //       }
    //     });
    //   } else {
    //     worksheet.addRow(['اطلاعاتی یافت نشد']);
    //   }
    
    //   const buffer = await workbook.xlsx.writeBuffer();
    //   return buffer;
    // }


    async exportAllBreakdownFieldsToExcel(excelFilterDto: ExcelFilterDto) {
      const { driverNames, companies, zones, startDate, endDate, pieces, carNumbers } = excelFilterDto;
      const authFilter: any = {};
      const breakdownFilter: any = {};
    
      if (zones && zones.length > 0) authFilter.zone = { [Op.in]: zones };
      if (companies && companies.length > 0) authFilter.company = { [Op.in]: companies };
    
      const authRecords = await this.authRepository.findAll({
        where: authFilter,
        attributes: ['id', 'name', 'company', 'zone'],
      });
    
      const driverIds = authRecords.map((auth) => auth.id);
    
      if (carNumbers && carNumbers.length > 0) {
        breakdownFilter.carNumber = { [Op.in]: carNumbers };
      }
    
      if (startDate && endDate) {
        breakdownFilter.createdAt = {
          [Op.between]: [
            new Date(startDate).setHours(0, 0, 0, 0),
            new Date(endDate).setHours(23, 59, 59, 999),
          ],
        };
      }
    
      if (driverNames && driverNames.length > 0) {
        breakdownFilter.driverName = { [Op.in]: driverNames };
      }
    
      if (pieces && pieces.length > 0) {
        breakdownFilter.piece = { [Op.in]: pieces };
      }
    
      if (driverIds.length > 0) breakdownFilter.driverId = { [Op.in]: driverIds };
    
      const breakdownRecords = await this.truckBreakDownRepository.findAll({
        where: breakdownFilter,
      });
    
      const combinedData = await Promise.all(
        breakdownRecords.map(async (breakdown) => {
          const auth = authRecords.find((auth) => auth.id === breakdown.driverId);
    
          const breakdownItems = await this.truckBreakDownItemsRepository.findOne({
            where: { id: breakdown.truckBreakDownItemsId },
          });
    
          const repairInvoices = await this.repairInvoiceRepository.findAll({
            where: { truckBreakDownId: breakdown.id },
          });
    
          const items = [];
          if (breakdownItems) {
            for (let i = 1; i <= 34; i++) {
              const question = breakdownItems[`question_${i}`];
              const answer = breakdownItems[`answer_${i}`];
              if (question && answer) {
                items.push({ question, answer });
              }
            }
          }
    
          return {
            ...breakdown.toJSON(),
            id: breakdown.id ,
            driverName: breakdown.driverName ,
            hoursDriverRegister: breakdown.hoursDriverRegister ,
            createdAt: breakdown.createdAt ,
            driverMobile: breakdown.driverMobile ,
            carNumber: breakdown.carNumber ,
            carLife: breakdown.carLife ,
            logisticComment: breakdown.logisticComment ,
            transportComment: breakdown.transportComment ,
            repairmanComment: breakdown.repairmanComment ,
            historyDeliveryDriver: breakdown.historyDeliveryDriver ,
            historySendToRepair : breakdown.historySendToRepair ,
            company: auth?.company || 'نامشخص',
            zone: auth?.zone || 'نامشخص',
            personelCode: auth?.personelCode || 'نامشخص',
            breakdownItems: items,
            repairParts: repairInvoices, 
          };

          
          
      
        })
      );

      const workbook = new Workbook();
      const worksheet = workbook.addWorksheet('گزارش خرابی‌ها');
    
      worksheet.columns = [
        { header:' شناسه ثبت ( شماره سفارش )', key: 'id', width: 15 },
        { header: 'تاریخ ثبت', key: 'createdAt', width: 20 },
        { header: 'ساعت ثبت', key: 'hoursDriverRegister', width: 20 },
        { header: 'نام راننده', key: 'driverName', width: 20 },
        { header: ' تلفن راننده', key: 'driverMobile', width: 20 },
        { header: 'شماره پلاک', key: 'carNumber', width: 15 },
        { header: 'کیلوتر ثبت شده خودرو', key: 'carLife', width: 15 },
        { header: 'نام شرکت', key: 'company', width: 20 },
        { header: 'نام منطقه', key: 'zone', width: 15 },
        { header: 'نام خرابی اعلام شده توسط راننده ', key: 'question', width: 50 },
        { header: 'توضیحات راننده', key: 'answer', width: 50 },
        { header: 'نظر سرپرست لجستیک', key: 'logisticComment', width: 20 },
        { header: 'نظر سرپرست ترابری' , key: 'transportComment', width: 20 },
        { header: 'نظر سرپرست تعمیرگاه' , key: 'repairmanComment', width: 20 },
        { header: 'قطعه مصرفی', key: 'repairPart', width: 50 },
        { header: 'مبلغ فاکتور', key: 'amount', width: 20 },  
        { header: ' پلاک سیستمی خودرو', key: 'carNumberSystem', width: 20 },
        { header: 'تاریخ اعزام به تعمیرگاه', key: 'historySendToRepair', width: 20 },
        { header: 'تاریخ تحویل به راننده', key: 'historyDeliveryDriver', width: 20 },
      ];
    
      const headerRow = worksheet.getRow(1);
      headerRow.eachCell((cell) => {
        cell.font = { bold: true, size: 12 , name: 'B Titr' , color: { argb: 'FFFFA500' }};
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '000080' },
        };
      });
    
      if (combinedData.length > 0) {
        combinedData.forEach((data) => {
          const baseRowData = {
            driverId: data.driverId,
            driverName: data.driverName,
            personelCode: data.personelCode ,
            id: data.id,
            hoursDriverRegister: data.hoursDriverRegister,
            driverMobile: data.driverMobile,
            carLife: data.carLife,
            logisticComment: data.logisticComment ,
            transportComment: data.transportComment ,
            repairmanComment: data.repairmanComment ,
            carNumber: data.carNumber,
            createdAt: data.createdAt,
            company: data.company,
            zone: data.zone,
            carNumberSystem: data.carNumberSystem || 'بدون پلاک سیستمی',
            historyDeliveryDriver: data.historyDeliveryDriver || 'بدون تاریخ تحویل',
          };
      
          // برای هر قطعه یک سطر جدید
          if (data.repairParts.length > 0) {
            data.repairParts.forEach((part) => {
              const row = worksheet.addRow({
                ...baseRowData,
                repairPart: part.piece || 'بدون قطعه',
                question: 'بدون سوال',
                answer: 'بدون جواب',
                amount: part.amount || 'بدون مبلغ',  // اضافه کردن مبلغ فاکتور
              });
              row.eachCell((cell) => {
                cell.alignment = { vertical: 'middle', horizontal: 'center' };
              });
            });
          } else {
            worksheet.addRow({
              ...baseRowData,
              repairPart: 'بدون قطعه',
              question: 'بدون سوال',
              answer: 'بدون جواب',
              amount: 'بدون مبلغ',  // اضافه کردن مبلغ فاکتور
            });
          }
      
          // برای هر سوال و جواب یک سطر جدید
          if (data.breakdownItems.length > 0) {
            data.breakdownItems.forEach((item) => {
              worksheet.addRow({
                ...baseRowData,
                repairPart: 'بدون قطعه',
                question: item.question,
                answer: item.answer,
                amount: 'بدون مبلغ',  // مبلغ برای سوالات و جواب‌ها
              });
            });
          }
        });
      } else {
        worksheet.addRow(['اطلاعاتی یافت نشد']);
      }
      
    
      const buffer = await workbook.xlsx.writeBuffer();
      return buffer;
    }
    
    

      async exportAllChecklistsToExcel(excelFilterDto: ExcelFilterDto) {
        const { driverNames, companies, zones, startDate, carNumbers, endDate } = excelFilterDto;

        const authFilter: any = {};
      
        if (zones && zones.length > 0) authFilter.zone = { [Op.in]: zones };
        if (companies && companies.length > 0) authFilter.company = { [Op.in]: companies };
      
        const matchingDrivers = await this.authRepository.findAll({
          where: authFilter,
          attributes: ['id', 'name', 'zone', 'company'],
        });
      
        if (!matchingDrivers || matchingDrivers.length === 0) {
          throw new Error('هیچ راننده‌ای پیدا نشد');
        }
      
        const driverIds = matchingDrivers.map((driver) => driver.id);
      
        const checkListFilter: any = {};
      
        // فیلتر تاریخ‌ها
        // فیلتر تاریخ‌ها
        if (startDate && endDate) {
          const start = new Date(startDate);
          start.setHours(0, 0, 0, 0);

          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);

          checkListFilter.createdAt = { [Op.between]: [start, end] };
        }

        if (driverIds.length > 0) checkListFilter.userId = { [Op.in]: driverIds };
        if (driverNames && Array.isArray(driverNames) && driverNames.length > 0) {
          checkListFilter.name = { [Op.in]: driverNames };
        }

        if (carNumbers && Array.isArray(carNumbers) && carNumbers.length > 0) {
          checkListFilter.carNumber = { [Op.in]: carNumbers };
        }

      
        // دریافت رکوردهای چک‌لیست
        const checkLists = await CheckList.findAll({
          where: checkListFilter,
          attributes: [
            'userId', 'history', 'hours', 'isDeleted', 'name',
            'answer_0', 'answer_1', 'answer_2', 'answer_3',
            'answer_4', 'answer_5', 'answer_6', 'answer_7',
            'answer_8', 'answer_9', 'answer_10', 'answer_11',
            'answer_12', 'answer_13', 'answer_14', 'answer_15',
            'answer_16', 'answer_17', 'answer_18', 'answer_19',
            'answer_20', 'createdAt',
          ],
        });
      
        if (!checkLists || checkLists.length === 0) {
          return {
            status: 200,
            data: [],
            message: "داده‌ای یافت نشد",
          };
        }
      
        const enrichedData = checkLists.map((checkList) => {
          const authData = matchingDrivers.find((driver) => driver.id === checkList.userId);
          return {
            ...checkList.toJSON(),
            driverName: authData?.name || 'نامشخص',
            zone: authData?.zone || 'نامشخص',
            company: authData?.company || 'نامشخص',
          };
        });
      
        const ANSWER_TRANSLATIONS = {
          'good': 'خوب',
          'medium': 'متوسط',
          'weak': 'بد',
        };
      
        const ANSWER_FIELDS = [
          { field: 'answer_0', question: 'کیلومتر' },
          { field: 'answer_1', question: 'آب رادیاتور' },
          { field: 'answer_2', question: 'سطح روغن موتور' },
          { field: 'answer_3', question: 'سطح روغن ترمز' },
          { field: 'answer_4', question: 'سطح روغن فرمان' },
          { field: 'answer_5', question: 'باد لاستیک' },
          { field: 'answer_6', question: 'وضعیت لاستیک‌ها' },
          { field: 'answer_7', question: 'وضعیت ترمز' },
          { field: 'answer_8', question: 'وضعیت ترمز دستی' },
          { field: 'answer_9', question: 'وضعیت راهنما' },
          { field: 'answer_10', question: 'وضعیت چراغ‌های جلو' },
          { field: 'answer_11', question: 'وضعیت چراغ‌های خطر عقب' },
          { field: 'answer_12', question: 'وضعیت چراغ دنده عقب' },
          { field: 'answer_13', question: 'وضعیت برف‌پاک‌کن' },
          { field: 'answer_14', question: 'وضعیت نظافت داخل کابین' },
          { field: 'answer_15', question: 'وضعیت ظاهری داخل کامیونت' },
          { field: 'answer_16', question: 'وضعیت شیشه‌های کامیونت' },
          { field: 'answer_17', question: 'سرویس صدا در حین حرکت' },
          { field: 'answer_18', question: 'وضعیت آینه‌های کامیونت' },
          { field: 'answer_19', question: 'وضعیت سیستم بخاری' },
          { field: 'answer_20', question: 'وضعیت سیستم خنک‌کننده' },
        ];
      
        const verticalData = [];
        enrichedData.forEach((data) => {
          ANSWER_FIELDS.forEach(({ field, question }) => {
            if (data[field] !== undefined && data[field] !== null) {
              const originalAnswer = data[field];
              const translatedAnswer = ANSWER_TRANSLATIONS[originalAnswer] || originalAnswer;
      
              verticalData.push({
                id: data.id ,
                userId: data.userId,
                history: data.history,
                hours: data.hours,
                isDeleted: data.isDeleted ? 'بله' : 'خیر',
                driverName: data.driverName,
                carNumber: data.carNumber ,
                zone: data.zone,
                company: data.company,
                question,
                answer: translatedAnswer,
              });
            }
          });
        });
      
        const workbook = new Workbook();
        const worksheet = workbook.addWorksheet('گزارش چک‌لیست');
      
        worksheet.columns = [
          { header: 'تاریخ ثبت', key: 'history', width: 20 },
          { header: 'ساعت ثبت', key: 'hours', width: 10 },
          { header: 'نام راننده', key: 'driverName', width: 20 },
          { header: 'شماره پلاک', key: 'carNumber', width: 20 },
          { header: 'نام منطقه', key: 'zone', width: 15 },
          { header: 'نام شرکت', key: 'company', width: 20 },
          { header: 'نام وضعیت', key: 'question', width: 20 },
          { header: 'وضعیت ثبت شده', key: 'answer', width: 20 },
          { header: 'وضعیت چک لیست ثبت شده', key: 'isDeleted', width: 10 },
        ];
      
        verticalData.forEach((row) => {
          const excelRow = worksheet.addRow(row); 
          excelRow.eachCell({ includeEmpty: true }, (cell) => {
            cell.alignment = {
              vertical: 'middle',
              horizontal: 'center',
            };
            cell.font = { size: 11 };
          });
        });
        
        const headerRow = worksheet.getRow(1);
        headerRow.eachCell({ includeEmpty: true }, (cell) => {
          cell.font = {
            bold: true,
            size: 12,
            name: 'B Titr',
            color: { argb: 'FFFFA500' },
          };
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '000080' },
          };
        });
        headerRow.height = 20;
        
        worksheet.eachRow((row, rowNumber) => {
          if (rowNumber !== 1) {
            row.height = 18;
          }
        });
        
        worksheet.columns.forEach((column) => {
          column.width = 20; 
        });
        

        const buffer = await workbook.xlsx.writeBuffer();
        return buffer;
      }
      
      


      // async exportPriodicCheckTruckData(
      //   excelFilterDto: ExcelFilterDto
      // ) {
      //   try {
      //     const { driverNames, companies, zones, carNumbers, startDate, endDate } = excelFilterDto;
        
      //     const authFilter: any = {};
        
      //     if (zones && zones.length > 0) {
      //       authFilter.zone = { [Op.in]: zones };
      //     }
      //     if (companies && companies.length > 0) {
      //       authFilter.company = { [Op.in]: companies };
      //     }
        
      //     const matchingDrivers = await this.authRepository.findAll({
      //       where: authFilter,
      //       attributes: ['id', 'name', 'company', 'zone'],
      //     });
        
      //     if (!matchingDrivers || matchingDrivers.length === 0) {
      //       throw new Error('هیچ راننده‌ای پیدا نشد');
      //     }
        
      //     const driverIds = matchingDrivers.map((driver) => driver.id);
        
      //     const periodicTruckCheckFilter: any = {};
      //     if (startDate && endDate) {
      //       const start = new Date(startDate);
      //       start.setHours(0, 0, 0, 0);
        
      //       const end = new Date(endDate);
      //       end.setHours(0, 0, 0, 0);
        
      //       periodicTruckCheckFilter.createdAt = {
      //         [Op.between]: [start, end],
      //       };
      //     }
        
      //     const truckInfoFilter: any = {};
        
      //     if (carNumbers && carNumbers.length > 0) {
      //       truckInfoFilter.carNumber = { [Op.in]: carNumbers };
      //     }
        
      //     if (driverNames && driverNames.length > 0) {
      //       truckInfoFilter.driverName = { [Op.in]: driverNames };
      //     }
        
      //     if (driverIds.length > 0) {
      //       truckInfoFilter.driverId = { [Op.in]: driverIds };
      //     }
        
      //     const truckInfos = await this.truckInfoRepository.findAll({
      //       where: truckInfoFilter,
      //       attributes: ['id', 'driverId', 'carNumber', 'zone'],
      //       include: [
      //         {
      //           model: PeriodicTruckCheck,
      //           where: periodicTruckCheckFilter,
      //           attributes: ['id', 'endKilometer', 'endDate', 'alertReview', 'createdAt'],
      //           include: [
      //             {
      //               model: PeriodicType,  // بارگذاری اطلاعات نوع قطعه
      //               attributes: ['type', 'name'],
      //             }
      //           ]
      //         },
      //       ],
      //     });
        
      //     const allDriverIds = truckInfos.map((truckInfo) => truckInfo.driverId);
      //     const drivers = await this.authRepository.findAll({
      //       where: { id: { [Op.in]: allDriverIds } },
      //       attributes: ['id', 'name', 'company'],
      //     });
        
      //     const enrichedData = [];
      //     truckInfos.forEach((truckInfo) => {
      //       const driver = drivers.find((d) => d.id === truckInfo.driverId);
      //       if (!driver) return;
        
      //       truckInfo.periodicTruckCheck.forEach((check) => {
      //         if (check.periodicType) {
      //           enrichedData.push({
      //             truckInfoId: truckInfo.id,
      //             driverName: driver.name || 'نامشخص',
      //             company: driver.company || 'نامشخص',
      //             carNumber: truckInfo.carNumber,
      //             type: check.periodicType.name || 'نامشخص',  // استفاده از name از PeriodicType
      //             zone: truckInfo.zone,
      //             endKilometer: check.endKilometer,
      //             endDate: check.endDate,
      //             alertReview: check.alertReview,
      //             createdAt: check.createdAt,
      //           });
      //         }
      //       });
      //     });
        
      //     const workbook = new Workbook();
      //     const worksheet = workbook.addWorksheet('گزارش اطلاعات خودروها');
        
      //     worksheet.columns = [
      //       { header: 'شناسه خودرو', key: 'truckInfoId', width: 15 },
      //       { header: 'نام راننده', key: 'driverName', width: 20 },
      //       { header: 'شرکت', key: 'company', width: 20 },
      //       { header: 'پلاک خودرو', key: 'carNumber', width: 15 },
      //       { header: 'نوع قطعه', key: 'type', width: 20 },  // ستون نوع قطعه
      //       { header: 'منطقه', key: 'zone', width: 15 },
      //       { header: 'کیلومتر انتهایی', key: 'endKilometer', width: 15 },
      //       { header: 'تاریخ انتهایی', key: 'endDate', width: 15 },
      //       { header: 'آلارم بازبینی', key: 'alertReview', width: 15 },
      //       { header: 'تاریخ ایجاد', key: 'createdAt', width: 20 },
      //     ];
        
      //     const headerRow = worksheet.getRow(1);
      //   headerRow.eachCell((cell) => {
      //     cell.font = {
      //       bold: true,
      //       size: 12,
      //       name: 'B Nazanin',
      //       color: { argb: 'FFFFFF' },
      //     };
      //     cell.alignment = { vertical: 'middle', horizontal: 'center' };
      //     cell.fill = {
      //       type: 'pattern',
      //       pattern: 'solid',
      //       fgColor: { argb: '000080' },
      //     };
      //   });
      //   headerRow.height = 20;
       
        
      //   if (enrichedData.length > 0) {
      //     enrichedData.forEach((data) => {
      //       const row = worksheet.addRow(data);
      //       row.eachCell((cell) => {
      //         cell.alignment = {
      //           vertical: 'middle',
      //           horizontal: 'center',
      //         };
      //       });
      //     });
      //   } else {
      //     const row = worksheet.addRow(['اطلاعاتی یافت نشد']);
      //     row.eachCell((cell) => {
      //       cell.alignment = {
      //         vertical: 'middle',
      //         horizontal: 'center',
      //       };
      //     });
      //   }

          
      //   worksheet.eachRow((row, rowNumber) => {
      //     if (rowNumber !== 1) {
      //       row.height = 18;
      //     }
      //   });
        
      //     // تولید بافر اکسل
      //     const buffer = await workbook.xlsx.writeBuffer();
      //     return buffer;
      //   } catch (error) {
      //     console.error('Error exporting periodic check truck data:', error);
      //     throw new Error('خطایی در هنگام استخراج داده‌ها رخ داده است.');
      //   }
      // }


      // async exportPriodicCheckTruckData(excelFilterDto: ExcelFilterDto) {
      //   try {
      //     const { driverNames, companies, zones, carNumbers, startDate, endDate } = excelFilterDto;
      
      //     const authFilter: any = {};
      //     if (zones && zones.length > 0) authFilter.zone = { [Op.in]: zones };
      //     if (companies && companies.length > 0) authFilter.company = { [Op.in]: companies };
      
      //     const matchingDrivers = await this.authRepository.findAll({
      //       where: authFilter,
      //       attributes: ['id', 'name', 'company', 'zone'],
      //     });

      
      //     if (!matchingDrivers || matchingDrivers.length === 0) {
      //       throw new Error('هیچ راننده‌ای پیدا نشد');
      //     }
      
      //     const driverIds = matchingDrivers.map((driver) => driver.id);
      
      //     const periodicTruckCheckFilter: any = {};
      //     if (startDate && endDate) {
      //       const start = new Date(startDate);
      //       start.setHours(0, 0, 0, 0);
      //       const end = new Date(endDate);
      //       end.setHours(23, 59, 59, 999);
      
      //       periodicTruckCheckFilter.createdAt = { [Op.between]: [start, end] };
      //     }
      
      //     const truckInfoFilter: any = {};
      //     if (carNumbers && carNumbers.length > 0) truckInfoFilter.carNumber = { [Op.in]: carNumbers };
      //     if (driverNames && driverNames.length > 0) truckInfoFilter.driverName = { [Op.in]: driverNames };
      //     if (driverIds.length > 0) truckInfoFilter.driverId = { [Op.in]: driverIds };
      
      //     const truckInfos = await this.truckInfoRepository.findAll({
      //       where: truckInfoFilter,
      //       attributes: ['id', 'driverId', 'carNumber', 'zone'],
      //       include: [
      //         {
      //           model: PeriodicTruckCheck,
      //           where: periodicTruckCheckFilter,
      //           attributes: ['id', 'endKilometer', 'endDate', 'alertReview', 'createdAt'],
      //           include: [
      //             {
      //               model: PeriodicType,
      //               attributes: ['type', 'name'],
      //             },
      //           ],
      //         },
      //       ],
      //     });

      //     console.log(truckInfos);
          
      
      //     const allDriverIds = truckInfos.map((truckInfo) => truckInfo.driverId);
      //     const drivers = await this.authRepository.findAll({
      //       where: { id: { [Op.in]: allDriverIds } },
      //       attributes: ['id', 'name', 'company'],
      //     });
      
      //     const enrichedData = [];
      //     truckInfos.forEach((truckInfo) => {
      //       const driver = drivers.find((d) => d.id === truckInfo.driverId);
      //       if (!driver) return;
      
      //       truckInfo.periodicTruckCheck.forEach((check) => {
      //         if (check.periodicType) {
      //           enrichedData.push({
      //             truckInfoId: truckInfo.id,
      //             driverName: driver.name || 'نامشخص',
      //             company: driver.company || 'نامشخص',
      //             carNumber: truckInfo.carNumber,
      //             type: check.periodicType.name || 'نامشخص',  // استفاده از name از PeriodicType
      //             zone: truckInfo.zone,
      //             endKilometer: check.endKilometer,
      //             endDate: check.endDate,
      //             alertReview: check.alertReview,
      //             createdAt: check.createdAt,
      //           });
      //         }
      //       });
      //     });

      //     const workbook = new Workbook();
      //     const worksheet = workbook.addWorksheet('گزارش اطلاعات خودروها');
      
      //     worksheet.columns = [
      //       { header: 'شناسه خودرو', key: 'truckInfoId', width: 15 },
      //       { header: 'نام راننده', key: 'driverName', width: 20 },
      //       { header: 'شرکت', key: 'company', width: 20 },
      //       { header: 'پلاک خودرو', key: 'carNumber', width: 15 },
      //       { header: 'نوع قطعه', key: 'type', width: 20 },
      //       { header: 'منطقه', key: 'zone', width: 15 },
      //       { header: 'حداکثر کیلومتر', key: 'endKilometer', width: 15 },
      //       { header: 'تاریخ انقضای قطعه', key: 'endDate', width: 15 },
      //       { header: 'آلارم بازبینی', key: 'alertReview', width: 15 },
      //       { header: 'تاریخ ایجاد', key: 'createdAt', width: 20 },
      //     ];
      
      //     const headerRow = worksheet.getRow(1);
      //     headerRow.eachCell((cell) => {
      //       cell.font = { bold: true, size: 12, name: 'B Titr', color: { argb: 'FFFFA500' } };
      //       cell.alignment = { vertical: 'middle', horizontal: 'center' };
      //       cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '000080' } };
      //     });
      //     headerRow.height = 20;
      
      //     // گروهبندی داده‌ها بر اساس نوع
      //     const groupedData = enrichedData.reduce((acc, item) => {
      //       if (!acc[item.type]) acc[item.type] = [];
      //       acc[item.type].push(item);
      //       return acc;
      //     }, {});
      
      //     // افزودن رکوردها برای هر نوع و هر راننده
      //     Object.keys(groupedData).forEach((type) => {
      //       const typeRow = worksheet.addRow([type]);
      //       typeRow.eachCell((cell) => {
      //         cell.font = { bold: true, size: 12, name: 'B Nazanin', color: { argb: 'FFFFFF' } };
      //         cell.alignment = { vertical: 'middle', horizontal: 'center' };
      //         cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '000080' } };
      //       });
      //       typeRow.height = 20;
      
      //       // افزودن داده‌ها برای هر راننده
      //       groupedData[type].forEach((data) => {
      //         worksheet.addRow(data); // هر رکورد برای هر راننده اضافه می‌شود
      //       });
      //     });
      
      //     worksheet.eachRow((row, rowNumber) => {
      //       if (rowNumber !== 1) row.height = 18;
      //     });
      
      //     const buffer = await workbook.xlsx.writeBuffer();
      //     return buffer;
      //   } catch (error) {
      //     console.error('Error exporting periodic check truck data:', error);
      //     throw new Error('خطایی در هنگام استخراج داده‌ها رخ داده است.');
      //   }
      // }
      
      
      async generatePeriodicCheckExcelReport(excelFilterDto: ExcelFilterDto) {
        const { companies, zones, startDate, endDate, carNumbers } = excelFilterDto;

        const truckInfoFilter: any = {};
        if (zones && zones.length > 0) truckInfoFilter.zone = { [Op.in]: zones };
        if (companies && companies.length > 0) truckInfoFilter.company = { [Op.in]: companies };
        if (carNumbers && carNumbers.length > 0) truckInfoFilter.carNumber = { [Op.in]: carNumbers };

        const periodicCheckFilter: any = {};
        if (startDate && endDate) {
          periodicCheckFilter.createdAt = {
            [Op.between]: [new Date(startDate), new Date(endDate)],
          };
        }

        // دریافت داده‌ها از دیتابیس
        const periodicChecks = await PeriodicTruckCheck.findAll({
          where: periodicCheckFilter,
          include: [
            {
              model: TruckInfo,
              where: truckInfoFilter,
              attributes: ['carNumber', 'zone', 'company'],
            },
            {
              model: PeriodicType,
              attributes: ['name'],
            },
          ],
        });

        if (!periodicChecks || periodicChecks.length === 0) {
          throw new Error('هیچ داده‌ای یافت نشد');
        }

        // آماده‌سازی داده‌ها برای اکسل
        const reportData = periodicChecks.map((check) => ({
          پلاک_خودرو: check.truckInfo?.carNumber || 'نامشخص',
          منطقه: check.truckInfo?.zone || 'نامشخص',
          شرکت: check.truckInfo?.company || 'نامشخص',
          نام_سرویس_دوره_ای: check.periodicType?.name || 'نامشخص',
          کیلومتر_سرویس: check.endKilometer || 'نامشخص',
          تاریخ_سرویس: check.endDate || 'نامشخص',
          // registerType : check.autoAdd ? 'سیستم' : 'دستی',
          createdAt: check.createdAt || 'نامشخص',
        }));

        const workbook = new Workbook();
        const worksheet = workbook.addWorksheet('گزارش سرویس دوره ای');

        // تنظیم ستون‌ها
        worksheet.columns = [
          { header: 'پلاک خودرو', key: 'پلاک_خودرو', width: 15 },
          { header: 'منطقه', key: 'منطقه', width: 15 },
          { header: 'شرکت', key: 'شرکت', width: 20 },
          { header: 'نام سرویس دوره‌ای', key: 'نام_سرویس_دوره_ای', width: 25 },
          { header: 'کیلومتر سرویس', key: 'کیلومتر_سرویس', width: 15 },
          { header: 'تاریخ سرویس', key: 'تاریخ_سرویس', width: 20 },
          { header: 'نوع ثبت شده', key: 'registerType', width: 15 },
          { header: 'تاریخ ثبت', key: 'createdAt', width: 20 },
        ];

        // اضافه کردن داده‌ها به اکسل
        reportData.forEach((row) => {
          const excelRow = worksheet.addRow(row);
          excelRow.eachCell((cell) => {
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
            cell.font = { size: 12 };
          });
        });

        // قالب‌دهی هدر
        const headerRow = worksheet.getRow(1);
        headerRow.eachCell((cell) => {
          cell.font = { bold: true, size: 14, color: { argb: 'FFFFFF' } };
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '4F81BD' },
          };
          cell.alignment = { horizontal: 'center', vertical: 'middle' };
        });
        headerRow.height = 25;

        // ذخیره اکسل به صورت بافر
        const buffer = await workbook.xlsx.writeBuffer();
        return buffer;
      }
      
      
    convertEnglishNumbersToPersian(input) {
      const englishToPersianMap = {
          '0': '۰',
          '1': '۱',
          '2': '۲',
          '3': '۳',
          '4': '۴',
          '5': '۵',
          '6': '۶',
          '7': '۷',
          '8': '۸',
          '9': '۹'
      };
  
      return input.replace(/[0-9]/g, (char) => englishToPersianMap[char]);
  }
        
    }


        