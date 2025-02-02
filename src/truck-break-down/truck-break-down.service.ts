import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { TruckBreakDownItems } from 'src/truck-break-down-items/truck-break-down-items.entity';
import { TruckBreakDown } from 'src/truck-break-down/truck-break-down.entity';
import { TruckInfo } from 'src/truck-info/truck-info.entity';
import { UpdateTruckBreakDownDto } from './dto/update.truck-breakdown.dto';
import { Op } from 'sequelize';
import { AuthService } from 'src/auth/services/auth.service';
import { Workbook } from 'exceljs';
import { generateDataExcel } from 'src/utility/export_excel';
import { FIELDS_OF_EXCEL_REPORT_TRANSPORT_AND_LOGISTIC_ADMIN } from 'src/static/enum';
import { COLUMNS_NAME_EXCEL_REPORT_TRANSPORT_AND_LOGISTIC_ADMIN } from 'src/static/fields-excelFile';
import { Auth } from 'src/auth/auth.entity';
import { RepairInvoice } from 'src/repair-invoice/rapair-invoice.entity';
@Injectable()
export class TruckBreakDownService {
  constructor(
    @Inject('TRUCKBREAKDOWN_REPOSITORY')
    private readonly truckBreakDownRepository: typeof TruckBreakDown,
    @Inject('TRUCKBREAKDOWNITEMS_REPOSITORY')
    private readonly truckBreakDownItemsRepository: typeof TruckBreakDownItems,
    @Inject('TRUCKINFO_REPOSITORY')
    private readonly truckInfoRepository: typeof TruckInfo,
    private readonly authService: AuthService,
    @Inject('REPAIRINVOICE_REPOSITORY') private readonly repairInvoice: typeof RepairInvoice
    //comment : better solution inject "truckBreakDownItem Service" instead inject "truckBreakDownItemsRepository"
    // @Inject('TRUCKBREAKDOWNITEMS_REPOSITORY')
    // private truckBreakDownItemService: typeof TruckBreakDownService,
  ) { }

  // async getAll() {
  //   let data = [];

  //   const breakDowns = await this.truckBreakDownRepository.findAndCountAll({
  //     order: [['id', 'DESC']],
  //   });

  //   for (let item of breakDowns.rows) {
  //     let breakDown = {};
  //     const answers = await this.truckBreakDownItemsRepository.findOne({
  //       where: {
  //         id: item.truckBreakDownItemsId,
  //       },
  //     });
  //     //   console.log(answers);
  //     breakDown = item.dataValues;
  //     breakDown['answers'] = answers.dataValues;
  //     data.push(breakDown);
  //     //   console.log(data);
  //   }
  //   return {
  //     status: 200,
  //     data: data,
  //     count: breakDowns.count,
  //   };
  // }

  // async getAll() {
  //   let data = [];

  //   const breakDowns = await this.truckBreakDownRepository.findAndCountAll({
  //     order: [['id', 'DESC']],
  //     include: [
  //       {
  //         model: this.truckBreakDownItemsRepository,
  //         as: 'truckBreakDownItems', // نام مستعار مدل
  //         required: false,
  //       },
  //     ],
  //   });

  //   // بررسی و تغییر کیلومتر در خروجی
  //   for (let item of breakDowns.rows) {
  //     let breakDown = item.dataValues;

  //     // بررسی تغییرات کیلومتر
  //     const unresolvedBreakdowns = await this.truckBreakDownRepository.findAll({
  //       where: {
  //         id: item.id,
  //         historySendToRepair: null, // خرابی‌های حل نشده
  //       },
  //     });

  //     if (unresolvedBreakdowns.length > 0) {
  //       const updatedKilometer = item.dataValues.carLife; 
  //       breakDown['carLife'] = updatedKilometer;
  //     }

  //     // اضافه کردن اطلاعات مربوط به `answers`
  //     if (item.truckBreakDownItems) {
  //       breakDown['answers'] = item.truckBreakDownItems.dataValues;
  //     } else {
  //       breakDown['answers'] = null;
  //     }

  //     data.push(breakDown);
  //   }

  //   return {
  //     status: 200,
  //     data: data,
  //     count: breakDowns.count,
  //   };
  // }


  async getAll() {
    const data = [];

    const breakDowns = await this.truckBreakDownRepository.findAndCountAll({
      where: { status: 'opened' },
      order: [['id', 'DESC']],
      include: [
        {
          model: this.truckBreakDownItemsRepository,
          as: 'truckBreakDownItems',
          required: false,
        },
      ],
    });

    for (const item of breakDowns.rows) {
      let breakDown = item.dataValues;

      // بررسی خرابی ناتمام
      if (item.historySendToRepair === null) {
        // دریافت اطلاعات مربوط به `truckInfo`
        const truckInfo = await this.truckInfoRepository.findOne({
          where: { driverId: item.driverId },
        });

        if (truckInfo) {
          // به‌روزرسانی `carLife` فقط در صورت ناتمام بودن خرابی
          breakDown['carLife'] = truckInfo.lastCarLife;
        }
      }

      // اضافه کردن اطلاعات مربوط به `answers`
      if (item.truckBreakDownItems) {
        breakDown['answers'] = item.truckBreakDownItems.dataValues;
      } else {
        breakDown['answers'] = null;
      }

      data.push(breakDown);
    }


    return {
      status: 200,
      data: data,
      count: breakDowns.count,
    };
  }




  async transportUserCountListState() {
    // ==============================================#HINT: "transportComment" and "repairDone" not set in queryParams
    const breakDownNecessaryToDo = await this.truckBreakDownRepository.count({
      where: {
        [Op.and]: {
          transportComment: { [Op.eq]: null },
          logisticConfirm: { [Op.ne]: false },
        },
      },
    });
    // ==============================================#HINT: "transportComment" === 'true' in "transportUserGetAll()"
    const breakDownDoing = await this.truckBreakDownRepository.count({
      where: {
        [Op.and]: {
          transportComment: { [Op.ne]: null },
          historyReciveToRepair: { [Op.eq]: null },
          logisticConfirm: { [Op.ne]: false },
        },
      },
    });
    // ==============================================#HINT: "repairDone" === 'true' in "transportUserGetAll()"
    const breakDownDone = await this.truckBreakDownRepository.count({
      where: {
        [Op.and]: {
          logisticConfirm: { [Op.ne]: false },
          transportComment: { [Op.in]: ['necessary', 'immediately'] },
          historyDeliveryDriver: { [Op.ne]: null },
        },
      },
    });

    return {
      data: {
        necessaryToDoCount: breakDownNecessaryToDo,
        doingCount: breakDownDoing,
        done: breakDownDone,
      },
      status: 200,
      message: 'successfully operation',
    };
  }
  // query: "repairDone" ---> list of "Activity in Done state" //#Hint
  // query: "transportComment" ---> list of "Activity in Doing state" // #Hint
  // list of dashboard role "transportAdmin" // #Hint
  // async transportUserGetAll(
  //   transportComment: string,
  //   repairDone: string,
  //   count: string,
  //   beforeHistory?: string,
  //   afterHistory?: string,
  //   carNumber?: string,
  //   company?: string,
  //   zone?: string,
  // ) {
  //   let findFactor=[];
  //   let filter = {}; // filter by "date" or "carNumber"
  //   let data = [];
  //   // const driversId = [];
  //   let countList: number;
  //   let breakDowns: {
  //     rows: TruckBreakDown[];
  //     count: number;
  //   };
  //   if (beforeHistory || afterHistory) {
  //     if (!afterHistory) {
  //       afterHistory = '2400/0/0';
  //     }
  //     if (!beforeHistory) {
  //       beforeHistory = '2023/0/0';
  //     }
  //     // comment; handle filter date on "historyDeliveryDriver" instead "historyDriverRegister" in "ActivityDone" list
  //     if (repairDone == undefined) {
  //       filter['historyDriverRegister'] = {
  //         [Op.between]: [`${beforeHistory}`, `${afterHistory}`],
  //       };
  //     } else {
  //       filter['historyDeliveryDriver'] = {
  //         [Op.between]: [`${beforeHistory}`, `${afterHistory}`],
  //       };
  //     }
  //   }

