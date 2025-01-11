import { Inject, Injectable } from '@nestjs/common';
import { TruckBreakDown } from 'src/truck-break-down/truck-break-down.entity';
import { TruckBreakDownItems } from './truck-break-down-items.entity';
import { TruckInfo } from 'src/truck-info/truck-info.entity';
import { Op } from 'sequelize';
import { MESSAGE_ALERT } from 'src/static/enum';
import { CheckList } from 'src/check-list/check-list.entity';
@Injectable()
export class TruckBreakDownItemsService {
  constructor(
    @Inject('TRUCKBREAKDOWN_REPOSITORY')
    private readonly truckBreakDownRepository: typeof TruckBreakDown,
    @Inject('TRUCKBREAKDOWNITEMS_REPOSITORY')
    private readonly truckBreakDownItemsRepository: typeof TruckBreakDownItems,
    @Inject('TRUCKINFO_REPOSITORY')
    private readonly truckInfoRepository: typeof TruckInfo,
    @Inject('CHECKLIST_REPOSITORY')
    private readonly checkListRepository: typeof CheckList,
  ) {}

  // async insertTruckBreakDownItems(body: Object) {
  //   const breakDownItems = {};
  //   const breakDown = {};
  //   const answers: [] = body['answers'];
  //   const truckInfo = await this.truckInfoRepository.findOne({
  //     where: { driverId: body['id'] },
  //   });
  //   // TODO : !!await this.checkActiveTruckBreakDown(body['id'])
  //   if ((await this.checkActiveTruckBreakDown(body['id'])) !== 0) {
  //     return {
  //       status: 410,
  //       message: MESSAGE_ALERT.truckBreakDown_limit_register,
  //     };
  //   }

  //   const lastCheckList = await this.checkListRepository.findOne({
  //     where: { userId: body['id'] },
  //     order: [['createdAt', 'DESC']],
  //   });

  //   // console.log(Object.entries(truckInfo)); // debug
  //   breakDown['hoursDriverRegister'] = body['hours'];
  //   breakDown['historyDriverRegister'] = body['date'];
  //   breakDown['driverName'] = body['name'];
  //   breakDown['driverId'] = body['id'];
  //   breakDown['carLife'] = lastCheckList ? lastCheckList.answer_0 : null;
  //   breakDown['carNumber'] = truckInfo ? truckInfo.carNumber : null;
  //   breakDown['driverMobile'] = body['mobile'];
  //   `comment: reserve a number of register berakDown
  //             for user to goal have unique number in same time register`;

  //   breakDown['numberOfBreakDown'] = (await this.lastNumberOfBreakDown()) + 1;

  //   // console.log(breakDown['numberOfBreakDown']);
  //   for (let item of answers) {
  //     breakDownItems['answer_' + item['number']] = item['comment'];
  //     breakDownItems['type_' + item['number']] = item['type'];
  //   }
  //   const insertItems =
  //     await this.truckBreakDownItemsRepository.create<TruckBreakDownItems>(
  //       breakDownItems,
  //     );
  //   if (insertItems) {
  //     breakDown['truckBreakDownItemsId'] = insertItems.id;
  //     const insertBreakDown =
  //       await this.truckBreakDownRepository.create<TruckBreakDown>(breakDown);
  //   }
  //   return {
  //     status: 200,
  //     message: 'insert report truck breakdown  successfully',
  //   };
  // }

