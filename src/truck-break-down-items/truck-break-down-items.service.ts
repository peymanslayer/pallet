import { Inject, Injectable } from '@nestjs/common';
import { TruckBreakDown } from 'src/truck-break-down/truck-break-down.entity';
import { TruckBreakDownItems } from './truck-break-down-items.entity';
import { TruckInfo } from 'src/truck-info/truck-info.entity';
import { Op, where } from 'sequelize';
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

//   async insertTruckBreakDownItems(body: any) {
//     let insertBreakDown;
//     const breakDownItems = {};
//     const breakDown = {};
//     const answers: [] = body['answers'];
//     const today = new Date();
//     const formattedDate = `${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate()}`;
//     console.log(formattedDate,body['id']);
    
//     const todayCheckList=await this.checkListRepository.findOne({
//       where:{history:
//       formattedDate,userId:body.id}
//     });
//     console.log(todayCheckList);
    
//     if(todayCheckList){
//     // const activeBreakdown = await this.truckBreakDownRepository.findOne({
//     //     where: {
//     //         driverId: body['id'],
//     //         driverDeliveryConfirm: false, 
//     //     },
//     // });

//     // if (activeBreakdown) {
//     //     return {
//     //         status: 200,
//     //         message: 'شما در حال حاضر یک خرابی در دست انجام دارید. لطفاً آن را تکمیل کنید.',
//     //     };
//     // }

//     const truckInfo = await this.truckInfoRepository.findOne({
//       where: { driverId: body['id'] },
//     });

//     if ((await this.checkActiveTruckBreakDown(body['id'])) !== 0) {
//       return {
//         status: 200,
//         message: MESSAGE_ALERT.truckBreakDown_limit_register,
//       };
//     }

//     const lastCheckList = await this.checkListRepository.findOne({
//       where: { userId: body['id'] },
//       order: [['createdAt', 'DESC']],
//     });

//     breakDown['hoursDriverRegister'] = body['hours'];
//     breakDown['historyDriverRegister'] = body['date'];
//     breakDown['driverName'] = body['name'];
//     breakDown['driverId'] = body['id'];
//     breakDown['carLife'] = lastCheckList ? lastCheckList.answer_0 : null;
//     breakDown['carNumber'] = truckInfo ? truckInfo.carNumber : null;
//     breakDown['driverMobile'] = body['mobile'];

//     breakDown['numberOfBreakDown'] = (await this.lastNumberOfBreakDown()) + 1;

//     for (let item of answers) {
//       breakDownItems['answer_' + item['number']] = item['comment'];
//       breakDownItems['type_' + item['number']] = item['type'];
//       breakDownItems['number_'+ item['number']]=item['number'];
//     }

//     const insertItems =
//       await this.truckBreakDownItemsRepository.create<TruckBreakDownItems>(
//         breakDownItems,
//       );

//     if (insertItems) {
//       breakDown['truckBreakDownItemsId'] = insertItems.id;
//        insertBreakDown =
//         await this.truckBreakDownRepository.create<TruckBreakDown>(breakDown);
//         console.log(insertItems,insertBreakDown);
//     }
   
    

//     return {
//         status: 201,
//         message:[insertBreakDown]
//     };
// }
// else{
//   return{
//     status:400,
//     message:'شما هنوز چک لیستی ثبت نکردید'
//   }
// }
//   }

