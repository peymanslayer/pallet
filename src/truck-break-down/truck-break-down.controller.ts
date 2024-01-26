import { Controller, Get, Res } from '@nestjs/common';
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
}
