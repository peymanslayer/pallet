import { Inject, Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import { TruckBreakDown } from 'src/truck-break-down/truck-break-down.entity';

@Injectable()
export class DriversIntoRepairShopService {
  constructor(
    @Inject('TRUCKBREAKDOWN_REPOSITORY')
    private readonly truckBreakDownRepository: typeof TruckBreakDown,
  ) {}

  async getUndoneOrders(): Promise<TruckBreakDown[]> {
    return this.truckBreakDownRepository.findAll({
      where: {
        [Op.or]: [
          { logisticConfirm: false }, 
          { historyReciveToRepair: { [Op.ne]: null } },
          { historyDeliveryDriver: null }
        ],
      },
    });
  }
}