  //   if (carNumber) {
  //     filter['carNumber'] = carNumber;
  //   }

  //   if (company) {
  //     const usersInCompany = await this.getUserIdListByCompanyName(company);
  //     filter['driverId'] = { [Op.in]: usersInCompany };
  //   }

  //   if (transportComment === 'true') {
  //     breakDowns = await this.truckBreakDownRepository.findAndCountAll({
  //       where: {
  //         [Op.and]: {
  //           status: { [Op.eq]: 'opened' },
  //           transportComment: { [Op.ne]: null },
  //           historyReciveToRepair: { [Op.eq]: null },
  //           logisticConfirm: { [Op.ne]: false },
  //           ...filter,
  //         },
  //       },
  //       order: [['id', 'DESC']],
  //       limit: 20,
  //     });

  //     for (let item of breakDowns.rows) {
  //       if (item.transportComment === 'notNecessary') {
  //         await this.truckBreakDownRepository.update(
  //           { status: 'closed' },
  //           { where: { id: item.id } },
  //         );

  //       }
  //     }
  //   }
  //   // get list of "Activity done"
  //   else if (repairDone === 'true') {
  //     // console.log('filter: ', filter); // #DEBUG
  //     breakDowns = await this.truckBreakDownRepository.findAndCountAll({
  //       where: {
  //         [Op.and]: {
  //           logisticConfirm: { [Op.ne]: false },
  //           transportComment: { [Op.in]: ['necessary', 'immediately'] },
  //           historyDeliveryDriver: { [Op.ne]: null },
  //           ...filter,
  //         },
  //       },
  //       order: [['id', 'DESC']],
  //       limit: 20,
  //     });
      
  //     if(breakDowns.count!=0){
  //       for(let item of breakDowns.rows){
  //         console.log(item.dataValues.id);
          
  //       const find= await this.repairInvoice.findOne({
  //           where:{truckBreakDownId:item.dataValues.id}
  //         });
  //         console.log(find);
          
  //         if(find){
  //           findFactor.push(find)
  //         }
  //       }
  //       }
 

  //     for (let item of breakDowns.rows) {
  //       if (item.transportComment === 'notNecessary') {
  //         // await this.truckBreakDownRepository.update(
  //         //   { status: 'closed' },
  //         //   { where: { id: item.id } },
  //         // );

  //       }
  //     }
  //     // get list of "Activity necessary to do"
  //   } else {
      
  //     breakDowns = await this.truckBreakDownRepository.findAndCountAll({
  //       where: {
  //         [Op.and]: {
  //           transportComment: { [Op.eq]: null },
  //           logisticConfirm: { [Op.eq]: true },
  //           ...filter,
  //         },
  //       },
  //       order: [['id', 'DESC']],
  //       limit: 20,
  //     });

  //     for (let item of breakDowns.rows) {
  //       if (item.transportComment === 'notNecessary') {
  //         // await this.truckBreakDownRepository.update(
  //         //   { status: 'closed' },
  //         //   { where: { id: item.id } },
  //         // );

  //       }
  //     }
  //   }
  //   // console.log(breakDowns); // #Debug
  //   if (count === 'true') {
  //     countList = breakDowns.count;
  //   } else {
  //     for (let item of breakDowns.rows) {
  //       let breakDown = {};
  //       let row = {};

  //       breakDown = item.dataValues;

  //       const userInfo = await this.authService.getById(breakDown['driverId']);

  //       const carPiecesHistory = await this.getCarPiecesHistory(
  //         breakDown['carNumber'],
  //       );
  //       row['factor']=findFactor
  //       row['id'] = breakDown['id'];
  //       row['numberOfBreakDown'] = breakDown['numberOfBreakDown'];
  //       row['hours'] = breakDown['hoursDriverRegister'];
  //       row['history'] = breakDown['historyDriverRegister'];
  //       row['driverName'] = breakDown['driverName'];
  //       row['driverMobile'] = breakDown['driverMobile'];
  //       row['carNumber'] = breakDown['carNumber'];
  //       row['kilometer'] = breakDown['carLife']; // carLife set value when driver register daily check list
  //       row['transportComment'] = breakDown['transportComment'];
  //       row['logisticConfirm'] = breakDown['logisticConfirm'];
  //       row['logisticComment'] = breakDown['logisticComment'];
  //       row['historySendToRepair'] = breakDown['historySendToRepair'];
  //       row['historyReciveToRepair'] = breakDown['historyReciveToRepair'];
  //       row['histroyDeliveryTruck'] = breakDown['histroyDeliveryTruck'];
  //       row['historyDeliveryDriver'] = breakDown['historyDeliveryDriver'];
  //       row['hoursRepairComment'] = breakDown['hoursRepairComment'];
  //       row['historyRepairComment'] = breakDown['historyRepairComment'];

  //       if (userInfo) {
  //         row['personalCode'] = userInfo.personelCode;
  //         row['company'] = userInfo.company;
  //         row['zone'] = userInfo.zone;
  //       }

  //       row['piece'] = breakDown['piece'];
  //       row['piecesReplacementHistory'] = carPiecesHistory;
  //       // console.log('itemsId to fetch: ', breakDown['truckBreakDownItemsId']); // #Debug

  //       row['answers'] = await this.getBreakDownItemsById(
  //         breakDown['truckBreakDownItemsId'],
  //       );

  //       data.push(row);
  //     }
  //   }

  //   return {
  //     status: 200,
  //     data: countList === 0 || countList ? countList : data,
  //     count: breakDowns.count,
  //   };
  // }


