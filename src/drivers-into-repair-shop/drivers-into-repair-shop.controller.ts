import { Controller, Get } from '@nestjs/common';
import { DriversIntoRepairShopService } from './drivers-into-repair-shop.service';

@Controller('drivers-into-repair-shop')
export class DriversIntoRepairShopController {
  constructor(private readonly driversIntoRepairShopService: DriversIntoRepairShopService) {}

  @Get('all')
  async getUndoneOrders(){
    return this.driversIntoRepairShopService.getUndoneOrders()
  }
}
