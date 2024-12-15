import { Controller, Get, Query, Res } from '@nestjs/common';
import { DriversIntoRepairShopService } from './drivers-into-repair-shop.service';
import { Response } from 'express';

@Controller()
export class DriversIntoRepairShopController {
  constructor(private readonly driversIntoRepairShopService: DriversIntoRepairShopService) {}

  @Get('/api/drivers-into-repair-shop/all')
  async getUndoneOrders(@Res() response: Response){
    try {
      const res = await  this.driversIntoRepairShopService.getUndoneOrders()
      response.status(res.status).json(res.data);
    } catch (err) {
      console.log(err);
      response.status(500).json(err);
    }
  }
}