  async transportUserGetAll(
    transportComment: string,
    repairDone: string,
    count: string,
    beforeHistory?: string,
    afterHistory?: string,
    carNumber?: string,
    company?: string,
    zone?: string,
  ) {
    let response = [];
    let findFactor = [];
    let filter = {};
    let data = [];
    let countList: number;
    let breakDowns: {
      rows: TruckBreakDown[];
      count: number;
    };
  
    // تاریخ‌های فیلتر
    if (beforeHistory || afterHistory) {
      if (!afterHistory) {
        afterHistory = '2400/0/0';
      }
      if (!beforeHistory) {
        beforeHistory = '2023/0/0';
      }
  
      if (repairDone === undefined) {
        filter['historyDriverRegister'] = {
          [Op.between]: [`${beforeHistory}`, `${afterHistory}`],
        };
      } else {
        filter['historyDeliveryDriver'] = {
          [Op.between]: [`${beforeHistory}`, `${afterHistory}`],
        };
      }
    }
  
    if (carNumber) {
      filter['carNumber'] = carNumber;
    }
  
    if (company) {
      const usersInCompany = await this.getUserIdListByCompanyName(company);
      filter['driverId'] = { [Op.in]: usersInCompany };
    }
  
    if (transportComment === 'true') {
      breakDowns = await this.truckBreakDownRepository.findAndCountAll({
        where: {
          [Op.and]: {
            status: { [Op.eq]: 'opened' },
            transportComment: { [Op.ne]: null },
            historyReciveToRepair: { [Op.ne]: null },
            logisticConfirm: { [Op.ne]: false },
          },
        },
        order: [['id', 'DESC']],
        limit: 20,
      });
  
      for (let item of breakDowns.rows) {
        if (item.truckBreakDownItemsId != null) {
          const findBreakDown = await this.truckBreakDownItemsRepository.findOne({
            where: { id: item.truckBreakDownItemsId },
          });
          response.push(findBreakDown);
        }
      }
  
      for (let item of breakDowns.rows) {
        if (item.transportComment === 'notNecessary') {
          await this.truckBreakDownRepository.update(
            { status: 'closed' },
            { where: { id: item.id } },
          );
        }
      }
    } else if (repairDone === 'true') {
      breakDowns = await this.truckBreakDownRepository.findAndCountAll({
        where: {
          [Op.and]: {
            logisticConfirm: { [Op.ne]: false },
            transportComment: { [Op.in]: ['necessary', 'immediately'] },
            historyDeliveryDriver: { [Op.ne]: null },
            ...filter,
          },
        },
        order: [['id', 'DESC']],
        limit: 20,
      });
  
      if (breakDowns.count !== 0) {
        const promises = breakDowns.rows.map(async (item) => {
          const invoices = await this.repairInvoice.findAll({
            where: { truckBreakDownId: item.dataValues.id },
          });
  
          if (invoices.length > 0) {
            // اضافه کردن فاکتورها به آرایه findFactor برای هر truckBreakDownId
            findFactor.push({
              truckBreakDownId: item.dataValues.id,
              invoices: invoices.map(invoice => invoice.dataValues),
            });
          }
        });
  
        await Promise.all(promises);
      }
    } else {
      breakDowns = await this.truckBreakDownRepository.findAndCountAll({
        where: {
          [Op.and]: {
            transportComment: { [Op.eq]: null },
            logisticConfirm: { [Op.eq]: true },
            ...filter,
          },
        },
        order: [['id', 'DESC']],
        limit: 20,
      });
  
      for (let item of breakDowns.rows) {
        if (item.transportComment === 'notNecessary') {
          await this.truckBreakDownRepository.update(
            { status: 'closed' },
            { where: { id: item.id } },
          );
        }
      }
    }
  
    if (count === 'true') {
      countList = breakDowns.count;
    } else {
      for (let item of breakDowns.rows) {
        let breakDown = {};
        let row = {};
  
        breakDown = item.dataValues;
  
        const userInfo = await this.authService.getById(breakDown['driverId']);
  
        const carPiecesHistory = await this.getCarPiecesHistory(
          breakDown['carNumber'],
        );
  
        row['id'] = breakDown['id'];
        row['numberOfBreakDown'] = breakDown['numberOfBreakDown'];
        row['hours'] = breakDown['hoursDriverRegister'];
        row['history'] = breakDown['historyDriverRegister'];
        row['driverName'] = breakDown['driverName'];
        row['driverMobile'] = breakDown['driverMobile'];
        row['carNumber'] = breakDown['carNumber'];
        row['kilometer'] = breakDown['carLife'];
        row['transportComment'] = breakDown['transportComment'];
        row['logisticConfirm'] = breakDown['logisticConfirm'];
        row['logisticComment'] = breakDown['logisticComment'];
        row['historySendToRepair'] = breakDown['historySendToRepair'];
        row['historyReciveToRepair'] = breakDown['historyReciveToRepair'];
        row['histroyDeliveryTruck'] = breakDown['histroyDeliveryTruck'];
        row['historyDeliveryDriver'] = breakDown['historyDeliveryDriver'];
        row['hoursRepairComment'] = breakDown['hoursRepairComment'];
        row['historyRepairComment'] = breakDown['historyRepairComment'];
        row['breakDown'] = response;
  
        // اضافه کردن فاکتورها به رکورد مربوطه در data
        const relatedFactors = findFactor.filter(factor => factor.truckBreakDownId === breakDown['id']);
        if (relatedFactors.length > 0) {
          row['repairInvoice'] = relatedFactors[0].invoices; // همه فاکتورها برای این truckBreakDownId
        }
  
        if (userInfo) {
          row['personelCode'] = userInfo.personelCode;
          row['company'] = userInfo.company;
          row['zone'] = userInfo.zone;
        }
  
        row['piece'] = breakDown['piece'];
        row['piecesReplacementHistory'] = carPiecesHistory;
  
        row['answers'] = await this.getBreakDownItemsById(
          breakDown['truckBreakDownItemsId'],
        );
  
        data.push(row);
      }
    }
  
    return {
      status: 200,
      data: countList === 0 || countList ? countList : data, // ارسال داده‌ها همراه با فاکتورها
      count: breakDowns.count,
    };
  }
  

  // async transportUserGetAll(
  //   transportComment: string,
  //   repairDone: string,
  //   count: string,
  //   beforeHistory?: string,
  //   afterHistory?: string,
  //   carNumber?: string,
  //   company?: string,
  //   zone?: string,
  // ) {
  //   let response=[];
  //   let findFactor = [];
  //   let filter = {};
  //   let data = [];
  //   let countList: number;
  //   let breakDowns: {
  //     rows: TruckBreakDown[];
  //     count: number;
  //   };
  
  //   if (beforeHistory || afterHistory) {
  //     if (!afterHistory) {
  //       afterHistory = '2400/0/0';
  //     }
  //     if (!beforeHistory) {
  //       beforeHistory = '2023/0/0';
  //     }
  
  //     if (repairDone == undefined) {
  //       filter['historyDriverRegister'] = {
  //         [Op.between]: [`${beforeHistory}`, `${afterHistory}`],
  //       };
  //     } else {
  //       filter['historyDeliveryDriver'] = {
  //         [Op.between]: [`${beforeHistory}`, `${afterHistory}`],
  //       };
  //     }
  //   }
  
  //   if (carNumber) {
  //     filter['carNumber'] = carNumber;
  //   }
  
  //   if (company) {
  //     const usersInCompany = await this.getUserIdListByCompanyName(company);
  //     filter['driverId'] = { [Op.in]: usersInCompany };
  //   }
  
  //   if (transportComment === 'true') {
  //     console.log(filter);
      
  //     breakDowns = await this.truckBreakDownRepository.findAndCountAll({
  //       where: {
  //         [Op.and]: {
  //           status: { [Op.eq]: 'opened' },
  //           transportComment: { [Op.ne]: null },
  //           historyReciveToRepair: { [Op.ne]: null },
  //           logisticConfirm: { [Op.ne]: false },
  //         },
  //       },
  //       order: [['id', 'DESC']],
  //       limit: 20,
  //     });
  //     for(let item of breakDowns.rows){
  //      if(item.truckBreakDownItemsId!=null){
  //       const findBreakDown=await this.truckBreakDownItemsRepository.findOne({
  //         where:{id:item.truckBreakDownItemsId}
  //       });
  //       response.push(findBreakDown)
  //      }
  //     }
      
  //     for (let item of breakDowns.rows) {
  //       if (item.transportComment === 'notNecessary') {
  //         await this.truckBreakDownRepository.update(
  //           { status: 'closed' },
  //           { where: { id: item.id } },
  //         );
  //       }
  //     }
  //   }
  //   else if (repairDone === 'true') {
  //     breakDowns = await this.truckBreakDownRepository.findAndCountAll({
  //       where: {
  //         [Op.and]: {
  //           logisticConfirm: { [Op.ne]: false },
  //           transportComment: { [Op.in]: ['necessary', 'immediately'] },
  //           historyDeliveryDriver: { [Op.ne]: null },
  //           ...filter,
  //         },
  //       },
  //       order: [['id', 'DESC']],
  //       limit: 20,
  //     });
    
  //     if (breakDowns.count !== 0) {
  //       const promises = breakDowns.rows.map(async (item) => {
  //         console.log(`Processing Truck Breakdown ID: ${item.dataValues.id}`);
          
  //         const finds = await this.repairInvoice.findAll({
  //           where: { truckBreakDownId: item.dataValues.id },
  //         });
          
  //         console.log(finds);
          