  async insertTruckBreakDownItems(body: Object) {
    const breakDownItems = {};
    const breakDown = {};
    const answers: [] = body['answers'];
    const today = new Date();
    const formattedDate = `${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate()}`;
    const todayCheckList=await this.checkListRepository.findOne({
      where:{history:formattedDate,userId:body['id']}
    });
    if(todayCheckList){
    const activeBreakdown = await this.truckBreakDownRepository.findOne({
        where: {
            driverId: body['id'],
            driverDeliveryConfirm: false, 
        },
    });

    if (activeBreakdown) {
        return {
            status: 200,
            message: 'شما در حال حاضر یک خرابی در دست انجام دارید. لطفاً آن را تکمیل کنید.',
        };
    }

    const truckInfo = await this.truckInfoRepository.findOne({
      where: { driverId: body['id'] },
    });

    if ((await this.checkActiveTruckBreakDown(body['id'])) !== 0) {
      return {
        status: 200,
        message: MESSAGE_ALERT.truckBreakDown_limit_register,
      };
    }

    const lastCheckList = await this.checkListRepository.findOne({
      where: { userId: body['id'] },
      order: [['createdAt', 'DESC']],
    });

    breakDown['hoursDriverRegister'] = body['hours'];
    breakDown['historyDriverRegister'] = body['date'];
    breakDown['driverName'] = body['name'];
    breakDown['driverId'] = body['id'];
    breakDown['carLife'] = lastCheckList ? lastCheckList.answer_0 : null;
    breakDown['carNumber'] = truckInfo ? truckInfo.carNumber : null;
    breakDown['driverMobile'] = body['mobile'];

    breakDown['numberOfBreakDown'] = (await this.lastNumberOfBreakDown()) + 1;

    for (let item of answers) {
      breakDownItems['answer_' + item['number']] = item['comment'];
      breakDownItems['type_' + item['number']] = item['type'];
      breakDownItems['number_'+ item['number']]=item['number'];
    }

    const insertItems =
      await this.truckBreakDownItemsRepository.create<TruckBreakDownItems>(
        breakDownItems,
      );

    if (insertItems) {
      breakDown['truckBreakDownItemsId'] = insertItems.id;
      const insertBreakDown =
        await this.truckBreakDownRepository.create<TruckBreakDown>(breakDown);
        console.log(insertItems,insertBreakDown);
    }
   
    

    return {
        status: 201,
        message: 'گزارش خرابی کامیاب ثبت شد.',
    };
}
else{
  return{
    status:400,
    message:'شما هنوز چک لیستی ثبت نکردید'
  }
}
  }


  async updateByDriver(id: number, body: any) {
    let message: string;
    let status: number;
    const breakDownItems = {};
    const answers: [] = body['answers'];
    // for frontEnd developer solution !!!!
    for (let item = 0; item <= 20; item++) {
      breakDownItems['answer_' + item] = null;
      breakDownItems['type_' + item] = null;
    }
    // const restToNullBreakDown = await this.truckBreakDownItemsRepository.update(
    //   breakDownItems,
    //   { where: { id: id } },
    // );

    for (let item of answers) {
      breakDownItems['answer_' + item['number']] = item['comment'];
      breakDownItems['type_' + item['number']] = item['type'];
    }
    console.log(breakDownItems);
    
    const updateBreakDown = await this.truckBreakDownItemsRepository.update(
      breakDownItems,
      { where: { id: id } },
    );
   console.log(updateBreakDown);
   
    if (updateBreakDown.length>0) {
      message = `update breakDown id = ${id} successfully`;
      status = 200;
    } else {
      message = `update item id = ${id} failed`;
      status = 400;
    }
    return {
      status: status,
      message: message,
    };
  }

  async lastNumberOfBreakDown() {
    const lastBreakDown = await this.truckBreakDownRepository.findOne({
      where: {},
      include: [{ all: true }],
      order: [['numberOfBreakDown', 'DESC']],
      limit: 1,
    });
    if (!lastBreakDown) {
      //start number of breakDown in system from "100"
      return 100;
    } else {
      return lastBreakDown.numberOfBreakDown;
    }
  }

  async checkActiveTruckBreakDown(driverId: number) {
    return await this.truckBreakDownRepository.count({
      where: {
        driverId: driverId,
        historyDeliveryDriver: { [Op.ne]: null },
      },
    });
  }
}
