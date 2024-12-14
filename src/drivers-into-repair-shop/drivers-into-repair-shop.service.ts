import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import { AuthService } from 'src/auth/services/auth.service';
import { TruckBreakDownItems } from 'src/truck-break-down-items/truck-break-down-items.entity';
import { TruckBreakDown } from 'src/truck-break-down/truck-break-down.entity';

@Injectable()
export class DriversIntoRepairShopService {
  constructor(
    @Inject('TRUCKBREAKDOWN_REPOSITORY')
    private readonly truckBreakDownRepository: typeof TruckBreakDown,
    @Inject('TRUCKBREAKDOWNITEMS_REPOSITORY')
    private readonly truckBreakDownItemsRepository: typeof TruckBreakDownItems,
    private readonly authService: AuthService,
  ) {}

  async getUndoneOrders(
    repairDone: string,
    count: string,
  ) {

    let data = [];
    let countList: number;
    let undoneOrders: {
      rows: TruckBreakDown[];
      count: number;
    };

    if(repairDone == 'false'){
      undoneOrders = await this.truckBreakDownRepository.findAndCountAll({
        where: {
          [Op.or]: [
            { logisticConfirm: false }, 
            { historyReciveToRepair: { [Op.ne]: null } },
            { historyDeliveryDriver: null }
          ],
        },
        order: [['id', 'DESC']],
        limit: 20,
      });
    }

    if (count === 'true') {
      countList = undoneOrders.count;
    } else {
      for (let item of undoneOrders.rows) {
        let breakDown = {};
        let row = {};

        breakDown = item.dataValues;

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
        row['kilometer'] = breakDown['carLife']; // carLife set value when driver register daily check list
        row['transportComment'] = breakDown['transportComment'];
        row['logisticConfirm'] = breakDown['logisticConfirm'];
        row['repairmanComment'] = breakDown['repairmanComment'];
        row['historySendToRepair'] = breakDown['historySendToRepair'];
        row['historyReciveToRepair'] = breakDown['historyReciveToRepair'];
        row['histroyDeliveryTruck'] = breakDown['histroyDeliveryTruck'];
        row['historyDeliveryDriver'] = breakDown['historyDeliveryDriver'];
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
      data: countList === 0 || countList ? countList : data,
      count: undoneOrders.count,
    };
  }


  async getUserIdListByCompanyName(companyName: string) {
    return await this.authService.getUsersByCompanyName(companyName);
  }

  async getUsersSameZone(
    zone: string,
    role: string,
    attributes: Array<string> = [],
  ) {
    return await this.authService.userSameZone(zone, role, attributes);
  }

  async getCarPiecesHistory(carNumber: string) {
    try {
      return await this.truckBreakDownRepository.findAll({
        attributes: ['piece', 'carLife', 'transportCommentHistory'],
        where: {
          carNumber: carNumber,
        },
        order: [['id', 'DESC']],
      });
    } catch (err) {
      console.log(err);
      throw new HttpException(
        'wrong on server ...',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }


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
    for (let item = 1; item <= 20; item++) {
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

}
