import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { PeriodicTruckCheck } from './periodic-truck-check.entity';
import { alertKilometer, PeriodicTruckCheckType } from 'src/common/constants';
import { TruckInfo } from 'src/truck-info/truck-info.entity';
import { Auth } from 'src/auth/auth.entity';
import { CreatePeriodicTruckCheckDto } from './dto/create-periodic-truck-check.dto';
import { TruckInfoService } from 'src/truck-info/truck-info.service';
import { PeriodicType } from 'src/periodic-type/periodic-type.entity';

@Injectable()
export class PeriodicTruckCheckService {
  constructor(
    @Inject('PERIODIC_TRUCK_CHECK_REPOSITORY')
    private readonly periodicTruckCheckRepository: typeof PeriodicTruckCheck,
    private readonly truckInfoService: TruckInfoService,
    @Inject('AUTH_REPOSITORY')
    private readonly authRepository: typeof Auth,
    @Inject('PERIODIC_TYPE_REPOSITORY')
    private readonly periodicTypeRepository: typeof PeriodicType,
  ) {}
  // get all periodict types in a property of class
  async create(payload: CreatePeriodicTruckCheckDto) {
    try {
      // HIGH: 2.get type and set endKilometer based on "PeriodicType.periodicKilometer"

      // get lastCarLife
      const truckInfo = await this.truckInfoService.getById(
        payload.truckInfoId,
      );
      // get periodicKilometer
      const periodicKilometer = await this.periodicTypeRepository.findOne({
        attributes: ['periodicKilometer'],
        where: { type: payload.type },
      });
      // cal endKilometer
      // console.log(truckInfo);
      payload.endKilometer =
        periodicKilometer.periodicKilometer +
        Number(truckInfo.data['lastCarLife']);
      console.log(periodicKilometer.periodicKilometer);
      const result =
        await this.periodicTruckCheckRepository.upsert<PeriodicTruckCheck>(
          payload,
        );
      if (result)
        return { status: 200, data: true, message: 'add successfully' };
      else return { status: 500, data: false, message: 'field operation' };
    } catch (err) {
      console.log(err);
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getTypes() {
    try {
      console.log('PeriodicTruckCheckType: ', PeriodicTruckCheckType);
      return {
        data: PeriodicTruckCheckType,
        status: HttpStatus.OK,
        message: 'find successfully',
      };
    } catch (err) {
      console.log(err);
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAll() {
    try {
      const data = [];
      const { rows, count } = await this.periodicTruckCheckRepository.findAndCountAll({
        include: [
          {
            model: TruckInfo,
          },
        ],
      });
     console.log(rows);
     
      const periodicTypes = await this.periodicTypeRepository.findAll({
        attributes: ['name', 'type'],
      });
  
      for (let periodic of rows) {
        const user = await this.authRepository.findOne({
          where: {
            id: periodic.truckInfo?.driverId,
          },
        });
  
        if (!user) {
          console.log(`User not found for driverId: ${periodic.truckInfo?.driverId}`);
          continue;
        }
  
        const periodicType = periodicTypes.find((item) => item.type === periodic.type);
  
        if (!periodicType) {
          console.log(`Periodic type not found for type: ${periodic.type}`);
          continue; 
        }

        if(user?.id){
          const baseItem = {
            id: periodic.id,
            driverName: user.name,
            driverMobile: user.mobile,
            endDate: periodic.endDate,
            endKilometer: periodic.endKilometer,
            carNumber: periodic.truckInfo.carNumber,
            type: periodicType.name,
            calculateKilometer: periodic.endKilometer - Number(periodic.truckInfo?.lastCarLife || 0),
          };
    
          data.push(baseItem);
    
          if (periodic.type === 'technicalInspection') {
            const updatedEndDate = new Date(periodic.endDate);
            updatedEndDate.setFullYear(updatedEndDate.getFullYear() + 1);
    
            const technicalItem = {
              ...baseItem,
              endDate: updatedEndDate,
              calculateKilometer: null,
            };
    
            data.push(technicalItem);
          }
        }
  
      }
  
      return { data: data, count, status: 200 };
    } catch (err) {
      console.log(err);
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  

  // async getAlertPeriodicTruckCheck() {
  //   try {
  //     const data = [];

  //     const periodicInfo = await this.periodicTruckCheckRepository.findAll({
  //       include: [
  //         {
  //           model: TruckInfo,
  //         },
  //       ],
  //     });

  //     const periodicTypes = await this.periodicTypeRepository.findAll({
  //       attributes: ['name', 'type'],
  //     });

  //     for (let periodic of periodicInfo) {

  //       periodic.type = periodicTypes.find(
  //         (item) => item.type === periodic.type,
  //       ).type
  //       if (
  //         periodic.endKilometer - Number(periodic.truckInfo.lastCarLife) <=
  //         alertKilometer
  //       ) {
  //         const itemData = {};
  //         const user = await this.authRepository.findOne({
  //           where: {
  //             id: periodic.dataValues.truckInfo.driverId,
  //           },
  //         });
  //         if (user?.id) {
  //           itemData['id'] = periodic.id;
  //           itemData['driverName'] = user.name;
  //           itemData['driverMobile'] = user.mobile;
  //           itemData['endDate'] = periodic.endDate;
  //           itemData['endKilometer'] = periodic.endKilometer;
  //           itemData['carNumber'] = periodic.truckInfo.carNumber;
  //           itemData['type'] = periodic.type;
  //           itemData['calculateKilometer'] =
  //             periodic.endKilometer - Number(periodic.truckInfo.lastCarLife);

  //           data.push(itemData);
  //         }
  //       }
  //       if (periodic.type === 'technicalInspection' || periodic.type === 'tire' ) {
  //         const now = new Date();
  //         const endDate = new Date(periodic.endDate);
  //         const differenceInDays =
  //           (endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
        
        
  //         if (differenceInDays <= 7) {
  //           const user = await this.authRepository.findOne({
  //             where: {
  //               id: periodic.dataValues.truckInfo.driverId,
  //             },
  //           });
        
  //           if (user?.id) {
  //             const itemData = {
  //               id: periodic.id,
  //               driverName: user.name,
  //               driverMobile: user.mobile,
  //               endDate: periodic.endDate,
  //               endKilometer: periodic.endKilometer,
  //               carNumber: periodic.truckInfo.carNumber,
  //               type: periodic.type,
  //               alertMessage: 'معاینه قنی شما تا 15 روز دیگر منقضی میشود',
  //               daysRemaining: Math.floor(differenceInDays), 
  //             };
        
  //             data.push(itemData);
  //           } 
  //         }
  //       }
  //     }
        
  //     return { data: data, status: 200, message: 'successfully' };


  //   } catch (err) {
  //     console.log(err);
  //     throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
  //   }
  // }

  async getAlertPeriodicTruckCheck() {
    try {
        const data = [];

        const periodicInfo = await this.periodicTruckCheckRepository.findAll({
            include: [{ model: TruckInfo }],
        });

        const periodicTypes = await this.periodicTypeRepository.findAll({
            attributes: ['name', 'type'],
        });

        for (let periodic of periodicInfo) {
            periodic.type = periodicTypes.find(
                (item) => item.type === periodic.type,
            ).type;

            const user = await this.authRepository.findOne({
                where: { id: periodic.dataValues.truckInfo.driverId },
            });

            if (!user?.id) continue;

            const now = new Date();
            const endDate = new Date(periodic.endDate);
            const differenceInDays = (endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);

            const truckInfo = periodic.truckInfo;
            const lastCarLife = Number(truckInfo.lastCarLife);


            if (periodic.type === 'tire') {
                if (periodic.endKilometer - lastCarLife <= alertKilometer) {
                    const itemData = {
                        id: periodic.id,
                        driverName: user.name,
                        driverMobile: user.mobile,
                        endDate: periodic.endDate,
                        endKilometer: periodic.endKilometer,
                        carNumber: truckInfo.carNumber,
                        type: periodic.type,
                        alertMessage: `تایر شما به کیلومتر ${periodic.endKilometer} نزدیک است.`,
                        daysRemaining: Math.floor(differenceInDays),
                    };
                    data.push(itemData);
                }

                if (differenceInDays <= 7) {
                    const itemData = {
                        id: periodic.id,
                        driverName: user.name,
                        driverMobile: user.mobile,
                        endDate: periodic.endDate,
                        endKilometer: periodic.endKilometer,
                        carNumber: truckInfo.carNumber,
                        type: periodic.type,
                        alertMessage: `تایر شما تا 7 روز دیگر منقضی می‌شود`,
                        daysRemaining: Math.floor(differenceInDays),
                    };
                    data.push(itemData);
                }
            }

            if (periodic.type === 'technicalInspection') {
                if (differenceInDays <= 7) {
                    const itemData = {
                        id: periodic.id,
                        driverName: user.name,
                        driverMobile: user.mobile,
                        endDate: periodic.endDate,
                        endKilometer: periodic.endKilometer,
                        carNumber: truckInfo.carNumber,
                        type: periodic.type,
                        alertMessage: `معاینه فنی شما تا 7 روز دیگر منقضی می‌شود`,
                        daysRemaining: Math.floor(differenceInDays),
                    };
                    data.push(itemData);
                }
            }
        }

        return { data, status: 200, message: 'successfully' };
    } catch (err) {
        console.log(err);
        throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}



  async removePeriodicTruckCheck(periodicId: number) {
    try {
      const result = await this.periodicTruckCheckRepository.destroy({
        where: {
          id: periodicId,
        },
      });

      if (result)
        return { status: 200, data: true, message: 'delete successfully' };
      else return { status: 500, data: false, message: 'field operation' };
    } catch (err) {
      console.log(err);
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  checkDifferenceDaysBetweenTwoDate(
    date1: Date,
    date2: Date,
    diff: number,
  ): boolean {
    const difference = Math.abs(date1.valueOf() - date2.valueOf());
    return difference / (1000 * 3600 * 24) <= diff ? true : false;
  }
}
// async getAlertList() {
//   try {
//     const x = offsetDaysEndDatePeriodicTruckCheck;
//     const y = offsetKilometerPeriodicTruckCheck;
//     const res = await this.periodicTruckRepository;
//     // 1. date: now + countDaysLimit === F: endDate
//     // 2.  kilometer: join "truckInfo" and "periodicTruckCheck" ->
//     //  truckInfo.carLastLife + countKilometerLimit === F: endKilometer
//     // find ( 1 or 2 and F: alertReview == false)
//   } catch (err) {
//     console.log(err);
//     throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
//   }
// }

// async getOne(periodicId: number) {
//   try {
//     const result = await this.periodicTruckRepository.findOne({
//       where: {
//         id: periodicId,
//       },
//       include: [
//         {
//           model: TruckInfo,
//           attributes: ['zone'],
//           where: {
//             // lastCarLife:
//           },
//         },
//       ], // BuG not relation with TruckInfo
//     });

//     if (result)
//       return {
//         status: 200,
//         data: result.dataValues,
//         message: 'add successfully',
//       };
//     else return { status: 200, data: {}, message: 'data not exist' };
//   } catch (err) {
//     console.log(err);
//     throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
//   }
// }

//================================================ calculate alerts in query:
// where: {
//   [Op.or]: [
//     Sequelize.where(
//       Sequelize.literal(
//         '`PeriodicTruckCheck`.`endKilometer` - `TruckInfo`.`lastCarLife`',
//       ),
//       { [Op.lte]: 500 },
//     ),
//     Sequelize.where(
//       Sequelize.literal(
//         `DATEDIFF(CURDATE(), \`PeriodicTruckChecks\`.\`endDate\`)`,
//       ),
//       { [Op.lte]: 5 },
//     ),
//   ],
// },
