import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { PeriodicTruckCheck } from './periodic-truck-check.entity';
import { PeriodicTruckCheckType } from 'src/common/constants';
import { TruckInfo } from 'src/truck-info/truck-info.entity';
import { Auth } from 'src/auth/auth.entity';
import { Sequelize, Op } from 'sequelize';

@Injectable()
export class PeriodicTruckCheckService {
  constructor(
    @Inject('PERIODIC_TRUCK_CHECK')
    private readonly periodicTruckCheckRepository: typeof PeriodicTruckCheck,
    @Inject('AUTH_REPOSITORY')
    private readonly authRepository: typeof Auth,
  ) {}

  async create(payload: any) {
    try {
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
      // trInfo:nameDriver , periodic:endDate, periodic:endKilometer, trInfo:carNumber , periodic:type, periodic:offsetToTarget
      // auth.
      const data = [];
      const { rows, count } =
        await this.periodicTruckCheckRepository.findAndCountAll({
          include: [
            {
              model: TruckInfo,
            },
          ],
        });

      for (let periodic of rows) {
        const itemData = {};
        const user = await this.authRepository.findOne({
          where: {
            id: periodic.dataValues.truckInfo.driverId,
          },
        });
        if (user?.id) {
          itemData['driverName'] = user.name;
          itemData['driverMobile'] = user.mobile;
          itemData['endDate'] = periodic.endDate;
          itemData['endKilometer'] = periodic.endKilometer;
          itemData['carNumber'] = periodic.truckInfo.carNumber;
          itemData['type'] = periodic.type;
          itemData['calculateKilometer'] =
            periodic.endKilometer - Number(periodic.truckInfo.lastCarLife);

          data.push(itemData);
        }
      }

      return { data: data, count, status: 200 };
    } catch (err) {
      console.log(err);
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAlertPeriodicTruckCheck() {
    try {
      const data = [];

      //1.  join "periodicTruck" and "truckInfo"
      const periodicInfo = await this.periodicTruckCheckRepository.findAll({
        include: [
          {
            model: TruckInfo,
          },
        ],
      });

      for (let periodic of periodicInfo) {
        //2.1 check "periodic.endKilometer"  - "tr.lastCarLife" <= 500  ==> alert
        if (
          periodic.endKilometer - Number(periodic.truckInfo.lastCarLife) <=
            500 ||
          this.checkDifferenceDaysBetweenTwoDate(
            periodic.endDate,
            new Date(),
            5,
          )
        ) {
          const itemData = {};
          const user = await this.authRepository.findOne({
            where: {
              id: periodic.dataValues.truckInfo.driverId,
            },
          });
          if (user?.id) {
            itemData['driverName'] = user.name;
            itemData['driverMobile'] = user.mobile;
            itemData['endDate'] = periodic.endDate;
            itemData['endKilometer'] = periodic.endKilometer;
            itemData['carNumber'] = periodic.truckInfo.carNumber;
            itemData['type'] = periodic.type;
            itemData['calculateKilometer'] =
              periodic.endKilometer - Number(periodic.truckInfo.lastCarLife);

            data.push(itemData);
          }
        }
      }

      return { data: data, status: 200, message: 'successfully' };

      //2.2 check  diff ("periodic.endDate" - "new date")  <= 5 ==> alert
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
