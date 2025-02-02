import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CheckList } from './check-list.entity';
import { CheckListComment } from 'src/check-list-comment/check-list-comment.entity';
import { TruckInfo } from 'src/truck-info/truck-info.entity';
import { Op, json } from 'sequelize';
import Holidays from 'date-holidays';
import moment from 'moment';
import {
  CHECKLIST_ANSWERS,
  FIELDS_OF_EXCEL_CHECKLIST_DONE,
  FIELDS_OF_EXCEL_CHECKLIST_UNDONE,
  ROLES,
} from 'src/static/enum';
import { Auth } from 'src/auth/auth.entity';
import { Workbook } from 'exceljs';
import {
  COLUMNS_NAME_EXCEL_REPORT_CHECKLIST_DONE,
  COLUMNS_NAME_EXCEL_REPORT_CHECKLIST_UNDONE,
} from 'src/static/fields-excelFile';
import { generateDataExcel } from 'src/utility/export_excel';
import { AuthService } from 'src/auth/services/auth.service';
import { TruckBreakDown } from 'src/truck-break-down/truck-break-down.entity';
import { KilometerService } from 'src/kilometer/kilometer.service';
import { KilometerDetailsService } from 'src/driver-kilometer-details/kilometer-details.service';

type Holiday = {
  date: string;
  start: Date;
  end: Date;
  name: string;
  type: string;
  note?: string;
};
@Injectable()
export class CheckListService {
  constructor(
    @Inject('CHECKLIST_REPOSITORY')
    private readonly checkListRepository: typeof CheckList,
    @Inject('CHECKLISTCOMMENT_REPOSITORY')
    private readonly checkListCommentRepository: typeof CheckListComment,
    @Inject('TRUCKINFO_REPOSITORY')
    private readonly truckInfoRepository: typeof TruckInfo,
    @Inject('AUTH_REPOSITORY')
    private readonly authRepository: typeof Auth,
    @Inject('TRUCKBREAKDOWN_REPOSITORY')
    private readonly truckBreakDownRepository: typeof TruckBreakDown,

    private readonly authService: AuthService,
    private readonly kilometerService: KilometerService,
    private readonly kilometerDetailsService: KilometerDetailsService,
  ) { }
  //   async insertCheckList(body: Object) {
  //     const checkList = {};
  //     const checkListComment = {};
  //     const answers: [] = body['answers'];

  //     checkList['userId'] = body['id'];
  //     checkList['name'] = body['name'];
  //     checkList['hours'] = body['hours'];
  //     checkList['history'] = body['date'];

  //     const today = new Date();
  //     today.setHours(0, 0, 0, 0);

  //     const todayCheckList = await this.checkListRepository.findOne({
  //         where: {
  //             userId: body['id'],
  //             createdAt: {
  //                 [Op.gte]: today,
  //             },
  //             isDeleted: false,
  //         },
  //     });

  //     if (todayCheckList) {
  //         return {
  //           status : 200 ,
  //           data : [] ,
  //           message : 'شما قبلاً چک‌لیست امروز را ثبت کرده‌اید'
  //         }
  //       }

  //       const lastCheckList = await this.checkListRepository.findOne({
  //         where: { userId: body['id'] },
  //         order: [['createdAt', 'DESC']],
  //       });

  //       if (
  //         lastCheckList &&
  //         !lastCheckList.isDeleted && 
  //         body['answers'].find(a => a.number === 0)?.question <= lastCheckList.answer_0 
  //       ) {
  //         return {
  //           status: 200,
  //           data: [],
  //           message: 'مقدار کیلومتر جاری نمی‌تواند کمتر یا مساوی مقدار آخرین رکورد باشد'
  //         };
  //       }

  //       for (let item of answers) {
  //           checkList['answer_' + item['number']] = item['question'];
  //           if (item['comment']) {
  //               checkListComment['comment_' + item['number']] = item['comment'];
  //           }
  //       }

  //     const insertCheckList = await this.checkListRepository.create<CheckList>(checkList);

  //     if (Object.entries(checkListComment).length !== 0) {
  //         checkListComment['checkListId'] = insertCheckList.id;
  //         await this.checkListCommentRepository.create<CheckListComment>(checkListComment);
  //     }

  //     const truckInfo = await this.truckInfoRepository.findOne({
  //         where: { driverId: checkList['userId'] },
  //     });

  //     const lastCarLifeBackup = truckInfo?.lastCarLife || checkList['answer_0'];

  //     await this.truckInfoRepository.upsert({
  //         lastCarLife: checkList['answer_0'],
  //         lastCarLifeBackup: lastCarLifeBackup,
  //         driverId: checkList['userId'],
  //         state: this.lowestValueCheckList(Object.values(checkList)),
  //     });

  //     return {
  //         status: 201,
  //         message: 'چک‌لیست با موفقیت ثبت شد',
  //     };
  // }


  // async insertCheckList(body: Object) {
  //   const checkList = {};
  //   const checkListComment = {};
  //   const answers: [] = body['answers'];

  //   checkList['userId'] = body['id'];
  //   checkList['name'] = body['name'];
  //   checkList['hours'] = body['hours'];
  //   checkList['history'] = body['date'];

  //   const today = new Date();
  //   today.setHours(0, 0, 0, 0);

  //   // بررسی چک‌لیست امروز
  //   const todayCheckList = await this.checkListRepository.findOne({
  //       where: {
  //           userId: body['id'],
  //           createdAt: {
  //               [Op.gte]: today,
  //           },
  //           isDeleted: false,
  //       },
  //   });

  //   // if (todayCheckList) {
  //   //     return {
  //   //         status: 200,
  //   //         data: [],
  //   //         message: 'شما قبلاً چک‌لیست امروز را ثبت کرده‌اید',
  //   //     };
  //   // }

  //   // یافتن آخرین چک‌لیست
  //   const lastCheckList = await this.checkListRepository.findOne({
  //       where: { userId: body['id'] },
  //       order: [['createdAt', 'DESC']],
  //   });

  //   // بررسی مقدار کیلومتر جاری با مقدار آخرین چک‌لیست
  //   const currentAnswer0 = body['answers'].find((a) => a.number === 0)?.question;
  //   if (
  //       lastCheckList &&
  //       !lastCheckList.isDeleted &&
  //       (currentAnswer0 <= lastCheckList.answer_0 || currentAnswer0 - lastCheckList.answer_0 < 50000)
  //   ) {
  //       return {
  //           status: 200,
  //           data: [],
  //           message: 'مقدار کیلومتر جاری باید حداقل ۵۰,۰۰۰ واحد بیشتر از مقدار آخرین رکورد باشد',
  //       };
  //   }

  //   // افزودن پاسخ‌ها و توضیحات
  //   for (let item of answers) {
  //       checkList['answer_' + item['number']] = item['question'];
  //       if (item['comment']) {
  //           checkListComment['comment_' + item['number']] = item['comment'];
  //       }
  //   }

  //   // ثبت چک‌لیست
  //   const insertCheckList = await this.checkListRepository.create<CheckList>(checkList);

  //   // ثبت توضیحات (در صورت وجود)
  //   if (Object.entries(checkListComment).length !== 0) {
  //       checkListComment['checkListId'] = insertCheckList.id;
  //       await this.checkListCommentRepository.create<CheckListComment>(checkListComment);
  //   }

  //   // به‌روزرسانی جدول truckInfo
  //   const truckInfo = await this.truckInfoRepository.findOne({
  //       where: { driverId: checkList['userId'] },
  //   });

  //   console.log(currentAnswer0);

  //   if (truckInfo) {
  //       await this.truckInfoRepository.update(
  //           {
  //             lastCarLife: currentAnswer0, // به‌روزرسانی مقدار کیلومتر
  //           },
  //           { where: { driverId: checkList['userId'] } }
  //       );         
  //   }

  //   return {
  //       status: 201,
  //       message: 'چک‌لیست با موفقیت ثبت شد',
  //   };
  // }

  async checkTodayChecklist(userId: number , truckId: number) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // بررسی چک‌لیست امروز
    const todayCheckList = await this.checkListRepository.findOne({
      where: {
        userId,
        truckId,
        createdAt: {
          [Op.gte]: today,
        },
        isDeleted: false,
      },
    });
    console.log(todayCheckList);

    if (todayCheckList) {
      return {
        status: 200,
        data: [],
        message: 'شما قبلاً چک‌لیست امروز را ثبت کرده‌اید',
      };
    }