  //         if (finds.length > 0) {
  //           findFactor.push(...finds);
  //         }
  //       });
      
  //       await Promise.all(promises);
  //     }
      
  //   }
  //   else {
  //     breakDowns = await this.truckBreakDownRepository.findAndCountAll({
  //       where: {
  //         [Op.and]: {
  //           transportComment: { [Op.eq]: null },
  //           logisticConfirm: { [Op.eq]: true },
  //           ...filter,
  //         },
  //       },
  //       order: [['id', 'DESC']],
  //       limit: 20,
  //     });
  
  //     for (let item of breakDowns.rows) {
  //       if (item.transportComment === 'notNecessary') {
  //         await this.truckBreakDownRepository.update(
  //           { status: 'closed' },
  //           { where: { id: item.id } },
  //         );
  //       }
  //     }
  //   }
  
  //   if (count === 'true') {
  //     countList = breakDowns.count;
  //   } else {
  //     for (let item of breakDowns.rows) {
  //       let breakDown = {};
  //       let row = {};
  
  //       breakDown = item.dataValues;
  
  //       const userInfo = await this.authService.getById(breakDown['driverId']);
  
  //       const carPiecesHistory = await this.getCarPiecesHistory(
  //         breakDown['carNumber'],
  //       );
  
  //       row['id'] = breakDown['id'];
  //       row['numberOfBreakDown'] = breakDown['numberOfBreakDown'];
  //       row['hours'] = breakDown['hoursDriverRegister'];
  //       row['history'] = breakDown['historyDriverRegister'];
  //       row['driverName'] = breakDown['driverName'];
  //       row['driverMobile'] = breakDown['driverMobile'];
  //       row['carNumber'] = breakDown['carNumber'];
  //       row['kilometer'] = breakDown['carLife']; 
  //       row['transportComment'] = breakDown['transportComment'];
  //       row['logisticConfirm'] = breakDown['logisticConfirm'];
  //       row['logisticComment'] = breakDown['logisticComment'];
  //       row['historySendToRepair'] = breakDown['historySendToRepair'];
  //       row['historyReciveToRepair'] = breakDown['historyReciveToRepair'];
  //       row['histroyDeliveryTruck'] = breakDown['histroyDeliveryTruck'];
  //       row['historyDeliveryDriver'] = breakDown['historyDeliveryDriver'];
  //       row['hoursRepairComment'] = breakDown['hoursRepairComment'];
  //       row['historyRepairComment'] = breakDown['historyRepairComment'];
  //       row['breakDown']=response
  
  //       if (userInfo) {
  //         row['personelCode'] = userInfo.personelCode;
  //         row['company'] = userInfo.company;
  //         row['zone'] = userInfo.zone;
  //       }
  
  //       row['piece'] = breakDown['piece'];
  //       row['piecesReplacementHistory'] = carPiecesHistory;
  
  //       row['answers'] = await this.getBreakDownItemsById(
  //         breakDown['truckBreakDownItemsId'],
  //       );
  
  //       const repairInvoice = await this.repairInvoice.findOne({
  //         where: { truckBreakDownId: breakDown['id'] },
  //       });
  //       if (repairInvoice) {
  //         row['repairInvoice'] = repairInvoice.dataValues;
  //       }
  
  //       data.push(row);
  //     }
  //   }
  
  //   return {
  //     status: 200,
  //     data: countList === 0 || countList ? countList : data,
  //     count: breakDowns.count,
  //   };
  // }
  

  async exportReportTransportAdmin(
    transportComment: string,
    repairDone: string,
    count: string,
    beforeHistory: string,
    afterHistory: string,
    carNumber: string,
    company: string,
    zone: string,
  ) {
    try {
      const book = new Workbook();
      const workSheet = book.addWorksheet('TransportAdmin_report');

      let rows: Array<any> = [];

      const truckBreakDowns = await this.transportUserGetAll(
        transportComment,
        repairDone,
        count,
        beforeHistory,
        afterHistory,
        carNumber,
        company,
        zone,
      );

      // console.log('truckBreakDowns', truckBreakDowns.data);
      workSheet.columns =
        COLUMNS_NAME_EXCEL_REPORT_TRANSPORT_AND_LOGISTIC_ADMIN;
      if (typeof truckBreakDowns.data == 'object') {
        rows.push(...truckBreakDowns.data);

        const data = generateDataExcel(
          FIELDS_OF_EXCEL_REPORT_TRANSPORT_AND_LOGISTIC_ADMIN,
          rows,
        );

        data.forEach((x) => {
          workSheet.addRow(Object.values(x));
        });
      } else {
        workSheet.addRow('not have data');
      }

      const buffer = await book.xlsx.writeBuffer();
      return buffer;
    } catch (err) {
      console.log(err);
    }
  }

  // list of dashboard role "LogisticAdmin"
  // async logisticUserGetAll(
  //   logisticComment: string,
  //   repairDone: string,
  //   reciveToRepair: string,
  //   count: string,
  //   beforeHistory: string,
  //   afterHistory: string,
  //   carNumber: string,
  //   company: string,
  //   zone: string,
  // ) {
  //   let filter = {}; // filter by "date" or "carNumber"
  //   let data = [];
  //   let countList: number;
  //   let breakDowns: {
  //     rows: TruckBreakDown[];
  //     count: number;
  //   };
  //   const usersIdInSameZone = [];
  //   const usersIdInCompany = [];
  //   let usersIdFilter = [];
  //   if (beforeHistory || afterHistory) {
  //     if (!afterHistory) {
  //       afterHistory = '2400/0/0';
  //     }
  //     if (!beforeHistory) {
  //       beforeHistory = '2023/0/0';
  //     }
  //     if (repairDone == undefined) {
  //       filter['historyDriverRegister'] = {
  //         [Op.between]: [`${beforeHistory}`, `${afterHistory}`],
  //       };
  //     } else {
  //       filter['historyDeliveryDriver'] = {
  //         [Op.between]: [`${beforeHistory}`, `${afterHistory}`],
  //       };
  //     }
  //   }
  //   if (carNumber) {
  //     filter['carNumber'] = carNumber;
  //   }

  //   const driversInZone = await this.getUsersSameZone(zone, 'companyDriver');
  //   driversInZone.forEach((driver) => {
  //     usersIdInSameZone.push(driver.dataValues['id']);
  //   });

  //   if (company) {
  //     const filterUserByCompany =
  //       await this.getUserIdListByCompanyName(company);

  //     filterUserByCompany.forEach((driver) => {
  //       usersIdInCompany.push(driver.dataValues['id']);
  //     });
  //     usersIdFilter = usersIdInSameZone.filter((item) => {
  //       return usersIdInCompany.includes(item);
  //     });
  //   } else {
  //     usersIdFilter.push(...usersIdInSameZone);
  //   }
  //   // console.log('userIdInCompany :', usersIdInCompany); // #DEBUG
  //   // console.log('filterUserBy', driversInZone); // #DEBUG
  //   // console.log('usersIdFilter in just same zone:', usersIdFilter); // #DEBUG

