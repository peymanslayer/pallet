import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { TruckBreakDownService } from './truck-break-down.service';

@Controller()
export class TruckBreakDownController {
  constructor(private truckBreakDownService: TruckBreakDownService) {}
  @Get('/api/truckbreakdown/')
  async getByUserId(@Query('userId') userId: any, @Res() response: Response) {
    try {
      const res = await this.truckBreakDownService.getByDriverId(userId);
      response.status(res.status).json(res.data);
    } catch (err) {
      console.log(err);
      response.status(500).json(err);
    }
  }

  @Get('/api/truckbreakdown/all')
  async getAll(@Res() response: Response) {
    try {
      const res = await this.truckBreakDownService.getAll();
      response.status(res.status).json(res.data);
    } catch (err) {
      console.log(err);
      response.status(500).json(err);
    }
  }

  @Get('/api/truckbreakdown/:id')
  async getbyId(@Param('id') id: number, @Res() response: Response) {
    try {
      const res = await this.truckBreakDownService.get(id);
      response.status(res.status).json(res.data);
    } catch (err) {
      console.log(err);
      response.status(500).json(err);
    }
  }

  @Delete('/api/truckbreakdown/:id')
  async deleteById(@Param('id') id: number, @Res() response: Response) {
    try {
      const res = await this.truckBreakDownService.delete(id);
      response.status(res.status).json(res.message);
    } catch (err) {
      console.log(err);
      response.status(500).json(err);
    }
  }
}