async insertTruckBreakDownItems(body: any) {
  try {
    let insertBreakDown;
    const breakDownItems = {};
    const breakDown = {};
    const answers: [] = body['answers'];
    const today = new Date();
    const formattedDate = `${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate()}`;

    console.log('Formatted Date:', formattedDate);
    console.log('Body:', body);

    const truckInfo = await this.truckInfoRepository.findOne({where : {driverId : body['id']}})

    const todayCheckList = await this.checkListRepository.findOne({
      where: { history: formattedDate, truckId: truckInfo.id },
    });
    console.log('Today Checklist:', todayCheckList);

    if (!todayCheckList) {
      return {
        status: 400,
        message: 'شما هنوز چک لیستی ثبت نکردید',
      };
    };

    // if (activeBreakdowns !== 0) {
      //   console.log('Active Breakdowns Count:', activeBreakdowns);
      //   return {
        //     status: 200,
        //     message: MESSAGE_ALERT.truckBreakDown_limit_register,
        //   };
        // }
        
        
    const activeBreakdowns = await this.checkActiveTruckBreakDown(truckInfo.carNumber);
    if(activeBreakdowns.count !== 0){
      return {
            status: 200,
            message: MESSAGE_ALERT.truckBreakDown_limit_register,
          };
    }
    
    const lastCheckList = await this.checkListRepository.findOne({
      where: { carNumber: truckInfo.carNumber },
      order: [['createdAt', 'DESC']],
    });

    // اعتبارسنجی مقادیر مورد نیاز
    if (!truckInfo) {
      console.warn('Truck information not found for driver:', body['id']);
    }

    breakDown['hoursDriverRegister'] = body['hours'];
    breakDown['historyDriverRegister'] = formattedDate;
    breakDown['driverName'] = body['name'];
    breakDown['driverId'] = body['id'];
    breakDown['carLife'] = lastCheckList ? lastCheckList.answer_0 : null;
    breakDown['carNumber'] = truckInfo ? truckInfo.carNumber : 'نامشخص';
    breakDown['driverMobile'] = body['mobile'];
    breakDown['numberOfBreakDown'] = (await this.lastNumberOfBreakDown()) + 1;

    console.log('Breakdown Data Before Validation:', breakDown);

    // اعتبارسنجی داده‌های Breakdown
    if (!breakDown['carNumber']) {
      breakDown['carNumber'] = 'نامشخص';
      console.warn('Car number is missing, setting to default value.');
    }

    for (let item of answers) {
      console.log('Processing item:', item);
    
      if (!item['number'] || !item['comment'] || !item['type']) {
        console.warn('Invalid answer item:', item);
        continue;
      }
    
      breakDownItems['answer_' + item['number']] = item['comment'];
      breakDownItems['type_' + item['number']] = item['type'];
      breakDownItems['number_' + item['number']] = item['number'];
    
    }
    

    // ذخیره اطلاعات Breakdown Items
    const insertItems = await this.truckBreakDownItemsRepository.create<TruckBreakDownItems>(
      breakDownItems, { isNewRecord: true }
    );

    if (insertItems) {
      breakDown['truckBreakDownItemsId'] = insertItems.id;
      insertBreakDown = await this.truckBreakDownRepository.create<TruckBreakDown>(breakDown , { isNewRecord: true });
      console.log('Insert Breakdown Result:', insertBreakDown);
    }

    return {
      status: 201,
      message: [insertBreakDown],
    };
  } catch (error) {
    console.error('Error inserting truck breakdown:', error);
    return {
      status: 500,
      message: 'خطایی در ثبت خرابی رخ داده است.',
    };
  }
}
// async insertTruckBreakDownItems(body: any) {
//   try {
//     let insertBreakDown;
//     const breakDownItems = {};
//     const breakDown = {};
//     const answers: [] = body['answers'];
//     const today = new Date();
//     const formattedDate = `${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate()}`;

//     console.log('Formatted Date:', formattedDate);
//     console.log('Body:', body);

//     const todayCheckList = await this.checkListRepository.findOne({
//       where: { history: formattedDate, userId: body.id },
//     });
//     console.log('Today Checklist:', todayCheckList);

//     if (!todayCheckList) {
//       return {
//         status: 400,
//         message: 'شما هنوز چک لیستی ثبت نکردید',
//       };
//     }

//     const truckInfo = await this.truckInfoRepository.findOne({
//       where: { driverId: body['id'] },
//     });

//     // if (activeBreakdowns !== 0) {
//       //   console.log('Active Breakdowns Count:', activeBreakdowns);
//       //   return {
//         //     status: 200,
//         //     message: MESSAGE_ALERT.truckBreakDown_limit_register,
//         //   };
//         // }
        
        
        
//     const activeBreakdowns = await this.checkActiveTruckBreakDown(body['id']);
//     if(activeBreakdowns.count !== 0){
//       return {
//             status: 200,
//             message: MESSAGE_ALERT.truckBreakDown_limit_register,
//           };
//     }
    


//     const lastCheckList = await this.checkListRepository.findOne({
//       where: { userId: body['id'] },
//       order: [['createdAt', 'DESC']],
//     });

//     // اعتبارسنجی مقادیر مورد نیاز
//     if (!truckInfo) {
//       console.warn('Truck information not found for driver:', body['id']);
//     }

//     breakDown['hoursDriverRegister'] = body['hours'];
//     breakDown['historyDriverRegister'] = formattedDate;
//     breakDown['driverName'] = body['name'];
//     breakDown['driverId'] = body['id'];
//     breakDown['carLife'] = lastCheckList ? lastCheckList.answer_0 : null;
//     breakDown['carNumber'] = truckInfo ? truckInfo.carNumber : 'نامشخص';
//     breakDown['driverMobile'] = body['mobile'];
//     breakDown['numberOfBreakDown'] = (await this.lastNumberOfBreakDown()) + 1;

//     console.log('Breakdown Data Before Validation:', breakDown);

