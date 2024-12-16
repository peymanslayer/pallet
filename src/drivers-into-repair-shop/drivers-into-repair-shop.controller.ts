import { Controller, Get, Query, Res } from '@nestjs/common';
import { DriversIntoRepairShopService } from './drivers-into-repair-shop.service';
import { Response } from 'express';

@Controller()
export class DriversIntoRepairShopController {
  constructor(private readonly driversIntoRepairShopService: DriversIntoRepairShopService) {}

  @Get('/api/drivers-into-repair-shop/all')
  async getUndoneOrders(
    @Res() response: Response){
    try {
      const res = await  this.driversIntoRepairShopService.getUndoneOrders()
      response.status(res.status).json(res.data);
    } catch (err) {
      console.log(err);
      response.status(500).json(err);
    }
  }
  @Get('/api/drivers-into-repair-shop/all/filter')
  async getUndoneOrdersByFilter(
    @Res() response: Response ,
    @Query('company') company?: string,
    @Query('zone') zone?: string){
    try {
      const filters = { zone, company };
    
      try {
        const res = await this.driversIntoRepairShopService.getUndoneOrdersByFilter(filters);
        response.status(res.status).json(res.data);
      } catch (error) {
        throw error; 
      }
    } catch (err) {
      console.log(err);
      response.status(500).json(err);
    }
  }
}