  //   // console.log('DIIZ', driversId); // #Debug
  //   // get list of  "Activity in Progress"
  //   if (logisticComment === 'true') {
  //     breakDowns = await this.truckBreakDownRepository.findAndCountAll({
  //       where: {
  //         [Op.and]: {
  //           logisticConfirm: { [Op.eq]: true },
  //           historyReciveToRepair: { [Op.eq]: null },
  //           driverId: { [Op.in]: usersIdFilter },
  //           ...filter,
  //         },
  //       },
  //       order: [['id', 'DESC']],
  //       limit: 20,
  //     });
  //   } else if (repairDone === 'true') {
  //     breakDowns = await this.truckBreakDownRepository.findAndCountAll({
  //       where: {
  //         [Op.and]: {
  //           logisticConfirm: { [Op.ne]: false },
  //           transportComment: { [Op.in]: ['necessary', 'immediately'] },
  //           historyDeliveryDriver: { [Op.ne]: null },
  //           driverId: { [Op.in]: usersIdFilter },
  //           ...filter,
  //         },
  //       },
  //       order: [['id', 'DESC']],
  //       limit: 20,
  //     });
  //   }
  //   // get list of "Activity necessary to do"
  //   else {
  //     breakDowns = await this.truckBreakDownRepository.findAndCountAll({
  //       where: {
  //         [Op.and]: {
  //           logisticConfirm: { [Op.eq]: false },
  //           driverId: { [Op.in]: usersIdFilter },
  //           ...filter,
  //         },
  //       },
  //       order: [['id', 'DESC']],
  //       limit: 20,
  //     });
  //   }
  //   // console.log(breakDowns); //#Debug
  //   if (count === 'true') {
  //     countList = breakDowns.count;
  //   } else {
  //     for (let item of breakDowns.rows) {
  //       let breakDown = {};
  //       let row = {};

  //       breakDown = item.dataValues;

  //       const carPiecesHistory = await this.getCarPiecesHistory(
  //         breakDown['carNumber'],
  //       );

  //       row['id'] = breakDown['id'];
  //       row['numberOfBreakDown'] = breakDown['numberOfBreakDown'];
  //       row['hours'] = breakDown['hoursDriverRegister'];
  //       row['history'] = breakDown['historyDriverRegister'];
  //       row['driverName'] = breakDown['driverName'];
  //       row['driverMobile'] = breakDown['driverMobile'];
  //       row['carNumber'] = breakDown['carNumber'];
  //       row['kilometer'] = breakDown['carLife'];
  //       row['logisticConfirm'] = breakDown['logisticConfirm'];
  //       row['transportComment'] = breakDown['transportComment'];
  //       row['historySendToRepair'] = breakDown['historySendToRepair'];
  //       row['historyReciveToRepair'] = breakDown['historyReciveToRepair'];
  //       row['histroyDeliveryTruck'] = breakDown['histroyDeliveryTruck'];
  //       row['historyDeliveryDriver'] = breakDown['historyDeliveryDriver'];
  //       row['piece'] = breakDown['piece'];
  //       row['piecesReplacementHistory'] = carPiecesHistory;
  //       row['answers'] = await this.getBreakDownItemsById(
  //         breakDown['truckBreakDownItemsId'],
  //       );

  //       data.push(row);
  //     }
  //   }

  //   return {
  //     status: 200,
  //     data: countList === 0 || countList ? countList : data,
  //     count: breakDowns.count,
  //   };
  // }


  async logisticUserGetAll(
    logisticComment: string,
    repairDone: string,
    reciveToRepair: string,
    count: string,
    beforeHistory: string,
    afterHistory: string,
    carNumber: string,
    company: string,
    zone: string,
  ) {
    console.log(company);
    
    let filter = {}; // filter by "date" or "carNumber"
    let data = [];
    let countList: number;
    let breakDowns: {
      rows: TruckBreakDown[];
      count: number;
    };
    let usersIdInSameZone = [];
    let usersIdInCompany = [];
    let usersIdFilter = [];

      if (!afterHistory) {
        afterHistory = '2400/0/0';
      }
      if (!beforeHistory) {
        beforeHistory = '2023/0/0';
      }
      if (repairDone == undefined) {
        filter['historyDriverRegister'] = {
          [Op.between]: [`${beforeHistory}`, `${afterHistory}`],
        };
      } 
        filter['historyDeliveryDriver'] = {
          [Op.gte]: [beforeHistory],
          [Op.lte]:[afterHistory]
      }
    if (carNumber) {
      filter['carNumber'] = carNumber;
    }
     console.log(zone,'is zone');
     
     const [driversInZone, filterUserByCompany] = await Promise.all([
      this.getUsersSameZone(zone, 'companyDriver', company),
      company ? this.getUserIdListByCompanyName(company) : []
  ])
    if (company) {
      const filterUserByCompany =
        await this.getUserIdListByCompanyName(company);
      
    //   for(let item of filterUserByCompany){
    //     usersIdInCompany.push(item.dataValues.id);
    // };
      
    } 
     usersIdInSameZone = driversInZone.map(driver => driver.dataValues.id);
     usersIdInCompany = filterUserByCompany.map(item => item.dataValues.id);

    //  const userFilter = company ? 
    //         usersIdInCompany : 
    //         usersIdInSameZone

    // Get list of "Activity in Progress"
    
    if (logisticComment === 'true') {
      console.log(beforeHistory,usersIdInSameZone);
      
      
      breakDowns = await this.truckBreakDownRepository.findAndCountAll({
        where: {
          [Op.and]: {
            status: { [Op.eq]: 'opened' },
            logisticConfirm: { [Op.eq]: true },
            historyReciveToRepair: { [Op.eq]: null },
            driverId: { [Op.in]: usersIdInSameZone },
            historyDriverRegister:{
              [Op.and]:{
               [Op.gte]:[beforeHistory],
               [Op.lte]:[afterHistory]
              }
            }
          },
        },
        order: [['id', 'DESC']],
        limit: 20,
      });
      console.log(breakDowns);
      
    } else if (repairDone === 'true') {
      breakDowns = await this.truckBreakDownRepository.findAndCountAll({
        where: {
          [Op.and]: {
            logisticConfirm: { [Op.ne]: false },
            transportComment: { [Op.in]: ['necessary', 'immediately'] },
            historyDeliveryDriver: { [Op.ne]: null },
            driverId: { [Op.in]: usersIdFilter },
            ...filter,
          },
        },
        order: [['id', 'DESC']],
        limit: 20,
      });
      for (let item of breakDowns.rows) {
        if (item.logisticConfirm === false) {
          // await this.truckBreakDownRepository.update(
          //   { status: 'closed' },
          //   { where: { id: item.id } },
          // );
        }
      }
    } else {
      console.log('out');
      
      breakDowns = await this.truckBreakDownRepository.findAndCountAll({
        where: {
          [Op.and]: {
            logisticConfirm: { [Op.eq]: false },
            // status : { [Op.eq] : 'opened'} ,
            driverId: { [Op.in]: usersIdInCompany },
          },
        },
        order: [['id', 'DESC']],
        limit: 20,
      });
 
    }

    if (count === 'true') {
      countList = breakDowns.count;
    } else {
       data = await Promise.all(breakDowns.rows.map(async (item) => {
        const [carPiecesHistory, driverDetails, answers] = await Promise.all([
            this.getCarPiecesHistory(item.carNumber),
            this.authService.getById(item.driverId).catch(error => {
                console.error(`خطا در دریافت اطلاعات راننده برای ID: ${item.driverId}`, error);
                return null;
            }),
            this.getBreakDownItemsById(item.truckBreakDownItemsId)
        ]);
    
        return {
            id: item.id,
            numberOfBreakDown: item.numberOfBreakDown,
            hours: item.hoursDriverRegister,
            history: item.historyDriverRegister,
            driverName: item.driverName,
            driverMobile: item.driverMobile,
            carNumber: item.carNumber,
            kilometer: item.carLife,
            logisticConfirm: item.logisticConfirm,
            transportComment: item.transportComment,
            historySendToRepair: item.historySendToRepair,
            historyReciveToRepair: item.historyReciveToRepair,
            histroyDeliveryTruck: item.histroyDeliveryTruck,
            historyDeliveryDriver: item.historyDeliveryDriver,
            piece: item.piece,
            piecesReplacementHistory: carPiecesHistory,
            answers,
            personelCode: driverDetails ? driverDetails.personelCode : null,
            zone: driverDetails ? driverDetails.zone : null,
            company: driverDetails ? driverDetails.company : null,
        };
    }));
    }

    return {
      status: 200,
      data: countList === 0 || countList ? countList : data,
      count: breakDowns.count,
    };
  }