    return {
      status: 201,
      date: true,
      message: "مجاز برای ثبت چک لیست"
    }
  }

  // async insertCheckList(body: Object) {
  //   const checkList = {};
  //   const checkListComment = {};
  //   const answers: [] = body['answers'];

  //   checkList['userId'] = body['id'];
  //   checkList['name'] = body['name'];
  //   checkList['hours'] = body['hours'];
  //   checkList['history'] = body['date'];

  //   const today = new Date();
  //   today.setHours(0, 0, 0, 0);

  //   // بررسی چک‌لیست امروز
  //   const todayCheckList = await this.checkListRepository.findOne({
  //       where: {
  //           userId: body['id'],
  //           createdAt: {
  //               [Op.gte]: today,
  //           },
  //           isDeleted: false,
  //       },
  //   });

  //   // if (todayCheckList) {
  //   //     return {
  //   //         status: 200,
  //   //         data: [],
  //   //         message: 'شما قبلاً چک‌لیست امروز را ثبت کرده‌اید',
  //   //     };
  //   // }

  //   // یافتن آخرین چک‌لیست
  //   const lastCheckList = await this.checkListRepository.findOne({
  //       where: { userId: body['id'] },
  //       order: [['createdAt', 'DESC']],
  //   });

  //   // بررسی مقدار کیلومتر جاری با مقدار آخرین چک‌لیست
  //   const currentAnswer0 = body['answers'].find((a) => a.number === 0)?.question;
  //   if (
  //       lastCheckList &&
  //       !lastCheckList.isDeleted &&
  //       (currentAnswer0 <= lastCheckList.answer_0 || currentAnswer0 - lastCheckList.answer_0 < 50000)
  //   ) {
  //       return {
  //           status: 200,
  //           data: [],
  //           message: 'مقدار کیلومتر جاری باید حداقل ۵۰,۰۰۰ واحد بیشتر از مقدار آخرین رکورد باشد',
  //       };
  //   }

  //   // افزودن پاسخ‌ها و توضیحات
  //   for (let item of answers) {
  //       checkList['answer_' + item['number']] = item['question'];
  //       if (item['comment']) {
  //           checkListComment['comment_' + item['number']] = item['comment'];
  //       }
  //   }

  //   // ثبت چک‌لیست
  //   const insertCheckList = await this.checkListRepository.create<CheckList>(checkList);

  //   // ثبت توضیحات (در صورت وجود)
  //   if (Object.entries(checkListComment).length !== 0) {
  //       checkListComment['checkListId'] = insertCheckList.id;
  //       await this.checkListCommentRepository.create<CheckListComment>(checkListComment);
  //   }

  //   // به‌روزرسانی جدول truckInfo
  //   const truckInfo = await this.truckInfoRepository.findOne({
  //       where: { driverId: checkList['userId'] },
  //   });

  //   console.log(currentAnswer0);

  //   if (truckInfo) {
  //       await this.truckInfoRepository.update(
  //           {
  //             lastCarLife: currentAnswer0, // به‌روزرسانی مقدار کیلومتر
  //           },
  //           { where: { driverId: checkList['userId'] } }
  //       );         
  //   }

  //   return {
  //       status: 201,
  //       message: 'چک‌لیست با موفقیت ثبت شد',
  //   };
  // }




  // async insertCheckList(body: Object) {
  //   let diff: number = 0
  //   const checkList = {};
  //   const today = new Date();
  //   const formattedDate = `${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate()}`;
  //   let checkListComment = {};
  //   const answers: [] = body['answers'];
  //   let Holidaykilometer: number;
  //   checkList['userId'] = body['id'];
  //   checkList['truckId'] = body['truckId'];
  //   checkList['name'] = body['name'];
  //   checkList['hours'] = body['hours'];
  //   checkList['history'] = formattedDate
  //   const currentAnswer0 = body['answers'].find((a) => a.number === 0)?.question;
  //   const checkListCheck = await this.checkTodayChecklist(body['id'] , body['truckId']);
  //   if (checkListCheck.message == "مجاز برای ثبت چک لیست") {

  //     for (let item of answers) {
  //       checkList['answer_' + item['number']] = item['question'];
  //       if (item['comment']) {
  //         checkListComment['answer_' + item['number']] = item['comment'];
  //       }
  //     }

  //     const lastCheckLis = await this.checkListRepository.findOne({
  //       where: { userId: body['id'] , truckId : body['truckId'] },
  //       order: [['createdAt', 'DESC']],
  //     });
  //     const insertCheckList = await this.checkListRepository.create<CheckList>(checkList);
  //     if (lastCheckLis) {
  //       diff = currentAnswer0 - lastCheckLis.answer_0;
  //     }
  //     console.log(insertCheckList);


  //     if (Object.entries(checkListComment).length != 0) {
  //       console.log('imn');
  //       console.log(checkListComment);

  //       checkListComment['checkListId'] = insertCheckList.id;
  //       const Res = await this.checkListCommentRepository.create<CheckListComment>(checkListComment);
  //       console.log(Res);

  //     }

  //     const unresolvedBreakdowns = await this.truckBreakDownRepository.findAll({
  //       where: {
  //         driverId: body['id'],
  //         historySendToRepair: {
  //           [Op.not]: null,
  //         },
  //       },
  //     });


  //     if (unresolvedBreakdowns.length > 0) {
  //       for (const breakdown of unresolvedBreakdowns) {
  //         await this.truckBreakDownRepository.update(
  //           {
  //             carLife: currentAnswer0,
  //           },
  //           { where: { id: breakdown.id } }
  //         );
  //         console.log(breakdown);

  //       }
  //     }

  //     const truckInfo = await this.truckInfoRepository.findOne({
  //       where: { driverId: checkList['userId'] },
  //     });
  //     console.log(truckInfo);

  //     if (truckInfo) {
  //       await this.truckInfoRepository.update(
  //         { lastCarLife: checkList['answer_0'], lastCarLifeBackup: truckInfo?.lastCarLife || checkList['answer_0'] },
  //         { where: { driverId: checkList['userId'] } }
  //       );
  //     }

  //     return {
  //       status: 201,
  //       message: 'چک‌لیست با موفقیت ثبت شد',
  //     };
  //   } else {
  //     return {
  //       status: 200,
  //       message: 'مجاز برای ثبت چک لیست نیستید'
  //     }
  //   }
  // }

  async insertCheckList(body: Object) {
    let diff: number = 0;
    const checkList = {};
    const today = new Date();
    const formattedDate = `${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate()}`;
    let checkListComment = {};
    const answers: [] = body['answers'];
    checkList['userId'] = body['id'];
    checkList['truckId'] = body['truckId'];
    checkList['name'] = body['name'];
    checkList['hours'] = body['hours'];
    checkList['history'] = formattedDate;
    const currentAnswer0 = body['answers'].find((a) => a.number === 0)?.question;
  
    const truckInfo = await this.truckInfoRepository.findOne({
      where: { id: body['truckId'] },
    });
  
    if (!truckInfo) {
      return {
        status: 404,
        message: 'وسیله نقلیه‌ای با این مشخصات یافت نشد',
      };
    }
  
    const carNumber = truckInfo.carNumber;
  
    const checkListCheck = await this.checkTodayChecklist(body['id'], body['truckId']);
    if (checkListCheck.message == 'مجاز برای ثبت چک لیست') {
      for (let item of answers) {
        checkList['answer_' + item['number']] = item['question'];
        if (item['comment']) {
          checkListComment['answer_' + item['number']] = item['comment'];
        }
      }
  
      const lastCheckLis = await this.checkListRepository.findOne({
        where: { userId: body['id'], truckId: body['truckId'] },
        order: [['createdAt', 'DESC']],
      });
  
      const insertCheckList = await this.checkListRepository.create<CheckList>(checkList);
      if (lastCheckLis) {
        diff = currentAnswer0 - lastCheckLis.answer_0;
      }
  
      if (Object.entries(checkListComment).length != 0) {
        checkListComment['checkListId'] = insertCheckList.id;
        await this.checkListCommentRepository.create<CheckListComment>(checkListComment);
      }
  
      const unresolvedBreakdowns = await this.truckBreakDownRepository.findAll({
        where: {
          driverId: body['id'],
          historySendToRepair: {
            [Op.eq]: null,
          },
          carNumber: carNumber,
        },
      });
  
      if (unresolvedBreakdowns.length > 0) {
        for (const breakdown of unresolvedBreakdowns) {
          await this.truckBreakDownRepository.update(
            {
              carLife: currentAnswer0,
            },
            { where: { id: breakdown.id } }
          );
        }
      }

      await this.kilometerDetailsService.create(body['truckId'] ,  body['id'] , checkList['answer_0'] )
  
      if (truckInfo) {
        await this.truckInfoRepository.update(
          { 
            lastCarLife: checkList['answer_0'], 
            lastCarLifeBackup: truckInfo?.lastCarLife || checkList['answer_0'] 
          },
          { where: { id: body['truckId'] } }
        );
      }
  
      return {
        status: 201,
        message: 'چک‌لیست با موفقیت ثبت شد',
      };
    } else {
      return {
        status: 200,
        message: 'مجاز برای ثبت چک لیست نیستید',
      };
    }
  }
  
  // async insertCheckList(body: Object) {
  //   const checkList = {};
  //   const checkListComment = {};
  //   const answers: [] = body['answers'];

  //   checkList['userId'] = body['id']; 
  //   checkList['truckId'] = body['truckId']; 
  //   checkList['name'] = body['name'];
  //   checkList['hours'] = body['hours'];
  //   checkList['history'] = body['date'];

  //   await this.checkTodayChecklist(body['truckId'])

  //   const today = new Date();
  //   const formattedDate = `${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate()}`;
  //   checkList['history']=formattedDate
  //   const currentTime = new Date();
  // let hours = currentTime.getHours();
  // let minutes = currentTime.getMinutes();
  // const fullHour=`${hours}:${minutes}`;
  //   checkList['hours']=fullHour


  //   const lastCheckList = await this.checkListRepository.findOne({
  //       where: { truckId: body['truckId'] },
  //       order: [['createdAt', 'DESC']],
  //   });
  //   console.log(lastCheckList);

  //   const currentAnswer0 = body['answers'].find((a) => a.number === 0)?.question;
  //   console.log(currentAnswer0);

  //   if (
  //       lastCheckList &&
  //       !lastCheckList.isDeleted &&
  //       (currentAnswer0 <= lastCheckList.answer_0 || currentAnswer0 - lastCheckList.answer_0 < 50000 || currentAnswer0-lastCheckList.answer_0>800000)
  //   ) {
  //       return {
  //           status: 200,
  //           data: [],
  //           message: 'مقدار کیلومتر جاری باید حداقل 500000 واحد بیشتر از مقدار آخرین رکورد باشد',
  //       };
  //   } 

  //   const diff = currentAnswer0 - lastCheckList.answer_0
  //   console.log("diff" , diff);


  //   for (let item of answers) {
  //       checkList['answer_' + item['number']] = item['question'];
  //       if (item['comment']) {
  //           checkListComment['comment_' + item['number']] = item['comment'];
  //       }
  //   }

  //   const insertCheckList = await this.checkListRepository.create<CheckList>(checkList);
  //   const kilometer = await this.kilometerDetailsService.create(body['truckId'] ,body['id'] , diff )

  //   if (Object.entries(checkListComment).length !== 0) {
  //       checkListComment['checkListId'] = insertCheckList.id;
  //       await this.checkListCommentRepository.create<CheckListComment>(checkListComment);
  //   }

  //   const unresolvedBreakdowns = await this.truckBreakDownRepository.findAll({
  //     where: {
  //         driverId: body['id'],
  //         historySendToRepair: {
  //             [Op.not]: null, 
  //         },
  //     },
  // });

  // console.log(unresolvedBreakdowns);

  //   if (unresolvedBreakdowns.length > 0) {
  //       for (const breakdown of unresolvedBreakdowns) {
  //           await this.truckBreakDownRepository.update(
  //               {
  //                 carLife: currentAnswer0, 
  //               },
  //               { where: { id: breakdown.id } }
  //           );
  //           console.log(breakdown);

  //       }
  //   }

  //   const truckInfo = await this.truckInfoRepository.findOne({
  //     where: { driverId: checkList['userId'] },
  // });

  //   if (truckInfo) {
  //       await this.truckInfoRepository.update(
  //           { lastCarLife: checkList['answer_0'] , lastCarLifeBackup : truckInfo?.lastCarLife || checkList['answer_0'] },
  //           { where: { driverId: checkList['userId'] } }
  //       );
  // }

  //   return {
  //       status: 201,
  //       message: 'چک‌لیست با موفقیت ثبت شد',
  //   };
  // }


  //   async insertCheckList(body: Object) {
  //     const checkList = {};
  //     const checkListComment = {};
  //     const answers: [] = body['answers'];

  //     checkList['userId'] = body['id'];
  //     checkList['name'] = body['name'];
  //     checkList['hours'] = body['hours'];
  //     checkList['history'] = body['date'];

  //     const today = new Date();
  //     today.setHours(0, 0, 0, 0);

  //     const todayCheckList = await this.checkListRepository.findOne({
  //         where: {
  //             userId: body['id'],
  //             createdAt: {
  //                 [Op.gte]: today,
  //             },
  //             isDeleted: false,
  //         },
  //     });

  //     if (todayCheckList) {
  //         return {
  //           status : 200 ,
  //           data : [] ,
  //           message : 'شما قبلاً چک‌لیست امروز را ثبت کرده‌اید'
  //         }
  //       }

  //       const lastCheckList = await this.checkListRepository.findOne({
  //         where: { userId: body['id'] },
  //         order: [['createdAt', 'DESC']],
  //       });

  //       if (
  //         lastCheckList &&
  //         !lastCheckList.isDeleted && 
  //         body['answers'].find(a => a.number === 0)?.question <= lastCheckList.answer_0 
  //       ) {
  //         return {
  //           status: 200,
  //           data: [],
  //           message: 'مقدار کیلومتر جاری نمی‌تواند کمتر یا مساوی مقدار آخرین رکورد باشد'
  //         };
  //       }

  //       for (let item of answers) {
  //           checkList['answer_' + item['number']] = item['question'];
  //           if (item['comment']) {
  //               checkListComment['comment_' + item['number']] = item['comment'];
  //           }
  //       }

  //     const insertCheckList = await this.checkListRepository.create<CheckList>(checkList);

  //     if (Object.entries(checkListComment).length !== 0) {
  //         checkListComment['checkListId'] = insertCheckList.id;
  //         await this.checkListCommentRepository.create<CheckListComment>(checkListComment);
  //     }

  //     const truckInfo = await this.truckInfoRepository.findOne({
  //         where: { driverId: checkList['userId'] },
  //     });

  //     const lastCarLifeBackup = truckInfo?.lastCarLife || checkList['answer_0'];

  //     await this.truckInfoRepository.upsert({
  //         lastCarLife: checkList['answer_0'],
  //         lastCarLifeBackup: lastCarLifeBackup,
  //         driverId: checkList['userId'],
  //         state: this.lowestValueCheckList(Object.values(checkList)),
  //     });

  //     return {
  //         status: 201,
  //         message: 'چک‌لیست با موفقیت ثبت شد',
  //     };
  // }


  // async insertCheckList(body: Object) {
  //   const checkList = {};
  //   const checkListComment = {};
  //   const answers = body['answers'];

  //   // اعتبارسنجی مقدار id
  //   if (!body['id'] || typeof body['id'] !== 'number') {
  //     return {
  //       status: 400,
  //       message: 'شناسه راننده (driverId) نامعتبر است',
  //       data: [],
  //     };
  //   }

  //   // اطمینان از مقدار صحیح truckId
  //   if (!body['truckId'] || typeof body['truckId'] !== 'number') {
  //     return {
  //       status: 400,
  //       message: 'شناسه کامیون (truckId) نامعتبر است',
  //       data: [],
  //     };
  //   }

  //   const driverId = body['id'];
  //   const truckId = body['truckId'];

  //   // ادامه پردازش
  //   checkList['userId'] = driverId;
  //   checkList['truckId'] = truckId;

  //   // اعتبارسنجی answers
  //   if (!answers || !Array.isArray(answers) || answers.length === 0) {
  //     return {
  //       status: 400,
  //       message: 'پاسخ‌های ارسال شده (answers) نامعتبر است',
  //       data: [],
  //     };
  //   }

  //   const currentAnswer0 = Number(answers.find((a) => a.number === 0)?.question);

  //   if (!currentAnswer0 || isNaN(currentAnswer0)) {
  //     return {
  //       status: 400,
  //       message: 'مقدار کیلومتر جاری نامعتبر است',
  //       data: [],
  //     };
  //   }
  //   try {
  //     for (let item of answers) {
  //       const answerKey = 'answer_' + item['number'];
  //       checkList[answerKey] = item['question'];

  //       if (item['comment']) {
  //         checkListComment['comment_' + item['number']] = item['comment'];
  //       }
  //     }

  //     const insertCheckList = await this.checkListRepository.create(checkList);

  //     const kilometer = await this.kilometerDetailsService.create(
  //       Number(body['truckId']),
  //       Number(body['id']),
  //       kilometerDifference
  //     );

  //     if (Object.keys(checkListComment).length > 0) {
  //       checkListComment['checkListId'] = insertCheckList.id;
  //       await this.checkListCommentRepository.create(checkListComment);
  //     }

  //     const unresolvedBreakdowns = await this.truckBreakDownRepository.findAll({
  //       where: {
  //         driverId: body['id'],
  //         historySendToRepair: {
  //           [Op.not]: null,
  //         },
  //       },
  //     });

  //     if (unresolvedBreakdowns.length > 0) {
  //       for (const breakdown of unresolvedBreakdowns) {
  //         await this.truckBreakDownRepository.update(
  //           {
  //             carLife: currentAnswer0,
  //           },
  //           { where: { id: breakdown.id } }
  //         );
  //       }
  //     }

  //     const truckInfo = await this.truckInfoRepository.findOne({
  //       where: { driverId: checkList['userId'] },
  //     });

  //     if (truckInfo) {
  //       await this.truckInfoRepository.update(
  //         {
  //           lastCarLife: checkList['answer_0'],
  //           lastCarLifeBackup: truckInfo?.lastCarLife || checkList['answer_0'],
  //         },
  //         { where: { driverId: checkList['userId'] } }
  //       );
  //     }

  //     return {
  //       status: 201,
  //       message: 'چک‌لیست با موفقیت ثبت شد',
  //       data: {
  //         id: insertCheckList.id,
  //         kilometerDifference,
  //       },
  //     };
  //   } catch (error) {
  //     console.log(error);

  //   }


  // }



  async getTotalKilometerOfChecklist(carNumber: string) {
    const kilometer = await this.checkListRepository.findOne({
      where: { carNumber },
      attributes: ['answer_0'],
    });

    if (!kilometer) {
      return {
        status: 201,
        data: [],
        message: "answer_0 یافت نشد"
      }
    }

    return {
      status: 200,
      data: kilometer,
      message: "answer_0 با موفقیت بازیابی شد"
    }
  }



  lowestValueCheckList(answers: string[]) {
    let lowest: string;
    console.log('answer list to check lowest', answers);
    if (answers.includes(CHECKLIST_ANSWERS.GOOD)) {
      lowest = CHECKLIST_ANSWERS.GOOD;
    }
    if (answers.includes(CHECKLIST_ANSWERS.MID)) {
      lowest = CHECKLIST_ANSWERS.MID;
    }
    if (answers.includes(CHECKLIST_ANSWERS.BAD)) {
      lowest = CHECKLIST_ANSWERS.BAD;
    }
    return lowest;
  }
  async checkCarLifeMoreThanLast(driverId: number, newCarLife: string) {
    const newCarLifeValue = parseInt(newCarLife);

    if (newCarLifeValue < 50 || newCarLifeValue > 800) {
      return {
        status: 200,
        data: [],
        message: "مقدار وارد شده باید بیشتر از 50 و کمتر از 800 باشد"
      };
    }
    const res = await this.truckInfoRepository.findOne({
      where: {
        driverId: driverId,
      },
    });

    let data: boolean;
    if (res.dataValues.updateCarNumber) {
      data = true;
    } else {
      data =
        parseInt(res.dataValues.lastCarLifeBackup) < parseInt(newCarLife)
          ? true
          : false;
    }
    return { data, status: 200 };
  }

  // async getllByDriverId(
  //   userId: number,
  //   beforHistory: string,
  //   afterHistory: string,
  // ) {
  //   // comment:  return data : [{date,hours,answers[orderby number]}]
  //   let data = [];
  //   let where = {};
  //   if (beforHistory && afterHistory)
  //     where['history'] = {
  //       [Op.between]: [`${beforHistory}`, `${afterHistory}`],
  //     };
  //   if (userId) where['userId'] = userId;

  //   // check role for not showing deleted items
  //   const user = await this.authRepository.findByPk(userId);
  //   if (user.role == ROLES.COMPANYDRIVER) {
  //     where["isDeleted"] = false
  //   }
  //   //get all of checklist of user checklists
  //   const res = await this.checkListRepository.findAndCountAll({
  //     where: where,
  //     order: [['id', 'DESC']],
  //   });
  //   const allCheckList = res.rows;

  //   // for each chklst add answers to data[x].answers
  //   for (let checkList of allCheckList) {
  //     let check = {};
  //     const info = checkList.dataValues;

  //     check['id'] = info['id'];
  //     check['date'] = info['history'];
  //     check['hours'] = info['hours'];
  //     check['userId'] = info['userId'];
  //     check['name'] = info['name'];

  //     data.push(check);
  //   }

  //   return {
  //     status: 200,
  //     data: data,
  //     message: `get all check list of driver id : ${userId}`,
  //   };
  // }

  // async getAllByDriverId(
  //   userId: number,
  //   beforeHistory: string,
  //   afterHistory: string,
  // ) {
  //   let data = [];
  //   let where = {};

  //   console.log(userId);


  //   if (beforeHistory && afterHistory) {
  //     where['history'] = {
  //       [Op.between]: [`${beforeHistory}`, `${afterHistory}`],
  //     };
  //   }

  //   if (userId) {where['userId'] = +userId;}

  //   const user = await this.authRepository.findOne({where : {id: userId}})
  //   if (user.role == ROLES.COMPANYDRIVER) {
  //     where["isDeleted"] = false;
  //   }

  //   const res = await this.checkListRepository.findAndCountAll({
  //     where: where,
  //     order: [['id', 'DESC']],
  //   });

  //   const allCheckList = res.rows;

  //   console.log(allCheckList);


  //   for (let checkList of allCheckList) {
  //     let check = {};
  //     const info = checkList.get(); 

  //     console.log(info);


  //     check['id'] = info['id'];
  //     check['date'] = info['history'];
  //     check['hours'] = info['hours'];
  //     check['userId'] = info['userId'];
  //     check['name'] = info['name'];

  //     check['answer_0'] = info['answer_0'];
  //     check['answer_1'] = info['answer_1'];
  //     check['answer_2'] = info['answer_2'];
  //     check['answer_3'] = info['answer_3'];
  //     check['answer_4'] = info['answer_4'];
  //     check['answer_5'] = info['answer_5'];
  //     check['answer_6'] = info['answer_6'];
  //     check['answer_7'] = info['answer_7'];
  //     check['answer_8'] = info['answer_8'];
  //     check['answer_9'] = info['answer_9'];
  //     check['answer_10'] = info['answer_10'];
  //     check['answer_11'] = info['answer_11'];
  //     check['answer_12'] = info['answer_12'];
  //     check['answer_13'] = info['answer_13'];
  //     check['answer_14'] = info['answer_14'];
  //     check['answer_15'] = info['answer_15'];
  //     check['answer_16'] = info['answer_16'];
  //     check['answer_17'] = info['answer_17'];
  //     check['answer_18'] = info['answer_18'];
  //     check['answer_19'] = info['answer_19'];
  //     check['answer_20'] = info['answer_20'];

  //     data.push(check);
  //   }

  //   console.log(data);

  //   return {
  //     status: 200,
  //     data: data,
  //     message: `Get all checklists for driver id: ${userId}`,
  //   };
  // }


  // async getAllByDriverId(
  //   userId: number,
  //   beforeHistory: string,
  //   afterHistory: string,
  // ) {
  //   let data = [];
  //   let where = {};


  //   if (beforeHistory && afterHistory) {
  //     where['history'] = {
  //       [Op.between]: [`${beforeHistory}`, `${afterHistory}`],
  //     };
  //   }

  //   if (userId) {
  //     where['userId'] = +userId;
  //   }

  //   const user = await this.authRepository.findOne({ where: { id: userId } });
  //   if (user && user.role === ROLES.COMPANYDRIVER) {
  //     where["isDeleted"] = false;
  //   }

  //   const res = await this.checkListRepository.findAndCountAll({
  //     where: where,
  //     order: [['id', 'DESC']],
  //   });

  //   const allCheckList = res.rows;

  //   for (let checkList of allCheckList) {
  //     let check = {};
  //     const info = checkList.get();  // گرفتن داده‌ها از checkList

  //     // اطمینان از اینکه info وجود دارد
  //     if (!info) {
  //       console.log("No info found for checklist", checkList.id);
  //       continue;
  //     }

  //     check['id'] = info['id'];
  //     check['date'] = info['history'];
  //     check['hours'] = info['hours'];
  //     check['userId'] = info['userId'];
  //     check['name'] = info['name'];

  //     // برای هر پاسخ، بررسی وجود آن در info
  //     for (let i = 0; i <= 20; i++) {
  //       const answerKey = `answer_${i}`;
  //       check[answerKey] = info[answerKey] !== undefined ? info[answerKey] : null;  // اگر پاسخ وجود نداشت، مقدار null قرار می‌دهیم
  //     }

  //     data.push(check);
  //   }

  //   console.log(data);

  //   return {
  //     status: 200,
  //     data: data,
  //     message: `Get all checklists for driver id: ${userId}`,
  //   };
  // }

  async getAllByDriverId(userId: number, beforeHistory?: string, afterHistory?: string) {
    let ArrayResult;
    try {
      const where: any = {
        userId: userId,
      };

      const user = await this.authRepository.findOne({
        where: { id: userId },
        attributes: ['role'],
      });

      if (!user) {
        return {
          status: 404,
          message: `User with id ${userId} not found`,
        };
      }

      if (user.role === 'companyDriver') {
        where['isDeleted'] = false;
      }


      if (beforeHistory && afterHistory) {
        where['history'] = {
          [Op.between]: [beforeHistory, afterHistory],
        };
      } else if (beforeHistory) {
        where['history'] = {
          [Op.lte]: beforeHistory,
        };
      } else if (afterHistory) {
        where['history'] = {
          [Op.gte]: afterHistory,
        };
      }


      const checkLists = await CheckList.findAll({
        where: where,
        order: [['history', 'DESC']],
      });


      if (checkLists.length === 0) {
        return {
          status: 404,
          message: `No checklists found for userId: ${userId}`,
        };
      }

      const data = checkLists.map((checkList) => {
        return {
          id: checkList.id,
          history: checkList.history,
          hours: checkList.hours,
          userId: checkList.userId,
          name: checkList.name,
          answer_0: checkList.answer_0,
          answer_1: checkList.answer_1,
          answer_2: checkList.answer_2,
          answer_3: checkList.answer_3,
          answer_4: checkList.answer_4,
          answer_5: checkList.answer_5,
          answer_6: checkList.answer_6,
          answer_7: checkList.answer_7,
          answer_8: checkList.answer_8,
          answer_9: checkList.answer_9,
          answer_10: checkList.answer_10,
          answer_11: checkList.answer_11,
          answer_12: checkList.answer_12,
          answer_13: checkList.answer_13,
          answer_14: checkList.answer_14,
          answer_15: checkList.answer_15,
          answer_16: checkList.answer_16,
          answer_17: checkList.answer_17,
          answer_18: checkList.answer_18,
          answer_19: checkList.answer_19,
          answer_20: checkList.answer_20,
          isDeleted: checkList.isDeleted
        };
      });

      return {
        status: 200,
        data: data,
        message: `Checklists found for userId: ${userId}`,
      };

    } catch (error) {
      console.error('Error retrieving checklists:', error);
      return {
        status: 500,
        message: 'An error occurred while retrieving checklists.',
      };
    }
  }

  async getAnswers(checkListId: number) {
    let data = [];

    const checkList = await this.checkListRepository.findOne({
      where: {
        id: checkListId,
      },
    });
    const comment = await this.checkListCommentRepository.findOne({
      where: {
        checkListId: checkListId,
      },
    });
    console.log(comment);

    for (let item = 0; item <= 20; item++) {
      let check = {};
      check['answer'] = checkList[`answer_${item}`];
      // for answer's not have record comment , user not set any comment when answered
      if (!comment) {
        check['comment'] = null;
      } else {
        check['comment'] = comment[`answer_${item}`];
      }
      check['number'] = item;
      data.push(check);
    }

    return {
      status: 200,
      data: data,
      message: `data of check list id = ${checkListId} `,
    };
  }

  // async dailyCheck(
  //   userId: number | undefined,
  //   date: string | undefined,
  //   done: string,
  //   beforeHistory: string,
  //   afterHistory: string,
  //   zone: string,
  //   company: string,
  //   isDeleted: boolean
  // ) {
  //   let check = false; // comment: default not register daily check
  //   // comment: variable's of daily check in repair panel
  //   const data = [];
  //   let driversDone = [];
  //   // let driversUndone = []; //notused
  //   let idDriversUndone = [];
  //   let idDriversDone = [];
  //   let idDrivers = [];
  //   let message: string;
  //   let filterByDate = {};
  //   let where = {};
  //   // console.log(typeof done);

  //   if (done === undefined) {
  //     //=============================================================[comment: logic; should more than one register in a day ]
  //     return {
  //       data: false,
  //       status: 200,
  //       message: `status of driver registered daily checklist, hint: false -> unregistered `,
  //     };

  //     //==========================================================================[comment: daily check for driver register checklist] logic: driver should one checklist register in a day

  //     // const checkList = await this.checkListRepository.count({
  //     //   where: { [Op.and]: { userId: userId, history: date }, ...filterByDate },
  //     // });

  //     // if (checkList === 1) {
  //     //   check = true;
  //     // }

  //     // return {
  //     //   data: check,
  //     //   status: 200,
  //     //   message: `status of driver registered daily checklist, hint: false -> unregistered `,
  //     // };
  //     //===========================================================================
  //   }
  //   // comment: daily check in repair panel
  //   else {
  //     `Driver done field's return: 
  //       driverName, zone, carNumber, carLife, mobile, type, state, hours, history
  //      Driver undone field's return: 
  //       driverName, zone, carNumber, carLife, mobile, type`;

  //     // console.log('before history: ', beforeHistory); // #DEBUG
  //     // console.log('after history: ', afterHistory); // #DEBUG

  //     if (beforeHistory || afterHistory) {
  //       if (!afterHistory) {
  //         afterHistory = '2400/0/0';
  //       }
  //       if (!beforeHistory) {
  //         beforeHistory = '2023/0/0';
  //       }

  //       where['history'] = {
  //         [Op.between]: [`${beforeHistory}`, `${afterHistory}`],
  //       };
  //     }

  //     if (date) where['history'] = date;


  //     // console.log('where cluase : \n', where); // #DEBUG

  //     const checkListRegisterByDriver = await this.checkListRepository.findAll({
  //       where: { ...where },
  //       attributes: ['id', 'userId', 'history', 'hours'],
  //     });

  //     // comment: fetch data of driver's register daily checkList
  //     checkListRegisterByDriver.forEach((element) => {
  //       idDriversDone.push(element.dataValues['userId']);
  //       driversDone.push(element.dataValues);
  //     });
  //     // console.log('res: ', idDriversDone.length); // #DEBUG
  //     // console.log('driverDone: ', driversDone); // #DEBUG

  //     // comment: fetch data of driver's unregister || register daily checkList
  //     if (done === 'true') {
  //       idDrivers = idDriversDone;
  //       message = 'list of driver done check list today';
  //     } else {
  //       const res = await this.authRepository.findAll({
  //         attributes: ['id', 'name', 'role', 'mobile'],
  //         where: {
  //           [Op.and]: {
  //             role: 'companyDriver',
  //             id: { [Op.notIn]: idDriversDone },
  //           },
  //         },
  //       });
  //       // console.log('drivers undone: ', res); // debug
  //       res.forEach((element) => {
  //         idDriversUndone.push(element.dataValues.id);
  //       });
  //       idDrivers = idDriversUndone;
  //       message = 'list of driver undone check list today';
  //     }
  //     // comment; driver target to response
  //     const filter = {};
  //     if (zone) filter['zone'] = zone;
  //     if (company) filter['company'] = company;
  //     if(isDeleted) filter['isDeleted'] = isDeleted

  //     const drivers = await this.authRepository.findAll({
  //       attributes: ['id', 'name', 'role', 'mobile', 'company', 'zone'],
  //       where: {
  //         [Op.and]: {
  //           role: 'companyDriver',
  //           id: { [Op.in]: idDrivers },
  //           ...filter,
  //         },
  //       },
  //     });
  //     for (let item of drivers) {
  //       // console.log('driver result: ', item.dataValues); // debug/
  //       let checkInfo = {};
  //       Object.assign(checkInfo, item.dataValues);

  //       // comment: for driver done list on repair panel add "hours" and "history"
  //       if (done === 'true') {
  //         // console.log('driversDone : ', driversDone); // debug
  //         for (let done of driversDone) {
  //           checkInfo['answers'] = (await this.getAnswers(done['id'])).data;

  //           if (done['userId'] === item['id']) {
  //             checkInfo['hours'] = done['hours'];
  //             checkInfo['history'] = done['history'];
  //             break;
  //           }
  //         }
  //       }
  //       const truckInfo = await this.truckInfoRepository.findOne({
  //         where: { driverId: item.dataValues.id },
  //         attributes: ['lastCarLife', 'carNumber', 'type', 'state'],
  //       });
  //       // comment:  handled ; if not exist companyDriver in truckInfo table
  //       if (truckInfo) {
  //         Object.assign(checkInfo, truckInfo.dataValues);
  //       } else {
  //         checkInfo['lastCarLife'] = null;
  //         checkInfo['carNumber'] = null;
  //         checkInfo['type'] = null;
  //         checkInfo['zone'] = null;
  //         checkInfo['state'] = null;
  //         checkInfo['hours'] = null;
  //         checkInfo['history'] = null;
  //       }

  //       data.push(checkInfo);
  //     }

  //     return {
  //       data: data,
  //       status: 200,
  //       message: message,
  //     };
  //   }
  // }

  // async dailyCheckCount(date: string, done: string, zone: string , company ?: string) {
  //   try {
  //     let where = {};
  //     let filter = {};
  //     let idDriversDone = [];
  //     let driversIdInSameZone: Auth[] = [];
  //     let usersIdInSameZone = [];
  //     let countCheckList: number;
  //     let message: string;
  //     let data = {};


  // async dailyCheck(
  //   userId: number | undefined,
  //   date: string | undefined,
  //   done: string,
  //   beforeHistory: string,
  //   afterHistory: string,
  //   zone: string,
  //   company: string,
  //   isDeleted: boolean
  // ) {
  //   let check = false; // default not registered daily check
  //   const data = [];
  //   let driversDone = [];
  //   let idDriversUndone = [];
  //   let idDriversDone = [];
  //   let idDrivers = [];
  //   let message: string;
  //   const filterByDate = {};
  //   const where: any = {};

  //   // اگر کار انجام شده تعریف نشده باشد
  //   if (done === undefined) {
  //     return {
  //       data: false,
  //       status: 200,
  //       message: `status of driver registered daily checklist, hint: false -> unregistered `,
  //     };
  //   } else {
  //     if (beforeHistory || afterHistory) {
  //       if (!afterHistory) afterHistory = '2400/0/0';
  //       if (!beforeHistory) beforeHistory = '2023/0/0';

  //       where['history'] = {
  //         [Op.between]: [beforeHistory, afterHistory],
  //       };
  //     }

  //     if (date) where['history'] = date;

  //     if (userId) where['userId'] = userId; // اضافه کردن فیلتر userId

  //     // دریافت چک‌لیست‌های ثبت‌شده توسط راننده
  //     const checkListRegisterByDriver = await this.checkListRepository.findAll({
  //       where: { ...where },
  //       attributes: ['id', 'userId', 'history', 'hours'],
  //     });

  //     // ساخت لیست رانندگان با چک‌لیست انجام‌شده
  //     checkListRegisterByDriver.forEach((element) => {
  //       idDriversDone.push(element.dataValues['userId']);
  //       driversDone.push(element.dataValues);
  //     });

  //     // ایجاد پیام و فیلتر بر اساس وضعیت
  //     if (done === 'true') {
  //       idDrivers = idDriversDone;
  //       message = 'list of driver done checklist today';
  //     } else {
  //       const res = await this.authRepository.findAll({
  //         attributes: ['id', 'name', 'role', 'mobile' , 'personelCode'],
  //         where: {
  //           [Op.and]: {
  //             role: 'companyDriver',
  //             id: { [Op.notIn]: idDriversDone },
  //           },
  //         },
  //       });
  //       res.forEach((element) => {
  //         idDriversUndone.push(element.dataValues.id);
  //       });
  //       idDrivers = idDriversUndone;
  //       message = 'list of driver undone checklist today';
  //     }

  //     // ساخت فیلتر‌های اضافی
  //     const filter = {};
  //     if (zone) filter['zone'] = zone;
  //     if (company) filter['company'] = company;
  //     if (isDeleted) filter['isDeleted'] = isDeleted;

  //     // دریافت اطلاعات رانندگان
  //     const drivers = await this.authRepository.findAll({
  //       attributes: ['id', 'name', 'role', 'mobile', 'company', 'zone' , 'personelCode'],
  //       where: {
  //         [Op.and]: {
  //           role: 'companyDriver',
  //           id: { [Op.in]: idDrivers },
  //           ...filter,
  //         },
  //       },
  //     });

  //     for (let item of drivers) {
  //       let checkInfo = { ...item.dataValues };

  //       if (done === 'true') {
  //         for (let done of driversDone) {
  //           checkInfo['answers'] = (await this.getAnswers(done['id'])).data;

  //           if (done['userId'] === item['id']) {
  //             checkInfo['hours'] = done['hours'];
  //             checkInfo['history'] = done['history'];
  //             break;
  //           }
  //         }
  //       }

  //       // دریافت اطلاعات از truckInfo
  //       const truckInfo = await this.truckInfoRepository.findOne({
  //         where: { driverId: item.dataValues.id },
  //         attributes: ['lastCarLife', 'carNumber', 'type', 'state'],
  //       });

  //       if (truckInfo) {
  //         Object.assign(checkInfo, truckInfo.dataValues);
  //       } else {
  //         Object.assign(checkInfo, {
  //           lastCarLife: null,
  //           carNumber: null,
  //           type: null,
  //           zone: null,
  //           state: null,
  //           hours: null,
  //           history: null,
  //         });
  //       }

  //       data.push(checkInfo);
  //     }

  //     return {
  //       data: data,
  //       status: 200,
  //       message: message,
  //     };
  //   }
  // }

  async dailyCheck(
    userId: number | undefined,
    date: string | undefined,
    done: string,
    beforeHistory: string,
    afterHistory: string,
    zone: string,
    company: string,
    isDeleted: boolean
  ) {
    const data = [];
    let message: string;

    const where: any = {};
    if (date) {
      where['history'] = date;
    } else if (beforeHistory || afterHistory) {
      where['history'] = {
        [Op.between]: [beforeHistory || '2023/0/0', afterHistory || '2400/0/0'],
      };
    }
    if (userId) where['userId'] = userId;

    const checkListRegisterByDriver = await this.checkListRepository.findAll({
      where: { ...where },
      attributes: ['id', 'userId', 'history', 'hours'],
    });

    const idDriversDone = checkListRegisterByDriver.map((element) => element.userId);

    const driverFilter: any = {
      role: 'companyDriver',
      ...(done === 'true'
        ? { id: { [Op.in]: idDriversDone } }
        : { id: { [Op.notIn]: idDriversDone } }),
    };

    if (zone) driverFilter['zone'] = zone;
    if (company) driverFilter['company'] = company;
    if (isDeleted !== undefined) driverFilter['isDeleted'] = isDeleted;

    const driversQuery = await this.authRepository.findAll({
      attributes: ['id', 'name', 'role', 'mobile', 'company', 'zone', 'personelCode'],
      where: driverFilter,
    });

    const truckInfos = await this.truckInfoRepository.findAll({
      where: { driverId: { [Op.in]: driversQuery.map((driver) => driver.id) } },
      attributes: ['driverId', 'lastCarLife', 'carNumber', 'type', 'state'],
    });

    const truckInfoMap = truckInfos.reduce((map, truck) => {
      map[truck.driverId] = truck;
      return map;
    }, {});


    for (let item of driversQuery) {
      let checkInfo = { ...item.dataValues };
    
      if (done === 'true') {
        const driverCheckList = checkListRegisterByDriver.find(
          (done) => done.userId === item.id
        );
        if (driverCheckList) {
          checkInfo['checklistId'] = driverCheckList.id; // Include checklist ID
          checkInfo['hours'] = driverCheckList.hours;
          checkInfo['history'] = driverCheckList.history;
        }
      }
    
      const truckInfo = truckInfoMap[item.id] || {};
      Object.assign(checkInfo, truckInfo);
    
      data.push(checkInfo);
    }
    

    message = done === 'true' ? 'list of driver done checklist today' : 'list of driver undone checklist today';

    return {
      data,
      status: 200,
      message,
    };
  }



  async dailyCheckCount(
    date: string,
    done: string,
    zone: string,
    company?: string,
  ) {
    try {
      let where = {};
      let filter = {};
      let idDriversDone = [];
      let driversIdInSameZone: Auth[] = [];
      let usersIdInSameZone = [];
      let countCheckList: number;
      let message: string;
      let data = {};
      let repairmentWhere = {}

      if (date) where['history'] = date;

      if (zone && company) {
        driversIdInSameZone = await this.getUsersSameZone(
          zone,
          'companyDriver',
          ['id'],
          company,
        );
        
        driversIdInSameZone.forEach((user) => {
          usersIdInSameZone.push(user.dataValues['id']);
        });
        console.log(driversIdInSameZone);
        
        // console.log('userIdInSameZone  :', usersIdInSameZone); // #DEBUG
        where['userId'] = { [Op.in]: usersIdInSameZone };
        console.log(where['userId']);
        
        if (zone) filter['zone'] = zone;
        if (company) filter['company'] = company;
      }
      // console.log('where :', where); // #DEBUG

      // all zone and unique zone; register check list in "date"
      const userRegister = await this.checkListRepository.findAndCountAll({
        where: { ...where },
      });


      data['countRegister'] = userRegister.count;
      message = "count of register check list by driver's ";

      // get id drivers register daily checklist for compute unregister driver
      userRegister.rows.forEach((element) => {
        idDriversDone.push(element.dataValues['userId']);
      });

      const userNotRegister = await this.authRepository.findAndCountAll({
        where: {
          [Op.and]: {
            role: 'companyDriver',
            id: { [Op.notIn]: idDriversDone },
            ...filter,
          },
        },
      });

      data['countUnRegister'] = userNotRegister.count;
      message = 'count of registered and unregister check list  ';

      // const underRepairCarDrivers = await this.getUsersSameZone(zone, 'companyDriver', ['id'], company);
      // const underRepairDriverIds = underRepairCarDrivers.map((driver) => driver.dataValues['id']);
      // console.log('Drivers in Same Zone for underRepairCars:', underRepairDriverIds);

      // const underRepairCarsCount = await this.truckBreakDownRepository.findAndCountAll({
      //   where: {
      //     [Op.or]: [
      //       { logisticConfirm: false },
      //       {
      //         [Op.or]: [
      //           { historyDeliveryDriver: null },
      //           { historyDeliveryDriver: "" },
      //         ],
      //       },
      //     ],
      //     ...(underRepairDriverIds.length > 0 && {
      //       driverId: { [Op.in]: underRepairDriverIds },
      //     }),
      //   },
      // });
      // data['underRepairCarsCount'] = underRepairCarsCount.count

      const driversInZoneOrCompany = await this.authRepository.findAll({
        where: {
          ...(zone && { zone }),
          ...(company && { company: { [Op.like]: `%${company}%` } }),
        },
        attributes: ['id', 'company', 'zone'],
      });

      usersIdInSameZone = driversInZoneOrCompany.map((driver) => driver.id);

      repairmentWhere['driverId'] = { [Op.in]: usersIdInSameZone };


      const breakdowns = await this.truckBreakDownRepository.findAll({
        where: {
          ...repairmentWhere,
             histroyDeliveryTruck: null,

        },
        attributes: ['id', 'driverId'],
      });

      const driverDetails = await this.authRepository.findAll({
        where: { id: { [Op.in]: usersIdInSameZone } },
        attributes: ['id', 'company', 'zone'],
      });

      const breakdownCountByCompanyZone = [];

      breakdowns.forEach((breakdown) => {
        const driver = driverDetails.find((d) => d.id === breakdown.driverId);
        const company = driver?.company || 'Unknown Company';
        const zone = driver?.zone || 'Unknown Zone';

        const existingEntry = breakdownCountByCompanyZone.find(
          (entry) => entry.company === company && entry.zone === zone,
        );

        if (existingEntry) {
          existingEntry.count += 1;
        } else {
          breakdownCountByCompanyZone.push({
            company,
            zone,
            count: 1,
          });
        }
      });

      data['breakdownCountByCompanyZone'] = breakdownCountByCompanyZone;


      return { status: 200, data: data, message: message };
    } catch (err) {
      console.log(err);
    }
  }


  // async dailyCheckCount(date: string, done: string, zone: string, company: string = "") {
  //   try {
  //     const data: any = {};

  //     // 1. استخراج driverIds بر اساس فیلتر zone و company از authRepository
  //     const authWhere: any = {};
  //     if (zone) authWhere['zone'] = zone;
  //     if (company) authWhere['company'] = company;

  //     const drivers = await this.authRepository.findAll({
  //       where: authWhere,
  //       attributes: ['id'], // فقط شناسه راننده‌ها را نیاز داریم
  //     });


  //     const driverIds = drivers.map((driver) => driver.id);

  //     // اگر هیچ راننده‌ای با فیلترهای داده شده پیدا نشد، مقادیر پیش‌فرض 0 بازگردانده می‌شود.
  //     if (driverIds.length === 0) {
  //       return {
  //         status: 200,
  //         data: {
  //           registeredCount: 0,
  //           unregisteredCount: 0,
  //           breakdownCount: 0,
  //         },
  //         underRepairCarsCount: 0,
  //         message: 'No drivers found for the given filters.',
  //       };
  //     }

  //     // 2. شمارش کاربران ثبت‌شده در checkListRepository با استفاده از driverIds
  //     const registeredWhere: any = { userId: { [Op.in]: driverIds } };

  //     if (date) registeredWhere['history'] = date;

  //     const registeredUsers = await this.checkListRepository.findAndCountAll({
  //       where: registeredWhere,
  //     });

  //     // 3. شمارش کاربران ثبت‌نشده
  //     const unregisteredUsers = await this.authRepository.findAndCountAll({
  //       where: {
  //         role: 'companyDriver',
  //         id: { [Op.in]: driverIds, [Op.notIn]: registeredUsers.rows.map((row) => row.userId) },
  //       },
  //     });

  //     data['registeredCount'] = registeredUsers.count;
  //     data['unregisteredCount'] = unregisteredUsers.count;

  //     // 4. عملیات مرتبط با Breakdown با فیلترهای zone و company
  //     const breakdownWhere: any = {
  //       // [Op.or]: [
  //       //   { logisticConfirm: false },
  //         // {
  //           [Op.or]: [
  //             { historyDeliveryDriver: null },
  //             { historyDeliveryDriver: "" },
  //           ],
  //         // },
  //       // ],
  //       driverId: { [Op.in]: driverIds },
  //     };

  //     const breakdownCount = await this.truckBreakDownRepository.findAndCountAll({
  //       where: breakdownWhere,
  //     });

  //     data['underRepairCarsCount'] = breakdownCount.count

  //     return {
  //       status: 200,
  //       data, // افزودن شمارش برای خودروهای در تعمیر (قابل افزودن)
  //       message: 'Data fetched successfully with all filters applied.',
  //     };
  //   } catch (err) {
  //     console.error(err);
  //     throw new HttpException(err.message || 'Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
  //   }
  // }




  async exportReport(
    beforeHistory: string,
    afterHistory: string,
    zone: string,
    done: string,
    company: string,
    isDeleted: boolean
  ) {
    try {
      const book = new Workbook();
      const workSheet = book.addWorksheet('LogisticAdmin_report');

      let rows: Array<any> = [];
      let data: any[];
      const checkLists = await this.dailyCheck(
        undefined,
        undefined,
        done,
        beforeHistory,
        afterHistory,
        zone,
        company,
        isDeleted
      );

      // console.log('checkLists', checkLists.data); // #DEBUG
      if (typeof checkLists.data == 'object') {
        rows.push(...checkLists.data);

        if (done === 'true') {
          workSheet.columns = COLUMNS_NAME_EXCEL_REPORT_CHECKLIST_DONE;
          data = generateDataExcel(FIELDS_OF_EXCEL_CHECKLIST_DONE, rows);
        } else {
          workSheet.columns = COLUMNS_NAME_EXCEL_REPORT_CHECKLIST_UNDONE;
          data = generateDataExcel(FIELDS_OF_EXCEL_CHECKLIST_UNDONE, rows);
        }

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
  // async removeCheckList(id: number) {
  //   try {
  //     const checklistToDelete = await this.checkListRepository.findOne({
  //       where: { id: id },
  //     });

  //     // const removeComment = await this.checkListCommentRepository.destroy({
  //     //   where: {
  //     //     checkListId: id,
  //     //   },
  //     // });

  //     const perviousCheckListOfUser = await this.checkListRepository.findOne({
  //       where: {
  //         userId: checklistToDelete.userId,
  //       },
  //       order: [['id', 'DESC']],
  //     });
  //     perviousCheckListOfUser.isDeleted = true
  //     perviousCheckListOfUser.save()

  //     await this.truckInfoRepository.update(
  //       { lastCarLife: perviousCheckListOfUser.answer_0.toString() },
  //       { where: { driverId: checklistToDelete.userId } },
  //     );

  //     return { status: 200, message: 'reomve checkList successfully' };
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }

  async removeCheckList(id: number) {
    try {
      const checklistToDelete = await this.checkListRepository.findOne({
        where: { id: id },
      });
  
      if (!checklistToDelete) {
        return { status: 404, message: 'چک لیست یافت نشد' };
      }
  
      const today = new Date();
      const formattedToday = today.toISOString().split('T')[0]; 
  
      const checklistDateUTC = new Date(checklistToDelete.history);
      const checklistDateLocal = new Date(
        checklistDateUTC.getTime() + checklistDateUTC.getTimezoneOffset() * 60000
      );
  
      checklistDateLocal.setDate(checklistDateLocal.getDate() + 1);
  
      const formattedChecklistDate = checklistDateLocal.toISOString().split('T')[0];
  
      if (formattedChecklistDate !== formattedToday) {
        return { status: 201, message: 'شما فقط قادر به حذف چک لیست امروز هستید' };
      }
      
      const perviousCheckListOfUser = await this.checkListRepository.findOne({
        where: {
          userId: checklistToDelete.userId,
        },
        order: [['id', 'DESC']],
      });
  
      if (perviousCheckListOfUser) {
        perviousCheckListOfUser.isDeleted = true;
        await perviousCheckListOfUser.save();
      }

      await this.kilometerDetailsService.updateKilometerDetails(checklistToDelete.userId , checklistToDelete.truckId , checklistToDelete.answer_0)
  
      await this.truckInfoRepository.update(
        { lastCarLife: perviousCheckListOfUser?.answer_0?.toString() || '' },
        { where: { driverId: checklistToDelete.userId } },
      );
  
  
      return { status: 200, message: 'CheckList removed successfully' };
    } catch (err) {
      console.error('Error removing checklist:', err);
      return { status: 500, message: 'An error occurred while removing the checklist' };
    }
  }
  

  async removeAllCheckLists() {
    try {
      await this.checkListRepository.destroy({ where: {} })
      return { status: 200, message: 'checkLists removed successfully' };
    } catch (err) {
      console.log(err);
    }
  }

  async getUsersSameZone(
    role: string,
    zone?: string,
    attributes: Array<string> = [],
    company?: string,
  ) {
    return await this.authService.userSameZone(zone, role, attributes, company);
  }
  // async checkKilometer(body: Object) {
  //   let Holidaykilometer;
  //   let diffCheckList: number = 0
  //   let kilometerPerviousNumber: number=0;
  //   const currentAnswer = body['kilometer'];
  //   const checkList = {};
  //   const hd = new Holidays('IR')
  //   const getHoliday = hd.getHolidays('2025');
  //   const today = new Date();
  //   const formattedDate = `${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate()}`;
  //   const formattedYesteradyDate = `${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate() - 1}`;
  //   console.log(formattedYesteradyDate);

  //   const formatToday = today.toISOString().split('T')[0];
  //   console.log(formatToday);

  //   let ckeckInHolidaysOrNot = await this.checkInHoliday(getHoliday, formatToday);
  //   // if (ckeckInHolidaysOrNot.message == ' شما در تعطیلات هستید') {
  //   //   Holidaykilometer = 0
  //   // } else {
  //   //   console.log(ckeckInHolidaysOrNot.numberOfHoliday);
      
  //   //   Holidaykilometer = 2000 * ckeckInHolidaysOrNot.numberOfHoliday;
  //   // }

  //   const currentTime = new Date();
  //   let hours = currentTime.getHours();
  //   let minutes = currentTime.getMinutes();
  //   const fullHour = `${hours}:${minutes}`;
  //   checkList['hours'] = fullHour

  //   const lastCheckLis = await this.checkListRepository.findOne({
  //     where: { userId: body['userId'] , truckId : body['truckId'] , history: formattedYesteradyDate },
  //     order: [['createdAt', 'DESC']],
  //   });
  //   const lastCheckList = await this.checkListRepository.findAndCountAll({
  //     where: {  userId: body['userId'] , truckId : body['truckId'] },
  //     order: [['createdAt', 'DESC']],
  //   });

  //   if (lastCheckList) {
  //     for (const item of lastCheckList.rows) {
  //       if (item.answer_0 != null) {
  //         kilometerPerviousNumber = item.dataValues.answer_0+kilometerPerviousNumber;
  //         console.log(item.dataValues.answer_0, 'is data');

  //       }
  //     }
  //   }
  //   // console.log(lastCheckList.length, 'is lenght');
  //       const resultDifference=await this.checkNumberOfCheckList(body['userId']);
  //     diffCheckList=resultDifference.message

  //   let diff = 0

  //   console.log(diffCheckList,"is diff ", kilometerPerviousNumber,"is pervious");
    
  //     // console.log(lastCheckLis.history != formattedYesteradyDate, currentAnswer > 1000 * diffCheckList + kilometerPerviousNumber,
  //     //   !lastCheckLis.isDeleted, formattedYesteradyDate, lastCheckLis.history);
  //     if(lastCheckLis){
  //     console.log(currentAnswer <= lastCheckLis.answer_0, currentAnswer - lastCheckLis.answer_0 > 1000);
  //      if( currentAnswer <= lastCheckLis.answer_0 ||( currentAnswer <= kilometerPerviousNumber  || currentAnswer>1000 * diffCheckList + kilometerPerviousNumber)){
  //       console.log('in if');
        
  //         return{
  //           status:200,
  //           message:'شرایط کیلومتر اشتباه است'
  //         }
  //       }
  //   }if( currentAnswer>1000 * diffCheckList + kilometerPerviousNumber|| currentAnswer <= kilometerPerviousNumber ){
  //     console.log((1000 * diffCheckList) + kilometerPerviousNumber || currentAnswer < kilometerPerviousNumber);
      
      
  //       return{
  //         status:200,
  //         message:'شرایط کیلومتر اشتباه است'
  //       }
  //     }else{
  //       console.log('in');
        
  //       return{
  //         status:200,
  //         message:'ادامه'
  //       }
  //     }
  //     // else {
  //     //   if (currentAnswer - Number(kilometerPerviousNumber) > 1000) {
  //     //     return {
  //     //       status: 200,
  //     //       message: 'شرایط کیلومتر اشتباه است'
  //     //     }
  //     //   } else {
  //     //     return {
  //     //       status: 200,
  //     //       message: 'ادامه'
  //     //     }
  //     //   }
  //     // }
  //     // اگر رکورد قبلی وجود دارد

  //   // } else {
  //   //   console.log(kilometerPerviousNumber, currentAnswer);

  //   //   if ((currentAnswer > 1000 && kilometerPerviousNumber == undefined) || currentAnswer - kilometerPerviousNumber > 1000) {
  //   //     return {
  //   //       status: 200,
  //   //       data: [],
  //   //       message: 'شرایط کیلومتر اشتباه است',
  //   //     };
  //   //   } else {
  //   //     return {
  //   //       status: 200,
  //   //       message: 'ادامه'
  //   //     }
  //   //   }
  //   // }
  // }

  async checkKilometer(body: Object) {
    let kilometerPerviousNumber = 0;
    const currentAnswer = body['kilometer'];
    const userId = body['userId'];
    const truckId = body['truckId'];
    const today = new Date();
    const formattedToday = `${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate()}`;
    const formattedYesterday = `${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate() - 1}`;
  
    // بررسی چک‌لیست دیروز
    const lastCheckListYesterday = await this.checkListRepository.findOne({
      where: { userId, truckId, history: formattedYesterday, isDeleted: false },
      order: [['createdAt', 'DESC']],
    });
  
    // بررسی آخرین چک‌لیست ثبت شده
    const lastCheckList = await this.checkListRepository.findOne({
      where: { userId, truckId, isDeleted: false },
      order: [['createdAt', 'DESC']],
    });
  
    // اگر کاربر برای اولین بار چک‌لیست ثبت می‌کند، بدون محدودیت ادامه می‌دهد
    if (!lastCheckList) {
      return {
        status: 200,
        message: 'ادامه', // تابع بدون اعمال محدودیت اجرا می‌شود
      };
    }
  
    // مقدار کیلومتر قبلی
    kilometerPerviousNumber = lastCheckList.answer_0;
  
    if (lastCheckListYesterday) {
      const lastKilometer = lastCheckListYesterday.answer_0;
  
      if (currentAnswer > lastKilometer + 1000) {
        console.log(lastKilometer);
        console.log(currentAnswer);
  
        return {
          status: 200,
          message: 'شرایط کیلومتر اشتباه است',
        };
      }
  
      if (currentAnswer <= lastKilometer) {
        console.log(lastKilometer);
        console.log(currentAnswer);
  
        return {
          status: 200,
          message: 'شرایط کیلومتر اشتباه است',
        };
      }
    } else {
      // محاسبه روزهای گذشته برای چک‌لیست‌های غایب
      const diffCheckList = await this.calculateMissedCheckListDays(userId, formattedToday);
      if (
        currentAnswer <= kilometerPerviousNumber ||
        currentAnswer > 1000 * diffCheckList + kilometerPerviousNumber
      ) {
        console.log("not yesterday");
        console.log(currentAnswer);
        console.log(kilometerPerviousNumber);
  
        return {
          status: 200,
          message: 'شرایط کیلومتر اشتباه است',
        };
      }
    }
  
    // تابع بدون خطا به پایان می‌رسد
    return {
      status: 200,
      message: 'ادامه',
    };
  }
  
  

async calculateMissedCheckListDays(userId: number, formattedToday: string) {
    const checkListRecords = await this.checkListRepository.findAll({
      where: { userId },
      order: [['history', 'DESC']],
    });
  
    if (!checkListRecords.length) return 1;
  
    const latestHistory = checkListRecords[0].dataValues.history;
    const splitToday = formattedToday.split("/");
    const splitLatest = latestHistory.split("/");
  
    let totalDays = this.calculateDateDifference(splitToday, splitLatest);
  
    const missedDays = await this.excludeHolidaysAndFridays(totalDays, latestHistory, formattedToday);
    return missedDays > 0 ? missedDays : 1;
}

async excludeHolidaysAndFridays(totalDays: number, startDate: string, endDate: string) {
    const hd = new Holidays('IR');
    const holidays = hd.getHolidays('2025'); 

    let nonHolidayDays = 0;

    const start = new Date(startDate);
    const end = new Date(endDate);

    for (let i = 0; i < totalDays; i++) {
      const currentDate = new Date(start);
      currentDate.setDate(start.getDate() + i); 

      const dayOfWeek = currentDate.getDay();
      const formattedCurrentDate = `${currentDate.getFullYear()}/${currentDate.getMonth() + 1}/${currentDate.getDate()}`;

      const isHoliday = holidays.some((holiday) => holiday.date === formattedCurrentDate);
      const isFriday = dayOfWeek === 5; 

      if (!isHoliday && !isFriday) {
        nonHolidayDays++;
      }
    }

    return nonHolidayDays;
}

calculateDateDifference(today: string[], latest: string[]): number {
    const [yearToday, monthToday, dayToday] = today.map(Number);
    const [yearLatest, monthLatest, dayLatest] = latest.map(Number);

    const todayDate = new Date(yearToday, monthToday - 1, dayToday);
    const latestDate = new Date(yearLatest, monthLatest - 1, dayLatest);

    const diffTime = todayDate.getTime() - latestDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

  

  // async checkInHoliday(holiadys: Array<Holiday>, todayDate: string) {
  //   let message: string;
  //   let numberOfHoliday: number = 0
  //   for (let item of holiadys) {
  //     console.log(item);

  //     const date = new Date(item.date);
  //     const formattedDate = date.toISOString().split('T')[0];

  //     console.log(formattedDate, todayDate);

  //     if (todayDate == formattedDate) {
  //       console.log("in hd");
  //       numberOfHoliday=0
  //       message = ' شما در تعطیلات هستید'
  //     } else {
  //       numberOfHoliday =numberOfHoliday+1
  //       message = 'ادامه'
  //     }

  //   }
  //   return {
  //     message,
  //     numberOfHoliday
  //   }
  // }

  // async checkNumberOfCheckList(id: number) {
  //   let day: number;
  //   const checkNumberOfCheckList = await this.checkListRepository.findAll({
  //     where: { userId: id },
  //     order: [['history', 'DESC']],
      
  //   });
  //   console.log(checkNumberOfCheckList);
    
  //   // if (checkNumberOfCheckList.length > 1) {

  //     const getMonth = new Date();
  //     const numberGetMonth = getMonth.getMonth() + 1
  //     // const lastHistory = checkNumberOfCheckList[checkNumberOfCheckList.length ].dataValues.history;
  //     const today = new Date();
  //     const formattedDate = `${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate()}`;
  //     const latestHistory = checkNumberOfCheckList[0].dataValues.history;
  //     const splitLastHistory = formattedDate.split("/");
  //     const splitLatestHistory = latestHistory.split("/");
  //     console.log(formattedDate, latestHistory, numberGetMonth, splitLastHistory[2], splitLatestHistory[2]);
  //     switch (Number(splitLastHistory[1])) {
  //       case 0:
  //         day = 31
  //         break;
  //       case 1:
  //         day = 31
  //         break;
  //       case 2:
  //         day = 28
  //         break;
  //       case 3:
  //         day = 31
  //         break;
  //       case 4:
  //         day = 30
  //         break;
  //       case 5:
  //         day = 31
  //         break;
  //       case 6:
  //         day = 30
  //         break;
  //       case 7:
  //         day = 31
  //         break;
  //       case 8:
  //         day = 31
  //         break;
  //       case 9:
  //         day = 30
  //         break;
  //       case 10:
  //         day = 31
  //         break;
  //       case 11:
  //         day = 30
  //         break;

  //       default:
  //         break;
  //     }
  //     if (Number(splitLastHistory[2]) == Number(splitLatestHistory[2])) {
        
  //       return {
  //         status: 200,
  //         message: 1
  //       }
  //     } else {
  //        const resultNumber=day-(Number(splitLastHistory[2])+Number(splitLatestHistory[2]));
  //        const result= this.mirror(resultNumber);
  //        return{
  //         status:200,
  //         message:result
  //        }
  //     }

  //   } 

     mirror(firstNumber:number):number{
      if(firstNumber<0){
        return -firstNumber
      }
      return firstNumber
    }

  }
  



