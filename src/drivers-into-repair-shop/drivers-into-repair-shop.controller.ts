import { Controller, Get, Query, Res } from '@nestjs/common';
import { DriversIntoRepairShopService } from './drivers-into-repair-shop.service';
import { Response } from 'express';

@Controller()
export class DriversIntoRepairShopController {
  constructor(private readonly driversIntoRepairShopService: DriversIntoRepairShopService) {}

  @Get('/api/drivers-into-repair-shop/all')
  async getUndoneOrders(@Query() repairDone: string , @Query() count : string , @Res() response: Response){
    try {
      const res = await  this.driversIntoRepairShopService.getUndoneOrders(repairDone , count)
      response.status(res.status).json(res.data);
    } catch (err) {
      console.log(err);
      response.status(500).json(err);
    }
  }
}
