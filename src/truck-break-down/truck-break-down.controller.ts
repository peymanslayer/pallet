import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { TruckBreakDownService } from './truck-break-down.service';

@Controller()
export class TruckBreakDownController {
  constructor(private truckBreakDownService: TruckBreakDownService) {}
  @Get('/api/truckbreakdown')
  async getAll(@Res() response: Response) {
    try {
      const res = await this.truckBreakDownService.getAll();
      response.status(res.status).json(res.data);
    } catch (err) {
      console.log(err);
      response.status(500).json(err);
    }
  }

  @Get('/api/truckbreakdown/:driverId')
  async getByUserId(
    @Param('driverId') driverId: number,
    @Res() response: Response,
  ) {
    try {
      const res = await this.truckBreakDownService.getByUserId(driverId);
      response.status(res.status).json(res.data);
    } catch (err) {
      console.log(err);
      response.status(500).json(err);
    }
  }
}
