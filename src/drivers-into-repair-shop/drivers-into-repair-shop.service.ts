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

  async getUndoneOrders() {
    try {
      const undoneOrders = await this.truckBreakDownRepository.findAndCountAll({
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
  
      const data = [];
  
      for (const item of undoneOrders.rows) {
        const breakDown = item.dataValues;
        const carPieces = await this.getCarPiecesHistory(breakDown.carNumber);
        const row = {
          id: breakDown.id,
          numberOfBreakDown: breakDown.numberOfBreakDown,
          hours: breakDown.hoursDriverRegister,
          history: breakDown.historyDriverRegister,
          driverName: breakDown.driverName,
          driverMobile: breakDown.driverMobile,
          carNumber: breakDown.carNumber,
          kilometer: breakDown.carLife,
          transportComment: breakDown.transportComment,
          logisticConfirm: breakDown.logisticConfirm,
          repairmanComment: breakDown.repairmanComment,
          historySendToRepair: breakDown.historySendToRepair,
          historyReciveToRepair: breakDown.historyReciveToRepair,
          histroyDeliveryTruck: breakDown.histroyDeliveryTruck,
          historyDeliveryDriver: breakDown.historyDeliveryDriver,
          piece: breakDown.piece,
          piecesReplacementHistory: carPieces,
          answers: await this.getBreakDownItemsById(breakDown.truckBreakDownItemsId),
        };
  
        data.push(row);
      }
  
      return {
        status: 200,
        data,
        count: undoneOrders.count,
      };
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'An error occurred',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
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