//     // اعتبارسنجی داده‌های Breakdown
//     if (!breakDown['carNumber']) {
//       breakDown['carNumber'] = 'نامشخص';
//       console.warn('Car number is missing, setting to default value.');
//     }

//     for (let item of answers) {
//       console.log('Processing item:', item);
    
//       if (!item['number'] || !item['comment'] || !item['type']) {
//         console.warn('Invalid answer item:', item);
//         continue;
//       }
    
//       breakDownItems['answer_' + item['number']] = item['comment'];
//       breakDownItems['type_' + item['number']] = item['type'];
//       breakDownItems['number_' + item['number']] = item['number'];
    
//       console.log('Breakdown Items:', breakDownItems);
//     }
    

//     // ذخیره اطلاعات Breakdown Items
//     const insertItems = await this.truckBreakDownItemsRepository.create<TruckBreakDownItems>(
//       breakDownItems, { isNewRecord: true }
//     );
//     console.log('Insert Items Result:', insertItems);

//     if (insertItems) {
//       breakDown['truckBreakDownItemsId'] = insertItems.id;
//       insertBreakDown = await this.truckBreakDownRepository.create<TruckBreakDown>(breakDown , { isNewRecord: true });
//       console.log('Insert Breakdown Result:', insertBreakDown);
//     }

//     return {
//       status: 201,
//       message: [insertBreakDown],
//     };
//   } catch (error) {
//     console.error('Error inserting truck breakdown:', error);
//     return {
//       status: 500,
//       message: 'خطایی در ثبت خرابی رخ داده است.',
//     };
//   }
// }




  async updateByDriver(id: number, body: any) {
    let arr=[];
    let answer;
    let type;
    let obj={}
    for(let x of body.answers){
      answer = `answer_` +x.number;
      type= `type_` + x.number;
      arr.push([answer,x.comment]);
      arr.push([type,x.type]);
    }
   const finalresult=Object.fromEntries(arr);
  console.log(arr,finalresult);
  
  
  

    
    
  const [affectedCount]=await this.truckBreakDownItemsRepository.update( 
     finalresult,
    {where:{id:id}})
  //   try{
  //   let message;
  //   let status: number;
  //   let affectedCountResult=[];
  //   const breakDownItems = {};
  //   for(const item of body.answers){
  //     const [affectedCount] = await this.truckBreakDownItemsRepository.update(
  //       item,
  //       { where: { id: id }}
       
  //     );
  //     affectedCountResult.push(affectedCount);
  //   }
  //   // for frontEnd developer solution !!!!
  //   // for (let item = 0; item <= 20; item++) {
  //   //   breakDownItems['answer_' + item] = null;
  //   //   breakDownItems['type_' + item] = null;
  //   // }
  //   // const restToNullBreakDown = await this.truckBreakDownItemsRepository.update(
  //   //   breakDownItems,
  //   //   { where: { id: id } },
  //   // );

  //   // for (let item of answers) {
  //   //   breakDownItems['answer_' + item['number']] = item['comment'];
  //   //   breakDownItems['type_' + item['number']] = item['type'];
  //   // }
  //   console.log(body);


  //   const findBreakDown=await this.truckBreakDownItemsRepository.findOne({
  //     where:{id:id}
  //    });
  //  console.log(affectedCountResult);
  //   if (affectedCountResult.includes(0)) {
  //     message = `update item id = ${id} failed`;
  //     status = 400;
  //   } else {
  //     message = findBreakDown;
  //     status = 200;

  //   }
  //   return {
  //     status: status,
  //     message: message,
  //   };
  // }catch(err){
  //   console.log(err);
    
  // }
  console.log(affectedCount);
  
if(affectedCount==0){
  return{
    status:200,
    message:'اپدیت نشد'
  }
}else{
  return{
    status:200,
    message:'اپدیت شد'
  }
}
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

  async checkActiveTruckBreakDown(carNumber: string){
    try {
      const activeBreakdowns = await this.truckBreakDownRepository.findAndCountAll({
        where: {
          driverDeliveryConfirm: false,
          carNumber,
        },
      });
      return activeBreakdowns;
    } catch (error) {
      console.error(`Error counting active truck breakdowns for truck ${carNumber}:`, error);
      throw new Error('Failed to count active truck breakdowns.');
    }
  }
  
  async checkInsertedBreakdownOnceADay(driverId: number){
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingBreakdown = await this.truckBreakDownRepository.findOne({
      where: {
        driverId: driverId,
        createdAt: {
          [Op.gte]: today,
        },
      },
    });

    if (existingBreakdown) {
      return {
        status: 400,
        message: 'شما قبلاً یک خرابی در امروز ثبت کرده‌اید.',
      };
    }
  }
}