  async exportReportLogisticAdmin(
    logisticComment: string,
    repairDone: string,
    reciveToRepair: string,
    count: string,
    beforeHistory: string,
    afterHistory: string,
    carNumber: string,
    company: string,
    zone: string,
  ) {
    try {
      const book = new Workbook();
      const workSheet = book.addWorksheet('LogisticAdmin_report');

      let rows: Array<any> = [];

      const truckBreakDowns = await this.logisticUserGetAll(
        logisticComment,
        repairDone,
        reciveToRepair,
        count,
        beforeHistory,
        afterHistory,
        carNumber,
        company,
        zone,
      );

      // console.log('truckBreakDowns', truckBreakDowns.data); // #DEBUG
      workSheet.columns =
        COLUMNS_NAME_EXCEL_REPORT_TRANSPORT_AND_LOGISTIC_ADMIN;
      if (typeof truckBreakDowns.data == 'object') {
        rows.push(...truckBreakDowns.data);

        const data = generateDataExcel(
          FIELDS_OF_EXCEL_REPORT_TRANSPORT_AND_LOGISTIC_ADMIN,
          rows,
        );

        data.forEach((x) => {
          workSheet.addRow(Object.values(x));
        });
      } else {
        workSheet.addRow('not have data');
      }

      const buffer = await book.xlsx.writeBuffer();
      return buffer;
    } catch (err) {
      console.log(err);
    }
  }

  async repairShopGetAll(
    transportComment: string,
    historySendToRepair: string,
    deliveryDriver: string,
    count: string,
    beforeHistory: string,
    afterHistory: string,
    carNumber: string,
    company: string,
  ) {
    let final={}
    let findTruckBreakDownItem;
    let breaks=[];
    let response=[];
    let filter = {}; // filter by "date" or "carNumber"
    let data =[];
    const usersIdInCompany = [];
    let countList: number;
    let breakDowns;
        if (beforeHistory || afterHistory) {
      if (!afterHistory) {
        afterHistory = '2400/0/0';
      }
      if (!beforeHistory) {
        beforeHistory = '2023/0/0';
      }
      filter['historyDriverRegister'] = {
        [Op.between]: [`${beforeHistory}`, `${afterHistory}`],
      };
    }
    if (carNumber) {
      filter['carNumber'] = carNumber;
    }

    if (company) {
      const usersInCompany = await this.getUserIdListByCompanyName(company);
      usersInCompany.forEach((driver) => {
        usersIdInCompany.push(driver.dataValues['id']);
      });
      filter['driverId'] = { [Op.in]: usersIdInCompany };
    }

    // get list of  "Delivery to repair"
    if (transportComment === 'true') {
      breakDowns = await this.truckBreakDownRepository.findAndCountAll({
        where: {
          [Op.and]: {
            transportComment: { [Op.in]: ['necessary', 'immediately'] },
            // logisticComment: { [Op.ne]: null },
            historyReciveToRepair: { [Op.eq]: null },
            repairmanComment: { [Op.eq]: null },
            // piece: { [Op.eq]: null },
            status: { [Op.eq]: 'opened' },
            logisticConfirm: { [Op.ne]: false },
            ...filter,
          },
        },
        include:[TruckBreakDownItems],
        order: [['id', 'DESC']],
        limit: 20,
      });
      return{
        data:breakDowns.rows,
        count:breakDowns.count,
        status:200
      }
  
    } else if (historySendToRepair === 'true') {
      breakDowns = await this.truckBreakDownRepository.findAndCountAll({
        where: {
          [Op.and]: {
            transportComment: { [Op.in]: ['necessary', 'immediately'] },
            logisticComment: { [Op.ne]: null },
            historySendToRepair: { [Op.ne]: null },
            // repairmanComment: { [Op.eq]: null },
            // piece: { [Op.eq]: null },
            // status: {[Op.eq] : 'opened' } ,
            logisticConfirm: { [Op.ne]: false },
            ...filter,
          },
        },
        include:[TruckBreakDownItems],
        order: [['id', 'DESC']],
        limit: 20,
      });
      return{
        data:breakDowns,
        count:breakDowns.count,
        status:200
      }

    }
    // get list of "Delivery to Driver"
    else if (deliveryDriver === 'true') {
      breakDowns = await this.truckBreakDownRepository.findAndCountAll({
        where: {
          [Op.and]: {
            transportComment: { [Op.in]: ['necessary', 'immediately'] },
            historyReciveToRepair: { [Op.ne]: null },
            logisticConfirm: { [Op.ne]: false },
            // repairmanComment: { [Op.eq]: null },
            historyDeliveryDriver: { [Op.ne]: null },
            status: {[Op.eq] : 'opened' } ,
            ...filter,
          },
        },
        include:[TruckBreakDownItems],
        order: [['id', 'DESC']],
        limit: 20,
      });
      // breaks.push(breakDowns)
      console.log(breakDowns);
      return{
        data:breakDowns,
        count:breakDowns.count,
        status:200
      }
      
      // for(let item of breakDowns.rows){
      //   if(item.truckBreakDownItemsId!=null){
      //     console.log(item.truckBreakDownItemsId);
          
      //      findTruckBreakDownItem=await this.truckBreakDownItemsRepository.findOne({
      //       where:{id:item.dataValues.truckBreakDownItemsId}
      //     })
      //   response.push(findTruckBreakDownItem)
      //   }


      // }
      
    
  
    }
    if (count === 'true') {
      countList = breakDowns.count;
      for(let item of breakDowns.rows){
        if(item.truckBreakDownItemsId!=null){
          console.log(item.truckBreakDownItemsId);
          
           findTruckBreakDownItem=await this.truckBreakDownItemsRepository.findOne({
            where:{id:item.dataValues.truckBreakDownItemsId}
          })
        response.push(findTruckBreakDownItem)
        }


      }
      
      breaks.push(breakDowns)
  
    } else {
        breakDowns = await this.truckBreakDownRepository.findAndCountAll({
          where: {
            [Op.and]: {
              // transportComment: { [Op.in]: ['necessary', 'immediately'] },
              // logisticComment: { [Op.ne]: null },
              historyReciveToRepair: { [Op.eq]: null },
              repairmanComment: { [Op.eq]: null },
              // piece: { [Op.eq]: null },
              status: { [Op.eq]: 'opened' },
              logisticConfirm: { [Op.ne]: 0 },
            },
          },
          include:[TruckBreakDownItems],
          order: [['id', 'DESC']],
          limit: 20,
        });
    
        return{
          data:breakDowns,
          count:breakDowns.count,
          status:200
        }
        
    }
    // for(let item of breakDowns.rows){
    //   const carPiecesHistory = await this.getCarPiecesHistory(
    //     item['carNumber'],
    //   );

    //   breaks['id'] = breakDowns['id'];
    //   breaks['numberOfBreakDown'] = breakDowns['numberOfBreakDown'];
    //   breaks['hours'] = breakDowns['hoursDriverRegister'];
    //   breaks['history'] = breakDowns['historyDriverRegister'];
    //   breaks['driverName'] = breakDowns['driverName'];
    //   breaks['driverMobile'] = breakDowns['driverMobile'];
    //   breaks['carNumber'] = breakDowns['carNumber'];
    //   breaks['kilometer'] = breakDowns['carLife']; // carLife set value when driver register daily check list
    //   breaks['transportComment'] = breakDowns['transportComment'];
    //   breaks['logisticConfirm'] = breakDowns['logisticConfirm'];
    //   breaks['repairmanComment'] = breakDowns['repairmanComment'];
    //   breaks['historySendToRepair'] = breakDowns['historySendToRepair'];
    //   breaks['historyReciveToRepair'] = breakDowns['historyReciveToRepair'];
    //   breaks['histroyDeliveryTruck'] = breakDowns['histroyDeliveryTruck'];
    //   breaks['historyDeliveryDriver'] = breakDowns['historyDeliveryDriver'];
    //   breaks['piece'] = breakDowns['piece'];
    //   // breaks['piecesReplacementHistory'] = carPiecesHistory;

    //   // console.log('itemsId to fetch: ', breakDown['truckBreakDownItemsId']); // #Debug
    //   // item['answers'] = await this.getBreakDownItemsById(
    //   //   breakDowns['truckBreakDownItemsId'],
    //   // );
    //   // breaks['carType'] = breakDowns['type']; // depricated
    //   // breaks['checkListStatus'] = breakDowns['state']; // depricated
    //   // breaks['breakDownStatus'] = breakDowns['repairComment']; // depricated
    //   // breaks['breakdownItems']=breaks
    // // for(let item of breakDowns.rows){
    // //   for(let items;items<breakDowns.count;i++){
    // //     data=[item]
    // //   }
    // // }
  }


