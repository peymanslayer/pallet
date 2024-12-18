import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import { Auth } from 'src/auth/auth.entity';
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
                    { historyDeliveryDriver: null },
                ],
            },
            order: [['id', 'DESC']],
            limit: 20
        });

        const driverIds = undoneOrders.rows.map(item => item.dataValues.driverId);
        const driverInfoPromises = driverIds.map(driverId => this.authService.getDriverInfo(driverId));
        const driverInfoResults = await Promise.all(driverInfoPromises);

        const data = await Promise.all(
            undoneOrders.rows.map(async (item, index) => {
                const breakDown = item.dataValues;
                const driverInfo = driverInfoResults[index];
                const carPieces = this.getCarPiecesHistory(breakDown.carNumber);

                let answers;
                try {
                    answers = await this.getBreakDownItemsById(breakDown.truckBreakDownItemsId);
                } catch (err) {
                    answers = []; 
                }

                return {
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
                    answers: answers,
                    personelCode: driverInfo ? driverInfo.personelCode : null,
                    company: driverInfo ? driverInfo.company : null,
                    zone: driverInfo ? driverInfo.zone : null,
                };
            })
        );

        return {
            status: 200,
            data: data,
            count: data.length,
        };
    } catch (error) {
        console.error('Error in getUndoneOrders:', error);
        throw new HttpException(
            'An error occurred',
            HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
}

  

  async getUndoneOrdersByFilter(filters: { zone?: string, company?: string }) {
    try {
      const undoneOrders = await this.truckBreakDownRepository.findAndCountAll({
        where: {
          [Op.or]: [
            { logisticConfirm: false },
            { historyReciveToRepair: { [Op.ne]: null } },
            { historyDeliveryDriver: null },
          ],
        },
        order: [['id', 'DESC']],
        limit: 20
      });
  
      const driverIds = undoneOrders.rows.map(item => item.dataValues.driverId);
  
      const driverInfoPromises = driverIds.map(driverId => this.authService.getDriverInfo(driverId));
      const driverInfoResults = await Promise.all(driverInfoPromises);
  
      const filteredDriverInfo = driverInfoResults.filter(driverInfo => {
        let match = true;
  
        if (driverInfo) {
          if (filters.zone) {
            match = match && driverInfo.zone === filters.zone;
          }
          if (filters.company) {
            match = match && driverInfo.company === filters.company;
          }
        } else {
          match = false;
        }
  
        return match;
      });
  
      const data = undoneOrders.rows.map((item, index) => {
        const breakDown = item.dataValues;
        const driverInfo = filteredDriverInfo[index];
  
        if (!driverInfo) {
          return null;
        }
  
        const carPieces = this.getCarPiecesHistory(breakDown.carNumber);
  
        return {
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
          answers: this.getBreakDownItemsById(breakDown.truckBreakDownItemsId),
          personelCode: driverInfo ? driverInfo.personelCode : null,
          company: driverInfo ? driverInfo.company : null,
          zone: driverInfo ? driverInfo.zone : null,
        };
      }).filter(row => row !== null); 
  
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
  
    if (!id) {
      console.warn('Invalid id provided to getBreakDownItemsById:', id);
      return [];
    }
  
    const res = await this.truckBreakDownItemsRepository.findOne({
      where: { id: id },
    });
  
    if (!res) {
      console.warn(`No record found for truckBreakDownItems with id: ${id}`);
      return [];
    }
  
    const items = res.dataValues;
  
    for (let item = 1; item <= 20; item++) {
      if (items[`answer_${item}`] != null) {
        data.push({
          type: items[`type_${item}`],
          comment: items[`answer_${item}`],
          number: item,
        });
      }
    }
  
    return data;
  }
  

}
