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
      
  
    

      // async exportAllChecklistsToExcel(
      //   excelFilterDto: ExcelFilterDto
      // ) {
      //   const {driverNames , companies , zones ,startDate , carNumbers ,endDate } = excelFilterDto

      //   const authFilter: any = {};
        
      //   if (zones && zones.length > 0) {
      //     authFilter.zone = { [Op.in]: zones };
      //   }
      //   if (companies && companies.length > 0) {
      //     authFilter.company = { [Op.in]: companies };
      //   }
      
      //   const matchingDrivers = await this.authRepository.findAll({
      //     where: authFilter,
      //     attributes: ['id', 'name', 'zone', 'company'],
      //   });
      
      //   if (!matchingDrivers || matchingDrivers.length === 0) {
      //     throw new Error('هیچ راننده‌ای پیدا نشد');
      //   }
      
      //   const driverIds = matchingDrivers.map((driver) => driver.id);
      
      //   const checkListFilter: any = {};
      
      //   if (startDate && endDate) {
      //       const start = new Date(startDate);
      //       start.setHours(0, 0, 0, 0);
        
      //       const end = new Date(endDate);
      //       end.setHours(0, 0, 0, 0);
        
      //       checkListFilter.createdAt = {
      //           [Op.between]: [start, end],
      //       };
      //   }
      
      //   if (driverIds.length > 0) checkListFilter.userId = { [Op.in]: driverIds };
      //   if (driverNames && driverNames.length > 0) {
      //     checkListFilter.name = { [Op.in]: driverNames };
      //   }
      //   if (carNumbers && carNumbers.length > 0) {
      //     checkListFilter.carNumber = { [Op.in]: carNumbers };
      //   }
      
      //   const checkLists = await CheckList.findAll({
      //     where: checkListFilter,
      //     attributes: [
      //       'userId', 'history', 'hours', 'name', 'answer_0', 'answer_1', 'answer_2', 'answer_3', 'answer_4',
      //       'answer_5', 'answer_6', 'answer_7', 'answer_8', 'answer_9', 'answer_10', 'answer_11', 'answer_12',
      //       'answer_13', 'answer_14', 'answer_15', 'answer_16', 'answer_17', 'answer_18', 'answer_19', 'answer_20', 'createdAt',
      //     ],
      //   });
      
      //   if (!checkLists || checkLists.length === 0) {
      //     return {
      //       status: 200,
      //       data: [],
      //       message: "داده‌ای یافت نشد",
      //     };
      //   }
      
      //   const enrichedData = checkLists.map((checkList) => {
      //     const authData = matchingDrivers.find((driver) => driver.id === checkList.userId);
      //     return {
      //       ...checkList.toJSON(),
      //       zone: authData?.zone || 'نامشخص',
      //       company: authData?.company || 'نامشخص',
      //     };
      //   });
      

      //   const workbook = new Workbook();
      //   const worksheet = workbook.addWorksheet('گزارش چک لیست');
      
      //   worksheet.columns = [
      //       { header: 'شناسه', key: 'id', width: 10 },
      //       { header: 'شناسه کاربر', key: 'userId', width: 15 },
      //       { header: 'نام', key: 'name', width: 20 },
      //       { header: 'شرکت', key: 'company', width: 20 },
      //       { header: 'منطقه', key: 'zone', width: 20 },
      //       { header: 'تاریخ', key: 'history', width: 20 },
      //       { header: 'ساعت', key: 'hours', width: 15 },
      //       { header: 'پاسخ 0', key: 'answer_0', width: 15 },
      //       { header: 'پاسخ 1', key: 'answer_1', width: 15 },
      //       { header: 'پاسخ 2', key: 'answer_2', width: 15 },
      //       { header: 'پاسخ 3', key: 'answer_3', width: 15 },
      //       { header: 'پاسخ 4', key: 'answer_4', width: 15 },
      //       { header: 'پاسخ 5', key: 'answer_5', width: 15 },
      //       { header: 'پاسخ 5', key: 'answer_6', width: 15 },
      //       { header: 'پاسخ 7', key: 'answer_7', width: 15 },
      //       { header: 'پاسخ 8', key: 'answer_8', width: 15 },
      //       { header: 'پاسخ 9', key: 'answer_9', width: 15 },
      //       { header: 'پاسخ 10', key: 'answer_10', width: 15 },
      //       { header: 'پاسخ 11', key: 'answer_11', width: 15 },
      //       { header: 'پاسخ 12', key: 'answer_12', width: 15 },
      //       { header: 'پاسخ 13', key: 'answer_13', width: 15 },
      //       { header: 'پاسخ 14', key: 'answer_14', width: 15 },
      //       { header: 'پاسخ 15', key: 'answer_15', width: 15 },
      //       { header: 'پاسخ 16', key: 'answer_16', width: 15 },
      //       { header: 'پاسخ 17', key: 'answer_17', width: 15 },
      //       { header: 'پاسخ 18', key: 'answer_18', width: 15 },
      //       { header: 'پاسخ 19', key: 'answer_19', width: 15 },
      //       { header: 'پاسخ 20', key: 'answer_20', width: 15 },
      //       { header: 'تاریخ ایجاد', key: 'createdAt', width: 15 },
      //     ];
          
      
      //   const headerRow = worksheet.getRow(1);
      //   headerRow.eachCell((cell) => {
      //     cell.font = {
      //       bold: true,
      //       size: 14,
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
      
      //   enrichedData.forEach((data) => {
      //       const row = worksheet.addRow({
      //           id: data.id,
      //           userId: data.userId,
      //           name: data.name,
      //           company: data.company,
      //           zone: data.zone,
      //           history: data.history,
      //           hours: data.hours,
      //           answer_0: data.answer_0,
      //           answer_1: data.answer_1,
      //           answer_2: data.answer_2,
      //           answer_3: data.answer_3,
      //           answer_4: data.answer_4,
      //           answer_5: data.answer_5,
      //           answer_6: data.answer_6,
      //           answer_7: data.answer_7,
      //           answer_8: data.answer_8,
      //           answer_9: data.answer_9,
      //           answer_10: data.answer_10,
      //           answer_11: data.answer_11,
      //           answer_12: data.answer_12,
      //           answer_13: data.answer_13,
      //           answer_14: data.answer_14,
      //           answer_15: data.answer_15,
      //           answer_16: data.answer_16,
      //           answer_17: data.answer_17,
      //           answer_18: data.answer_18,
      //           answer_19: data.answer_19,
      //           answer_20: data.answer_20,
      //           createdAt: data.createdAt,
      //       });
      //   });
        
      //       const buffer = await workbook.xlsx.writeBuffer();
      //       return buffer;
      // }

      // async exportAllBreakdownFieldsToExcel(
      //   excelFilterDto: ExcelFilterDto
      // ) {
      //   const { driverNames, companies, zones, startDate, endDate, pieces, carNumbers } = excelFilterDto;
      //   const authFilter: any = {};
      //   const breakdownFilter: any = {};
      
      //   // فیلتر منطقه و شرکت
      //   if (zones && zones.length > 0) authFilter.zone = { [Op.in]: zones };
      //   if (companies && companies.length > 0) authFilter.company = { [Op.in]: companies };
      
      //   // دریافت رانندگان با توجه به فیلتر
      //   const authRecords = await this.authRepository.findAll({
      //     where: authFilter,
      //     attributes: ['id', 'name', 'company', 'zone'],
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
      //     end.setHours(0, 0, 0, 0);
      
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
      //       'historyDriverRegister',
      //       'numberOfBreakDown',
      //       'logisticComment',
      //       'hoursDriverRegister',
      //       'historyRepairComment',
      //       'carLife',
      //       'logisticConfirm',
      //       'historyDriverRegister',
      //       'transportComment',
      //       'historySendToRepair',
      //       'historyReciveToRepair',
      //       'histroyDeliveryTruck',
      //       'historyDeliveryDriver',
      //       'repairmanComment',
      //       'hoursRepairComment',
      //       'historyRepairComment',
      //       'transportCommentHistory',
      //       'cartexType',
      //       'createdAt',
      //     ],
      //   });
        
      
      //   if (!breakdownRecords || breakdownRecords.length === 0) {
      //     return {
      //       status: 200,
      //       data: [],
      //       message: "اطلاعاتی یافت نشد",
      //     };
      //   }
      
      //   // دریافت اطلاعات قطعات از جدول repair-invoice
      //   const breakdownIds = breakdownRecords.map((record) => record.id);
      //   const repairInvoices = await this.repairInvoiceRepository.findAll({
      //     where: { truckBreakDownId: { [Op.in]: breakdownIds } },
      //     attributes: [
      //       'truckBreakDownId',
      //       'piece',
      //       'typeActivity',
      //       'carNumber',
      //       'carNumberSystem',
      //       'providerCode',
      //       'providerName',
      //       'amount',
      //     ],
      //   });
      
      //   // ترکیب داده‌ها
      //   const combinedData = repairInvoices.map((invoice) => {
      //     // پیدا کردن breakdown مربوطه
      //     const breakdown = breakdownRecords.find(
      //       (record) => record.id === invoice.truckBreakDownId
      //     );
        
      //     // لاگ برای بررسی breakdown
      //     if (!breakdown) {
      //       console.log('بررسی مشکل: breakdown پیدا نشد برای truckBreakDownId:', invoice.truckBreakDownId);
      //     }
        
      //     // پیدا کردن auth مربوط به breakdown
      //     const auth = breakdown ? authRecords.find((auth) => auth.id === breakdown.driverId) : null;
        
      //     // لاگ برای بررسی auth
      //     if (!auth) {
      //       console.log('بررسی مشکل: auth پیدا نشد برای driverId:', breakdown?.driverId);
      //     }
        
      //     // برگرداندن داده‌ها با مقادیر پیش‌فرض در صورت نبود داده
      //     return {
      //       driverId: breakdown?.driverId || 'نامشخص',
      //       driverName: breakdown?.driverName || 'نامشخص',
      //       carNumber: breakdown?.carNumber || 'نامشخص',
      //       historyDriverRegister: breakdown?.historyDriverRegister || 'نامشخص',
      //       numberOfBreakDown: breakdown?.numberOfBreakDown || 0,
      //       logisticComment: breakdown?.logisticComment || '',
      //       hoursDriverRegister: breakdown?.hoursDriverRegister || '',
      //       historyRepairComment: breakdown?.historyRepairComment || '',
      //       carLife: breakdown?.carLife || '',
      //       logisticConfirm: breakdown?.logisticConfirm || '',
      //       transportComment: breakdown?.transportComment || '',
      //       historySendToRepair: breakdown?.historySendToRepair || '',
      //       historyReciveToRepair: breakdown?.historyReciveToRepair || '',
      //       histroyDeliveryTruck: breakdown?.histroyDeliveryTruck || '',
      //       historyDeliveryDriver: breakdown?.historyDeliveryDriver || '',
      //       repairmanComment: breakdown?.repairmanComment || '',
      //       hoursRepairComment: breakdown?.hoursRepairComment || '',
      //       transportCommentHistory: breakdown?.transportCommentHistory || '',
      //       cartexType: breakdown?.cartexType || '',
      //       createdAt: breakdown?.createdAt || '',
      //       company: auth?.company || 'نامشخص',
      //       zone: auth?.zone || 'نامشخص',
      //       piece: invoice.piece || 'نامشخص',
      //       typeActivity: invoice.typeActivity || 'نامشخص',
      //       carNumberSystem: invoice.carNumberSystem || '',
      //       providerCode: invoice.providerCode || '',
      //       providerName: invoice.providerName || '',
      //       amount: invoice.amount || '',
      //     };
      //   });
        
      //   // بررسی خروجی نهایی
      //   console.log('combinedData:', combinedData);
        
        
      
      //   // ساخت فایل اکسل
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
      //     { header: 'نظر ترابری', key: 'transportComment', width: 20 },
      //     { header: 'تاریخ ارسال به مکانیک', key: 'historySendToRepair', width: 25 },
      //     { header: 'تاریخ دریافت از مکانیک', key: 'historyReciveToRepair', width: 25 },
      //     { header: 'تاریخ تحویل ماشین', key: 'histroyDeliveryTruck', width: 25 },
      //     { header: 'تاریخ تحویل به راننده', key: 'historyDeliveryDriver', width: 20 },
      //     { header: 'قطعه', key: 'piece', width: 50 },
      //     { header: 'نوع فعالیت', key: 'typeActivity', width: 25 },
      //     { header: 'شماره ماشین سیستمی', key: 'carNumberSystem', width: 20 },
      //     { header: 'کد تامین‌کننده', key: 'providerCode', width: 20 },
      //     { header: 'نام تامین‌کننده', key: 'providerName', width: 25 },
      //     { header: 'مقدار', key: 'amount', width: 15 },
      //     { header: 'تاریخ ایجاد', key: 'createdAt', width: 20 },
      //   ];
      
      //   // استایل‌دهی به سرصفحه‌ها
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
      
      //   // اضافه کردن داده‌ها به اکسل
      //   combinedData.forEach((data) => {
      //     const row = worksheet.addRow(data);
      //     row.eachCell((cell) => {
      //       cell.alignment = {
      //         vertical: 'middle',
      //         horizontal: 'center',
      //       };
      //     });
      //   });
      
      //   // تولید خروجی اکسل
      //   const buffer = await workbook.xlsx.writeBuffer();
      //   return buffer;
      // }
      
      


      async exportAllBreakdownFieldsToExcel(excelFilterDto: ExcelFilterDto) {
        const { driverNames, companies, zones, startDate, endDate, pieces, carNumbers } = excelFilterDto;
      
        const authFilter: any = {};
        const breakdownFilter: any = {};
        const repairInvoiceFilter: any = {};
      
        console.log('excelFilterDto:', excelFilterDto);
      
        if (Array.isArray(zones) && zones.length > 0) authFilter.zone = { [Op.in]: zones };
        if (Array.isArray(companies) && companies.length > 0) authFilter.company = { [Op.in]: companies };
      
        if (startDate && endDate) {
          const start = new Date(startDate);
          start.setHours(0, 0, 0, 0);
      
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
      
          breakdownFilter.createdAt = { [Op.between]: [start, end] };
        }
      
        if (Array.isArray(carNumbers) && carNumbers.length > 0) {
          breakdownFilter.carNumber = { [Op.in]: carNumbers };
        }
      
        if (Array.isArray(driverNames) && driverNames.length > 0) {
          breakdownFilter.driverName = { [Op.in]: driverNames };
        }
      
        if (Array.isArray(pieces) && pieces.length > 0) {
          repairInvoiceFilter.piece = { [Op.in]: pieces };
        }
      
        const authRecords = await this.authRepository.findAll({
          where: authFilter,
          attributes: ['id', 'name', 'company', 'zone'],
        });
      
        const driverIds = authRecords.map((auth) => auth.id);
        if (driverIds.length > 0) {
          breakdownFilter.driverId = { [Op.in]: driverIds };
        }
      
        const breakdownRecords = await this.truckBreakDownRepository.findAll({
          where: breakdownFilter,
          include: [
            {
              model: RepairInvoice,
              where: repairInvoiceFilter,
              required: pieces && pieces.length > 0,
            },
          ],
        });
      
        console.log('breakdownRecords:', breakdownRecords);
      
        const flattenedData = breakdownRecords.flatMap((breakdown) => {
          const auth = authRecords.find((auth) => auth.id === breakdown.driverId);
          return breakdown.repairInvoices.map((invoice) => ({
            driverId: breakdown.driverId,
            driverName: breakdown.driverName,
            carNumber: breakdown.carNumber,
            createdAt: breakdown.createdAt,
            company: auth?.company || 'نامشخص',
            zone: auth?.zone || 'نامشخص',
            piece: invoice.piece,
            amount: invoice.amount,
          }));
        });
      
        const workbook = new Workbook();
        const worksheet = workbook.addWorksheet('گزارش خرابی‌ها');
      
        worksheet.columns = [
          { header: 'شناسه راننده', key: 'driverId', width: 15 },
          { header: 'نام راننده', key: 'driverName', width: 20 },
          { header: 'شماره ماشین', key: 'carNumber', width: 15 },
          { header: 'تاریخ ثبت', key: 'createdAt', width: 20 },
          { header: 'شرکت', key: 'company', width: 20 },
          { header: 'منطقه', key: 'zone', width: 15 },
          { header: 'قطعه', key: 'piece', width: 30 },
          { header: 'مقدار', key: 'amount', width: 15 },
        ];
      
        const headerRow = worksheet.getRow(1);
        headerRow.eachCell((cell) => {
          cell.font = {
            bold: true,
            size: 12,
            name: 'Arial',
          };
          cell.alignment = {
            vertical: 'middle',
            horizontal: 'center',
          };
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFF00' },
          };
        });
      
        headerRow.height = 20;
      
        if (flattenedData.length > 0) {
          flattenedData.forEach((data) => {
            const row = worksheet.addRow(data);
            row.eachCell((cell) => {
              cell.alignment = {
                vertical: 'middle',
                horizontal: 'center',
              };
            });
          });
        } else {
          const row = worksheet.addRow(['اطلاعاتی یافت نشد']);
          row.eachCell((cell) => {
            cell.alignment = {
              vertical: 'middle',
              horizontal: 'center',
            };
          });
        }
      
        const buffer = await workbook.xlsx.writeBuffer();
        return buffer;
      }
      
      

      // async exportAllChecklistsToExcel(excelFilterDto: ExcelFilterDto) {
      //   const { driverNames, companies, zones, startDate, carNumbers, endDate } = excelFilterDto;
      
      //   const authFilter: any = {};
      
      //   if (zones && zones.length > 0) {
      //     authFilter.zone = { [Op.in]: zones };
      //   }
      //   if (companies && companies.length > 0) {
      //     authFilter.company = { [Op.in]: companies };
      //   }
      
      //   const matchingDrivers = await this.authRepository.findAll({
      //     where: authFilter,
      //     attributes: ['id', 'name', 'zone', 'company'],
      //   });
      
      //   if (!matchingDrivers || matchingDrivers.length === 0) {
      //     throw new Error('هیچ راننده‌ای پیدا نشد');
      //   }
      
      //   const driverIds = matchingDrivers.map((driver) => driver.id);
      
      //   const checkListFilter: any = {};
      
      //   if (startDate && endDate) {
      //     const start = new Date(startDate);
      //     start.setHours(0, 0, 0, 0);
      
      //     const end = new Date(endDate);
      //     end.setHours(23, 59, 59, 999);
      
      //     checkListFilter.createdAt = {
      //       [Op.between]: [start, end],
      //     };
      //   }
      
      //   if (driverIds.length > 0) checkListFilter.userId = { [Op.in]: driverIds };
      //   if (driverNames && driverNames.length > 0) {
      //     checkListFilter.name = { [Op.in]: driverNames };
      //   }
      //   if (carNumbers && carNumbers.length > 0) {
      //     checkListFilter.carNumber = { [Op.in]: carNumbers };
      //   }
      
      //   const checkLists = await CheckList.findAll({
      //     where: checkListFilter,
      //     attributes: [
      //       'userId', 'history', 'hours', 'isDeleted', 'name', 
      //       'answer_0', 'answer_1', 'answer_2', 'answer_3', 
      //       'answer_4', 'answer_5', 'answer_6', 'answer_7',
      //       'answer_8', 'answer_9', 'answer_10', 'answer_11', 
      //       'answer_12', 'answer_13', 'answer_14', 'answer_15', 
      //       'answer_16', 'answer_17', 'answer_18', 'answer_19', 
      //       'answer_20', 'createdAt',
      //     ],
      //   });
      
      //   if (!checkLists || checkLists.length === 0) {
      //     return {
      //       status: 200,
      //       data: [],
      //       message: "داده‌ای یافت نشد",
      //     };
      //   }
      
      //   const enrichedData = checkLists.map((checkList) => {
      //     const authData = matchingDrivers.find((driver) => driver.id === checkList.userId);
      //     return {
      //       ...checkList.toJSON(),
      //       driverName: authData?.name || 'نامشخص',
      //       zone: authData?.zone || 'نامشخص',
      //       company: authData?.company || 'نامشخص',
      //     };
      //   });
      
      //   // مپ برای ترجمه پاسخ‌ها به فارسی
      //   const ANSWER_TRANSLATIONS = {
      //     'good': 'خوب',
      //     'medium': 'متوسط',
      //     'weak': 'بد',
      //   };
      
      //   // لیست سوالات با کلید پاسخ
      //   const ANSWER_FIELDS = [
      //     { field: 'answer_0', question: 'کیلومتر' },
      //     { field: 'answer_1', question: 'آب رادیاتور' },
      //     { field: 'answer_2', question: 'سطح روغن موتور' },
      //     { field: 'answer_3', question: 'سطح روغن ترمز' },
      //     { field: 'answer_4', question: 'سطح روغن فرمان' },
      //     { field: 'answer_5', question: 'باد لاستیک' },
      //     { field: 'answer_6', question: 'وضعیت لاستیک ها'},
      //     { field: 'answer_7', question: 'وضعیت ترمز' },
      //     { field: 'answer_8', question: 'وضعیت ترمز دستی' },
      //     { field: 'answer_9', question: 'وضعیت راهنما' },
      //     { field: 'answer_10', question: 'وضعیت چراغهای جلو' },
      //     { field: 'answer_11', question: 'وضعیت چراغهای خطر عقب' },
      //     { field: 'answer_12', question: 'وضعیت چراغ دنده عقب' },
      //     { field: 'answer_13', question: 'وضعیت برف پاکن'},
      //     { field: 'answer_14', question: 'وضعیت نظافت داخل کابین' },
      //     { field: 'answer_15', question:'وضعیت ظاهری داخل کامیونت' },
      //     { field: 'answer_16', question: 'وضعیت شیشه های کامیونت' },
      //     { field: 'answer_17', question: 'سرویس صدا در حین حرکت'},
      //     { field: 'answer_18', question: 'وضعیت آینه های کامیونت'},
      //     { field: 'answer_19', question:'وضعیت سیستم های بخاری' },
      //     { field: 'answer_20', question: 'وضعیت سیستم خنک کننده' },
      //   ];
      
      //   // ایجاد داده‌های عمودی
      //   const verticalData = [];
      //   enrichedData.forEach((data) => {
      //     ANSWER_FIELDS.forEach(({ field, question }) => {
      //       if (data[field] !== undefined && data[field] !== null) {
      //         const originalAnswer = data[field];
      //         const translatedAnswer = ANSWER_TRANSLATIONS[originalAnswer] || originalAnswer;
      
      //         verticalData.push({
      //           userId: data.userId,
      //           history: data.history,
      //           hours: data.hours,
      //           isDeleted: data.isDeleted ? 'بله' : 'خیر',
      //           driverName: data.driverName,
      //           zone: data.zone,
      //           company: data.company,
      //           question,
      //           answer: translatedAnswer,
      //         });
      //       }
      //     });
      //   });
      
      //   // ساخت فایل اکسل
      //   const workbook = new Workbook();
      //   const worksheet = workbook.addWorksheet('گزارش چک لیست');
      
      //   // تعریف ستون‌ها
      //   worksheet.columns = [
      //     { header: 'شناسه کاربر', key: 'userId', width: 15 },
      //     { header: 'تاریخچه', key: 'history', width: 20 },
      //     { header: 'ساعات', key: 'hours', width: 10 },
      //     { header: 'نام راننده', key: 'driverName', width: 20 },
      //     { header: 'منطقه', key: 'zone', width: 15 },
      //     { header: 'شرکت', key: 'company', width: 20 },
      //     { header: 'سوال', key: 'question', width: 20 },
      //     { header: 'پاسخ', key: 'answer', width: 20 },
      //     { header: 'حذف شده', key: 'isDeleted', width: 10 },
      //   ];
      
      //   // اضافه کردن داده‌ها به اکسل
      //   verticalData.forEach((row) => {
      //     worksheet.addRow(row);
      //   });
      
      //   // تنظیمات خروجی اکسل
      //   const headerRow = worksheet.getRow(1);
      //   headerRow.eachCell((cell) => {
      //     cell.font = {
      //       bold: true,
      //       size: 14,
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
      
      //   // تولید فایل اکسل
      //   const buffer = await workbook.xlsx.writeBuffer();
      //   return buffer;
      // }
      
      

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
      //           [Op.between]: [start, end],
      //       };
      //   }
      
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
      //       attributes: ['id', 'driverId', 'carNumber', 'type', 'zone'],
      //       include: [
      //         {
      //           model: PeriodicTruckCheck,
      //           where: periodicTruckCheckFilter, 
      //           attributes: ['id', 'endKilometer', 'endDate', 'alertReview', 'createdAt'],
      //         },
      //       ],
      //     });
      
      //     const allDriverIds = truckInfos.map((truckInfo) => truckInfo.driverId);
      //     const drivers = await this.authRepository.findAll({
      //       where: { id: { [Op.in]: allDriverIds } },
      //       attributes: ['id', 'name', 'company'],
      //     });
      

      //     const enrichedData = truckInfos.flatMap((truckInfo) => {
      //       const driver = drivers.find((d) => d.id === truckInfo.driverId);
      //       if (!driver) {
      //         return []; 
      //       }
      
      //       return truckInfo.periodicTruckCheck.map((check) => ({
      //         truckInfoId: truckInfo.id,
      //         driverName: driver.name || 'نامشخص',
      //         company: driver.company || 'نامشخص',
      //         carNumber: truckInfo.carNumber,
      //         type: truckInfo.type,
      //         zone: truckInfo.zone,
      //         endKilometer: check.endKilometer,
      //         endDate: check.endDate,
      //         alertReview: check.alertReview,
      //         createdAt: check.createdAt,
      //       }));
      //     });
      

      //     const workbook = new Workbook();
      //     const worksheet = workbook.addWorksheet('گزارش اطلاعات خودروها');
      
      //     worksheet.columns = [
      //       { header: 'شناسه خودرو', key: 'truckInfoId', width: 15 },
      //       { header: 'نام راننده', key: 'driverName', width: 20 },
      //       { header: 'شرکت', key: 'company', width: 20 },
      //       { header: 'پلاک خودرو', key: 'carNumber', width: 15 },
      //       { header: 'نوع خودرو', key: 'type', width: 15 },
      //       { header: 'منطقه', key: 'zone', width: 15 },
      //       { header: 'کیلومتر انتهایی', key: 'endKilometer', width: 15 },
      //       { header: 'تاریخ انتهایی', key: 'endDate', width: 15 },
      //       { header: 'آلارم بازبینی', key: 'alertReview', width: 15 },
      //       { header: 'تاریخ ایجاد', key: 'createdAt', width: 20 },
      //     ];
      
      //     const headerRow = worksheet.getRow(1);
      //     headerRow.eachCell((cell) => {
      //       cell.font = {
      //         bold: true,
      //         size: 14,
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
      
      //     if (enrichedData.length > 0) {
      //       enrichedData.forEach((data) => {
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
      
      //     // گزینه اختیاری: نمایش محتویات ردیف‌ها در کنسول برای دیباگ
      //     // worksheet.eachRow((row, rowNumber) => {
      //     //   console.log(`Row ${rowNumber}:`, row.values);
      //     // });
      
      //     // تولید بافر اکسل
      //     const buffer = await workbook.xlsx.writeBuffer();
      //     return buffer;
      //   } catch (error) {
      //     console.error('Error exporting periodic check truck data:', error);
      //     throw new Error('خطایی در هنگام استخراج داده‌ها رخ داده است.');
      //   }
      // }


      async exportAllChecklistsToExcel(excelFilterDto: ExcelFilterDto) {
        const { driverNames, companies, zones, startDate, carNumbers, endDate } = excelFilterDto;
        console.log(startDate);
        console.log(endDate);
        
      
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
      
        // ترکیب داده‌های راننده‌ها و چک‌لیست‌ها
        const enrichedData = checkLists.map((checkList) => {
          const authData = matchingDrivers.find((driver) => driver.id === checkList.userId);
          return {
            ...checkList.toJSON(),
            driverName: authData?.name || 'نامشخص',
            zone: authData?.zone || 'نامشخص',
            company: authData?.company || 'نامشخص',
          };
        });
      
        // مپ برای ترجمه پاسخ‌ها به فارسی
        const ANSWER_TRANSLATIONS = {
          'good': 'خوب',
          'medium': 'متوسط',
          'weak': 'بد',
        };
      
        // لیست سوالات با کلید پاسخ
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
      
        // ایجاد داده‌های عمودی
        const verticalData = [];
        enrichedData.forEach((data) => {
          ANSWER_FIELDS.forEach(({ field, question }) => {
            if (data[field] !== undefined && data[field] !== null) {
              const originalAnswer = data[field];
              const translatedAnswer = ANSWER_TRANSLATIONS[originalAnswer] || originalAnswer;
      
              verticalData.push({
                userId: data.userId,
                history: data.history,
                hours: data.hours,
                isDeleted: data.isDeleted ? 'بله' : 'خیر',
                driverName: data.driverName,
                zone: data.zone,
                company: data.company,
                question,
                answer: translatedAnswer,
              });
            }
          });
        });
      
        // ساخت فایل اکسل
        const workbook = new Workbook();
        const worksheet = workbook.addWorksheet('گزارش چک‌لیست');
      
        // تعریف ستون‌ها
        worksheet.columns = [
          { header: 'شناسه کاربر', key: 'userId', width: 15 },
          { header: 'تاریخچه', key: 'history', width: 20 },
          { header: 'ساعات', key: 'hours', width: 10 },
          { header: 'نام راننده', key: 'driverName', width: 20 },
          { header: 'منطقه', key: 'zone', width: 15 },
          { header: 'شرکت', key: 'company', width: 20 },
          { header: 'سوال', key: 'question', width: 20 },
          { header: 'پاسخ', key: 'answer', width: 20 },
          { header: 'حذف شده', key: 'isDeleted', width: 10 },
        ];
      
        // اضافه کردن داده‌ها به اکسل
        verticalData.forEach((row) => {
          worksheet.addRow(row);
        });
      
        // تنظیمات خروجی اکسل
        const headerRow = worksheet.getRow(1);
        headerRow.eachCell((cell) => {
          cell.font = {
            bold: true,
            size: 14,
            name: 'Arial',
          };
          cell.alignment = {
            vertical: 'middle',
            horizontal: 'center',
          };
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFF00' },
          };
        });
      
        headerRow.height = 20;
      
        // تولید فایل اکسل
        const buffer = await workbook.xlsx.writeBuffer();
        return buffer;
      }
      
      


      async exportPriodicCheckTruckData(
        excelFilterDto: ExcelFilterDto
      ) {
        try {
          const { driverNames, companies, zones, carNumbers, startDate, endDate } = excelFilterDto;
        
          const authFilter: any = {};
        
          if (zones && zones.length > 0) {
            authFilter.zone = { [Op.in]: zones };
          }
          if (companies && companies.length > 0) {
            authFilter.company = { [Op.in]: companies };
          }
        
          const matchingDrivers = await this.authRepository.findAll({
            where: authFilter,
            attributes: ['id', 'name', 'company', 'zone'],
          });
        
          if (!matchingDrivers || matchingDrivers.length === 0) {
            throw new Error('هیچ راننده‌ای پیدا نشد');
          }
        
          const driverIds = matchingDrivers.map((driver) => driver.id);
        
          const periodicTruckCheckFilter: any = {};
          if (startDate && endDate) {
            const start = new Date(startDate);
            start.setHours(0, 0, 0, 0);
        
            const end = new Date(endDate);
            end.setHours(0, 0, 0, 0);
        
            periodicTruckCheckFilter.createdAt = {
              [Op.between]: [start, end],
            };
          }
        
          const truckInfoFilter: any = {};
        
          if (carNumbers && carNumbers.length > 0) {
            truckInfoFilter.carNumber = { [Op.in]: carNumbers };
          }
        
          if (driverNames && driverNames.length > 0) {
            truckInfoFilter.driverName = { [Op.in]: driverNames };
          }
        
          if (driverIds.length > 0) {
            truckInfoFilter.driverId = { [Op.in]: driverIds };
          }
        
          const truckInfos = await this.truckInfoRepository.findAll({
            where: truckInfoFilter,
            attributes: ['id', 'driverId', 'carNumber', 'zone'],
            include: [
              {
                model: PeriodicTruckCheck,
                where: periodicTruckCheckFilter,
                attributes: ['id', 'endKilometer', 'endDate', 'alertReview', 'createdAt'],
                include: [
                  {
                    model: PeriodicType,  // بارگذاری اطلاعات نوع قطعه
                    attributes: ['type', 'name'],
                  }
                ]
              },
            ],
          });
        
          const allDriverIds = truckInfos.map((truckInfo) => truckInfo.driverId);
          const drivers = await this.authRepository.findAll({
            where: { id: { [Op.in]: allDriverIds } },
            attributes: ['id', 'name', 'company'],
          });
        
          const enrichedData = [];
          truckInfos.forEach((truckInfo) => {
            const driver = drivers.find((d) => d.id === truckInfo.driverId);
            if (!driver) return;
        
            truckInfo.periodicTruckCheck.forEach((check) => {
              if (check.periodicType) {
                enrichedData.push({
                  truckInfoId: truckInfo.id,
                  driverName: driver.name || 'نامشخص',
                  company: driver.company || 'نامشخص',
                  carNumber: truckInfo.carNumber,
                  type: check.periodicType.name || 'نامشخص',  // استفاده از name از PeriodicType
                  zone: truckInfo.zone,
                  endKilometer: check.endKilometer,
                  endDate: check.endDate,
                  alertReview: check.alertReview,
                  createdAt: check.createdAt,
                });
              }
            });
          });
        
          const workbook = new Workbook();
          const worksheet = workbook.addWorksheet('گزارش اطلاعات خودروها');
        
          worksheet.columns = [
            { header: 'شناسه خودرو', key: 'truckInfoId', width: 15 },
            { header: 'نام راننده', key: 'driverName', width: 20 },
            { header: 'شرکت', key: 'company', width: 20 },
            { header: 'پلاک خودرو', key: 'carNumber', width: 15 },
            { header: 'نوع قطعه', key: 'type', width: 20 },  // ستون نوع قطعه
            { header: 'منطقه', key: 'zone', width: 15 },
            { header: 'کیلومتر انتهایی', key: 'endKilometer', width: 15 },
            { header: 'تاریخ انتهایی', key: 'endDate', width: 15 },
            { header: 'آلارم بازبینی', key: 'alertReview', width: 15 },
            { header: 'تاریخ ایجاد', key: 'createdAt', width: 20 },
          ];
        
          const headerRow = worksheet.getRow(1);
          headerRow.eachCell((cell) => {
            cell.font = {
              bold: true,
              size: 14,
              name: 'Arial',
            };
            cell.alignment = {
              vertical: 'middle',
              horizontal: 'center',
            };
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FFFF00' },
            };
          });
        
          headerRow.height = 20;
        
          if (enrichedData.length > 0) {
            enrichedData.forEach((data) => {
              const row = worksheet.addRow(data);
              row.eachCell((cell) => {
                cell.alignment = {
                  vertical: 'middle',
                  horizontal: 'center',
                };
              });
            });
          } else {
            const row = worksheet.addRow(['اطلاعاتی یافت نشد']);
            row.eachCell((cell) => {
              cell.alignment = {
                vertical: 'middle',
                horizontal: 'center',
              };
            });
          }
        
          // تولید بافر اکسل
          const buffer = await workbook.xlsx.writeBuffer();
          return buffer;
        } catch (error) {
          console.error('Error exporting periodic check truck data:', error);
          throw new Error('خطایی در هنگام استخراج داده‌ها رخ داده است.');
        }
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


        