  // async get(id: number) {
  //   let data = {};

  //   let arrAns = [];
  //   const breakDown = await this.truckBreakDownRepository.findOne({
  //     where: {
  //       id: id,
  //     },
  //   });
  //   const status = {
  //     logisticConfirm: !!breakDown?.isLogisticConfirmed,
  //     transportComment: !!breakDown?.isTransportCommentValid,
  //     repairComment: !!breakDown?.historyRepairComment,
  //     deliveryDriver: !!breakDown?.historyDeliveryDriver,
  //   };

  //   // create report for each breakdwon
  //   const res = await this.truckBreakDownItemsRepository.findOne({
  //     where: {
  //       id: breakDown.truckBreakDownItemsId,
  //     },
  //   });
  //   const truckInfo = await this.truckInfoRepository.findOne({
  //     where: { driverId: breakDown.dataValues.driverId },
  //   });
  //   // console.log(Object.entries(truckInfo)); // #DEBUG
  //   data = breakDown.dataValues;
  //   data['dateDriver'] = breakDown.dataValues.historyDriverRegister;
  //   data['hoursDriver'] = breakDown.dataValues.hoursDriverRegister;
  //   data['driverName'] = breakDown.dataValues.driverName;
  //   data['carNumber'] = truckInfo.carNumber;
  //   data['carLife'] = truckInfo.lastCarLife;
  //   const answers = Object.entries(res.dataValues);
  //   for (let answer of answers) {
  //     let ans = {};

  //     let indx = answers.indexOf(answer);

  //     if (answer[0].includes('type_') && answer[1] != null) {
  //       ans['comment'] = answers[indx - 1][1];
  //       ans['type'] = answer[1];
  //       ans['number'] =Math.floor(indx / 2);
  //       arrAns.push(ans);
  //     }
  //   }
  //   data['answers'] = arrAns;
  //   data['status'] = status
  //   //   console.log(data);
  //   return {
  //     status: 200,
  //     data: data,
  //   };
  // }
  async get(id: number) {
    let data = {};
    let finalResult = [];

    let arrAns = [];
    const breakDowns = await this.truckBreakDownRepository.findAll({
      where: {
        id: id,
      },
    });
    
    for (let item of breakDowns) {

      const status = {
        logisticConfirm: !!item?.isLogisticConfirmed,
        transportComment: !!item?.isTransportCommentValid,
        repairComment: !!item?.historyRepairComment,
        deliveryDriver: !!item?.historyDeliveryDriver,
      };
      const res = await this.truckBreakDownItemsRepository.findOne({
        where: {
          id: item.truckBreakDownItemsId,
        },
      });
     

      const truckInfo = await this.truckInfoRepository.findOne({
        where: { driverId: item.driverId },
      });
      

      data = item.dataValues;
      data['dateDriver'] = item.historyDriverRegister;
      data['hoursDriver'] = item.hoursDriverRegister;
      data['driverName'] = item.driverName;
      data['carNumber'] = truckInfo.carNumber;
      data['carLife'] = truckInfo.lastCarLife;

      const answers = Object.entries(res.dataValues);


      for (let i = 0; i < answers.length; i++) {
        const [key, value] = answers[i];

        if (key.includes('type_') && value != null) {
          const ans: any = {};
          ans['type'] = value;
          ans['comment'] = answers[i - 1]?.[1] || null;

          ans['number'] = parseInt(key.split('_')[1], 10);
          arrAns.push(ans);
        }
      }

      data['answers'] = arrAns;
      data['status'] = status;
      finalResult.push(data)
      console.log(data);
      
    }



    return {
      status: 200,
      data: finalResult,
    };
  }


  // async getByDriverId(driverId: any) {
  //   let data = [];

  //   const item = await this.truckBreakDownRepository.findAndCountAll({
  //     where: {
  //       driverId: driverId,
  //     },
  //     order: [
  //       ['updatedAt', 'DESC'],
  //       ['id', 'DESC'],
  //     ],
  //     limit: 20,
  //   });
  //   // create report for each breakdwon
  //   for (let item of breakDown.rows) {
  //     let report = {};
  //     const res = await this.truckBreakDownItemsRepository.findOne({
  //       where: {
  //         id: item.truckBreakDownItemsId,
  //       },
  //     });
  //     const items = res.dataValues;
  //     // console.log(items);
  //     report = item.dataValues;
  //     // handle notify
  //     if (item.lastFetch < item.updatedAt) report['notify'] = 1;
  //     else report['notify'] = 0;
  //     // due to keys of field have unique number , answer_1, answer_2, ..., answe_20
  //     for (let item = 1; item <= 34; item++) {
  //       // console.log(items[`answer_${item}`]);
  //       if (items[`answer_${item}`] != null) {
  //         report['type'] = items[`type_${item}`];
  //         report['comment'] = items[`answer_${item}`];
  //         report['number'] = item;
  //         data.push(report);
  //         // comment: break aim just return one of item's
  //         break;
  //       }
  //     }
  //   }
  //   // update last fetch aim alert to driver in frontEnd when repairman new answer

  //   // console.log(new Date().toISOString());
  //   await this.truckBreakDownRepository.update(
  //     {
  //       lastFetch: new Date().toISOString(),
  //       notifyTransportComment: false,
  //       notifyRepairmanComment: false,
  //     },
  //     {
  //       where: {
  //         driverId: driverId,
  //         transportComment: { [Op.ne]: null },
  //       },
  //     },
  //   );
  //   return {
  //     status: 200,
  //     data: data,
  //     count: data.length,
  //   };
  // }

  async getByDriverId(driverId: any, before: string, after: string) {
    const data = [];
    let parts = String(after).split("/");
    let year = parts[0];
    let month = parts[1];
    let day = parseInt(parts[2], 10) + 1; 
    let result;
    const truckInfo = await this.truckInfoRepository.findOne({where : {driverId}})
    if(after && before){
      result = await this.truckBreakDownRepository.findAndCountAll({
        where: {
          carNumber: truckInfo.carNumber,
          historyDriverRegister: {
            [Op.gte]: [before],
            [Op.lte]:[after],
            [Op.not]:null
          },
        },
        order: [
          ['updatedAt', 'DESC'],
          ['id', 'DESC'],
        ],
        limit: 20,
      });
    }else{
      result = await this.truckBreakDownRepository.findAndCountAll({
        where: {
          carNumber: truckInfo.carNumber
        },
        order: [
          ['updatedAt', 'DESC'],
          ['id', 'DESC'],
        ],
        limit: 20,
      });
    }
     
    for (let item of result.rows) {
      console.log(2);

      const res = await this.truckBreakDownItemsRepository.findOne({
        where: {
          id: item.dataValues.truckBreakDownItemsId,
        },
      });
      console.log(res);


      if (res) {

        const items = res.dataValues;

        const report = { ...item.dataValues };

        report['notify'] = item.lastFetch < item.updatedAt ? 1 : 0;

        if (item.historySendToRepair === null) {
          report['carLife'] = item.carLife;
        }

        for (let i = 1; i <= 34; i++) {
          const answer = items[`answer_${i}`];
          if (answer != null) {
            report['type'] = items[`type_${i}`];
            report['comment'] = answer;
            report['number'] = i;
            break;
          }
        }

        data.push(report);


        await this.truckBreakDownRepository.update(
          {
            lastFetch: new Date().toISOString(),
            notifyTransportComment: false,
            notifyRepairmanComment: false,
          },
          {
            where: {
              driverId: driverId,
              transportComment: { [Op.ne]: null },
            },
          },
        );
      }
    }
    return {
      status: 200,
      data: data
    }
  }




