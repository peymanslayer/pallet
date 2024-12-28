import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CheckList } from './check-list.entity';
import { CheckListComment } from 'src/check-list-comment/check-list-comment.entity';
import { TruckInfo } from 'src/truck-info/truck-info.entity';
import { Op, json } from 'sequelize';
import {
  CHECKLIST_ANSWERS,
  FIELDS_OF_EXCEL_CHECKLIST_DONE,
  FIELDS_OF_EXCEL_CHECKLIST_UNDONE,
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
  ) {}
  async insertCheckList(body: Object) {
    const checkList = {};
    const checkListComment = {};
    const answers: [] = body['answers'];

    checkList['userId'] = body['id'];
    checkList['name'] = body['name'];
    checkList['hours'] = body['hours'];
    checkList['history'] = body['date'];

    // >>>>>>>>>>>>>>>>check user due to not have token<<<<<<<<<<<<
    const user = await this.authRepository.findOne({
      where: {
        id: body['id'],
      },
    });
    console.log('------------------------------------->', user.id);
    if (!user.id) {
      throw new HttpException(
        'شما در سیستم ثبت نام نکرده اید یا کاربر شما پاک شده است لطفا به مدیر خود اطلاع دهید',
        HttpStatus.UNAUTHORIZED,
      );
    }
    //check key name and generate new record
    for (let item of answers) {
      checkList['answer_' + item['number']] = item['question'];
      //check answer have comment and initite checkListComment
      if (item['comment']) {
        checkListComment['comment_' + item['number']] = item['comment'];
      }
    }

    const insertCheckList =
      await this.checkListRepository.create<CheckList>(checkList);
    // console.log(checkListComment); //debug
    if (Object.entries(checkListComment).length != 0) {
      // add data for inset to relation model "checkListComment"
      // console.log(checkList); // debug
      checkListComment['checkListId'] = insertCheckList.id;
      // console.log(checkListComment); //debug
      const insertCheckListComment =
        await this.checkListCommentRepository.create<CheckListComment>(
          checkListComment,
        );
    }
    // update lastCarLife  in "truck_info"
    // check answered kilometer ; "answer_0" is kilometer number of truck
    // console.log(CarNumber[`id${checkList['userId']}`]); // debug
    let lastCarLifeBackup = checkList['answer_0'];
    const truckInfo = await this.truckInfoRepository.findOne({
      where: {
        driverId: checkList['userId'],
      },
    });

    const today = new Date().getDate();

    if (today != truckInfo.updatedAt.getDate()) {
      lastCarLifeBackup = truckInfo.lastCarLife;
    }

    const updateTruckInfo = await this.truckInfoRepository.update(
      {
        lastCarLife: checkList['answer_0'],
        lastCarLifeBackup: lastCarLifeBackup,
        state: this.lowestValueCheckList(Object.values(checkList)),
        updateCarNumber: false,
      },
      {
        where: {
          driverId: checkList['userId'],
        },
      },
    );
    // console.log(updateTruckInfo[0]); // debug "updateTruckInfo[0]" number of affected on row's with this update
    if (updateTruckInfo[0] == 0) {
      const createTruckInfo = await this.truckInfoRepository.create({
        lastCarLife: checkList['answer_0'],
        driverId: checkList['userId'],
        state: this.lowestValueCheckList(Object.values(checkList)),
      });
    }

    return {
      status: 200,
      message: 'insert check list successfully',
    };
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
    return { status: 200 ,
             data: [] ,
             message : "مقدار وارد شده باید بیشتر از 50 و کمتر از 800 باشد"
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

  async getllByDriverId(
    userId: number,
    beforHistory: string,
    afterHistory: string,
  ) {
    // comment:  return data : [{date,hours,answers[orderby number]}]
    let data = [];
    let where = {};
    if (beforHistory && afterHistory)
      where['history'] = {
        [Op.between]: [`${beforHistory}`, `${afterHistory}`],
      };
    if (userId) where['userId'] = userId;
    //get all of checklist of user checklists
    const res = await this.checkListRepository.findAndCountAll({
      where: where,
      order: [['id', 'DESC']],
    });
    const allCheckList = res.rows;

    // for each chklst add answers to data[x].answers
    for (let checkList of allCheckList) {
      let check = {};
      const info = checkList.dataValues;

      check['id'] = info['id'];
      check['date'] = info['history'];
      check['hours'] = info['hours'];
      check['userId'] = info['userId'];
      check['name'] = info['name'];

      data.push(check);
    }

    return {
      status: 200,
      data: data,
      message: `get all check list of driver id : ${userId}`,
    };
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

    for (let item = 0; item <= 20; item++) {
      let check = {};
      check['answer'] = checkList[`answer_${item}`];
      // for answer's not have record comment , user not set any comment when answered
      if (!comment) {
        check['comment'] = null;
      } else {
        check['comment'] = comment[`comment_${item}`];
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

  async dailyCheck(
    userId: number | undefined,
    date: string | undefined,
    done: string,
    beforeHistory: string,
    afterHistory: string,
    zone: string,
    company: string,
  ) {
    let check = false; // comment: default not register daily check
    // comment: variable's of daily check in repair panel
    const data = [];
    let driversDone = [];
    // let driversUndone = []; //notused
    let idDriversUndone = [];
    let idDriversDone = [];
    let idDrivers = [];
    let message: string;
    let filterByDate = {};
    let where = {};
    // console.log(typeof done);

    if (done === undefined) {
      //=============================================================[comment: logic; should more than one register in a day ]
      return {
        data: false,
        status: 200,
        message: `status of driver registered daily checklist, hint: false -> unregistered `,
      };

      //==========================================================================[comment: daily check for driver register checklist] logic: driver should one checklist register in a day

      // const checkList = await this.checkListRepository.count({
      //   where: { [Op.and]: { userId: userId, history: date }, ...filterByDate },
      // });

      // if (checkList === 1) {
      //   check = true;
      // }

      // return {
      //   data: check,
      //   status: 200,
      //   message: `status of driver registered daily checklist, hint: false -> unregistered `,
      // };
      //===========================================================================
    }
    // comment: daily check in repair panel
    else {
      `Driver done field's return: 
        driverName, zone, carNumber, carLife, mobile, type, state, hours, history
       Driver undone field's return: 
        driverName, zone, carNumber, carLife, mobile, type`;

      // console.log('before history: ', beforeHistory); // #DEBUG
      // console.log('after history: ', afterHistory); // #DEBUG

      if (beforeHistory || afterHistory) {
        if (!afterHistory) {
          afterHistory = '2400/0/0';
        }
        if (!beforeHistory) {
          beforeHistory = '2023/0/0';
        }

        where['history'] = {
          [Op.between]: [`${beforeHistory}`, `${afterHistory}`],
        };
      }

      if (date) where['history'] = date;

      // console.log('where cluase : \n', where); // #DEBUG

      const checkListRegisterByDriver = await this.checkListRepository.findAll({
        where: { ...where },
        attributes: ['id', 'userId', 'history', 'hours'],
      });

      // comment: fetch data of driver's register daily checkList
      checkListRegisterByDriver.forEach((element) => {
        idDriversDone.push(element.dataValues['userId']);
        driversDone.push(element.dataValues);
      });
      // console.log('res: ', idDriversDone.length); // #DEBUG
      // console.log('driverDone: ', driversDone); // #DEBUG

      // comment: fetch data of driver's unregister || register daily checkList
      if (done === 'true') {
        idDrivers = idDriversDone;
        message = 'list of driver done check list today';
      } else {
        const res = await this.authRepository.findAll({
          attributes: ['id', 'name', 'role', 'mobile'],
          where: {
            [Op.and]: {
              role: 'companyDriver',
              id: { [Op.notIn]: idDriversDone },
            },
          },
        });
        // console.log('drivers undone: ', res); // debug
        res.forEach((element) => {
          idDriversUndone.push(element.dataValues.id);
        });
        idDrivers = idDriversUndone;
        message = 'list of driver undone check list today';
      }
      // comment; driver target to response
      const filter = {};
      if (zone) filter['zone'] = zone;
      if (company) filter['company'] = company;

      const drivers = await this.authRepository.findAll({
        attributes: ['id', 'name', 'role', 'mobile', 'company', 'zone'],
        where: {
          [Op.and]: {
            role: 'companyDriver',
            id: { [Op.in]: idDrivers },
            ...filter,
          },
        },
      });
      for (let item of drivers) {
        // console.log('driver result: ', item.dataValues); // debug/
        let checkInfo = {};
        Object.assign(checkInfo, item.dataValues);

        // comment: for driver done list on repair panel add "hours" and "history"
        if (done === 'true') {
          // console.log('driversDone : ', driversDone); // debug
          for (let done of driversDone) {
            checkInfo['answers'] = (await this.getAnswers(done['id'])).data;

            if (done['userId'] === item['id']) {
              checkInfo['hours'] = done['hours'];
              checkInfo['history'] = done['history'];
              break;
            }
          }
        }
        const truckInfo = await this.truckInfoRepository.findOne({
          where: { driverId: item.dataValues.id },
          attributes: ['lastCarLife', 'carNumber', 'type', 'state'],
        });
        // comment:  handled ; if not exist companyDriver in truckInfo table
        if (truckInfo) {
          Object.assign(checkInfo, truckInfo.dataValues);
        } else {
          checkInfo['lastCarLife'] = null;
          checkInfo['carNumber'] = null;
          checkInfo['type'] = null;
          checkInfo['zone'] = null;
          checkInfo['state'] = null;
          checkInfo['hours'] = null;
          checkInfo['history'] = null;
        }

        data.push(checkInfo);
      }

      return {
        data: data,
        status: 200,
        message: message,
      };
    }
  }

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

      if (date) where['history'] = date;

      if (zone || company) {
        driversIdInSameZone = await this.getUsersSameZone(
          zone,
          'companyDriver',
          ['id'],
          company,
        );
        driversIdInSameZone.forEach((user) => {
          usersIdInSameZone.push(user.dataValues['id']);
        });
        // console.log('userIdInSameZone  :', usersIdInSameZone); // #DEBUG
        where['userId'] = { [Op.in]: usersIdInSameZone };
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

      const underRepairCarDrivers = await this.getUsersSameZone(zone, 'companyDriver', ['id'], company);
      const underRepairDriverIds = underRepairCarDrivers.map((driver) => driver.dataValues['id']);
      console.log('Drivers in Same Zone for underRepairCars:', underRepairDriverIds);
  
      const underRepairCarsCount = await this.truckBreakDownRepository.findAndCountAll({
        where: {
          [Op.or]: [
            { logisticConfirm: false },
            {
              [Op.or]: [
                { historyDeliveryDriver: null },
                { historyDeliveryDriver: "" },
              ],
            },
          ],
          ...(underRepairDriverIds.length > 0 && {
            driverId: { [Op.in]: underRepairDriverIds },
          }),
        },
      });
      data['underRepairCarsCount'] = underRepairCarsCount.count

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
  async removeCheckList(id: number) {
    try {
      const checklistToDelete = await this.checkListRepository.findOne({
        where: { id: id },
      });

      const removeComment = await this.checkListCommentRepository.destroy({
        where: {
          checkListId: id,
        },
      });

      const perviousCheckListOfUser = await this.checkListRepository.findOne({
        where: {
          userId: checklistToDelete.userId,
        },
        order: [['id', 'DESC']],
      });

      const updateLastCarLife = await this.truckInfoRepository.update(
        { lastCarLife: perviousCheckListOfUser.answer_0.toString() },
        { where: { driverId: checklistToDelete.userId } },
      );

      return { status: 200, message: 'reomve checkList successfully' };
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
}