  async getCarPiecesHistory(carNumber: string) {
    try {
      return await this.truckBreakDownRepository.findAll({
        attributes: ['piece', 'carLife', 'transportCommentHistory'],
        where: {
          // logisticConfirm: { [Op.ne]: false },
          // transportComment: { [Op.in]: ['necessary', 'immediately'] },
          // historyDeliveryDriver: { [Op.ne]: null },
          carNumber: carNumber,
        },
        order: [['id', 'DESC']],
        // limit: 20,
      });
      // return {
      //   status: 200,
      //   data: breakDownListByCarNumber,
      //   count: breakDownListByCarNumber.length,
      // };
    } catch (err) {
      console.log(err);
      throw new HttpException(
        'wrong on server ...',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async driverNotifyReplay(driverId: number) {
    let countNotify = 0;

    const res = await this.truckBreakDownRepository.findAll({
      where: {
        driverId: driverId,
        driverDeliveryConfirm: false,  
        lastFetch: { [Op.or]: [{ [Op.lte]: null }, { [Op.lt]: new Date() }] },  
      },
    });
  
    for (let i of res) {
      if (i.lastFetch < i.updatedAt) {
        if (i.notifyTransportComment) countNotify++; 
        if (i.notifyRepairmanComment) countNotify++;  
      }
    }
  
    return { data: countNotify };
  }
  

  async replayTransportAdmin(driverId: any) {
    const res = await this.truckBreakDownRepository.count({
      where: {
        driverId: driverId,
        transportComment: { [Op.ne]: null },
      },
    });
    return {
      status: 200,
      data: res,
    };
  }
  // comment: better solution impelement in "truckBreakDownItems" service and inject this here
  async getBreakDownItemsById(id: number) {
    let data = [];

    const res = await this.truckBreakDownItemsRepository.findOne({
      where: {
        id: id,
      },
    });
    const items = res.dataValues;
    // console.log('items fetch: ', items);

    // due to keys of field have unique number , answer_1, answer_2, ..., answe_20
    for (let item = 1; item <= 34; item++) {
      let report = {};
      //  console.log(items[`answer_${item}`]); // #Debug
      if (items[`answer_${item}`] != null) {
        report['type'] = items[`type_${item}`];
        report['comment'] = items[`answer_${item}`];
        report['number'] = item;
        // console.log('reoprt: ', report); // #Debug
        data.push(report);
      }
    }

    return data;
  }

  async update(id: number, body: UpdateTruckBreakDownDto) {
    const notify = {};
    if (body.transportComment) {
      if(body.transportComment === 'notNecessary') {
        const breakDown = await this.truckBreakDownRepository.findOne({where : {id}})
        breakDown.status = 'closed'
        await breakDown.save()
      }
      notify['notifyTransportComment'] = true;
      body.transportCommentHistory = this.getTime(new Date());
    }
    if (body.repairmanComment) {
      if(body.repairmanComment === 'notNecessary') {
        const breakDown = await this.truckBreakDownRepository.findOne({where : {id}})
        breakDown.status = 'closed'
        await breakDown.save()
      }
      notify['notifyRepairmanComment'] = true;
    }
    
    if(body.logisticConfirm == true || body.logisticConfirm == false){
      if(body.logisticConfirm == false) {
        const breakDown = await this.truckBreakDownRepository.findOne({where : {id}})
        breakDown.status = 'closed'
        await breakDown.save()
      }
      body.historyLogisticComment = this.getTime(new Date());
    }

    const res = await this.truckBreakDownRepository.update( body, {
        where: { id: id },
      },
    );
     console.log(res);
     
    if (res[0] > 0) {
      return {
        status: 200,
        message: 'update successfully',
      };
    } else {
      return {
        status: 500,
        message: 'update failed',
      };
    }

  }

  async delete(id: number) {
    let message: string;
    let status: number;
    const breakDown = await this.truckBreakDownRepository.findOne({where : {id}})
    if(!breakDown) {
      status = 404 
      message = "breakdown not found"
    }
    if(breakDown.logisticConfirm == false && breakDown.status == 'opened'){
      await this.truckBreakDownRepository.destroy({where : {id: id}})
      await this.truckBreakDownItemsRepository.destroy({where : {id: id}})

      status = 200 
      message = "deleted successfuly"
    }
    status = 201 
    message = "شما دیگر مجاز به پاک کردن خرابی نیستید"
    // if (deleteBreakDown && deleteItems) {
    //   message = `delete breakDown id = ${id} successfully`;
    //   status = 200;
    // } else {
    //   message = `delete item id = ${id} failed`;
    //   status = 400;
    // }

    return {
      status: status,
      message: message,
    };
  }


  async deleteAll() {
    let message: string;
    let status: number;
    const deleteBreakDown = await this.truckBreakDownRepository.destroy({
      where: {},
    });
    const deleteItems = await this.truckBreakDownItemsRepository.destroy({
      where: {},
    });
    if (deleteBreakDown && deleteItems) {
      message = `delete breakDowns successfully`;
      status = 200;
    } else {
      message = `delete items failed`;
      status = 400;
    }

    return {
      status: status,
      message: message,
    };
  }


  async getUsersSameZone(
    zone: string,
    role: string,
    company:string
  ) {
    return await this.authService.userSameZones(zone, role,company);
  }

  async getUserIdListByCompanyName(companyName: string) {
    return await this.authService.getUsersByCompanyName(companyName);
  }
  // it is copy from "order.service"
  getTime(idealDate?: Date) {
    const date = idealDate ? idealDate : new Date();
    console.log('date in getTime: ', date);
    const time = date.getFullYear();
    // sample format of date: "2022/2/22"
    // in first month of year return "0", therfor check and set "1" if "0"
    // const month = date.getMonth() ? date.getMonth() : 1;
    const month = date.getMonth() + 1; // TODO: check
    const day = date.getDate();
    return `${time}/${month}/${day}`;
  }

  async getAllPieces() {
    try {
      const pieces = await this.truckBreakDownRepository.findAll({
        attributes: ['piece'],
      });
      if (!pieces) {
        return {
          status: 200,
          data: [],
          message: "قطعه ای یافت نشد"
        }
      }
      return {
        status: 200,
        data: pieces,
        message: "قطعه ها یا موفقیت یافت شدند"
      }
    } catch (error) {
      console.log(error);
    }
  }
  async setStatusForDriverDeliveryByDriver(breakdownId: number) {
    const breakDown = await this.truckBreakDownRepository.findOne({ where: { id: breakdownId } })
    if (!breakDown) {
      return {
        status: 200,
        data: [],
        message: "خرابی یافت نشد"
      }
    }
    breakDown.driverDeliveryConfirm = true

    await breakDown.save()

    return {
      status: 201,
      data: true,
      message: "تغییر با موفقیت ثبت شد"
    }
  }
}
