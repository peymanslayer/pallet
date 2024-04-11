import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { TruckBreakDownService } from './truck-break-down.service';

@Controller()
export class TruckBreakDownController {
  constructor(private truckBreakDownService: TruckBreakDownService) {}
  // list breakdown of panel "Driver"
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

  @Get('/api/truckbreakdown/repairman/replay')
  async replayRepairman(
    @Query('userId') userId: any,
    @Res() response: Response,
  ) {
    try {
      const res = await this.truckBreakDownService.replayRepairman(userId);
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

  @Get('/api/truckbreakdown/repairman')
  async getAllBreakDown(
    @Res() response: Response,
    @Query('beforeHistory') beforeHistory: string,
    @Query('afterHistory') afterHistory: string,
    @Query('carNumber') carNumber: string,
    @Query('repairComment') repairComment: string,
    @Query('historyReciveToRepair') reciveToRepair: string,
    @Query('count') count: string,
  ) {
    try {
      const res = await this.truckBreakDownService.repairUserGetAll(
        repairComment,
        reciveToRepair,
        count,
        beforeHistory,
        afterHistory,
        carNumber,
      );
      if (count) {
        response.status(res.status).json({ data: res.data });
      } else {
        response.status(res.status).json({ data: res.data, count: res.count });
      }
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

  @Put('/api/truckbreakdown/:id')
  async updateTruckBreakDown(
    @Param('id') id: number,
    @Body() body: any,
    @Res() response: Response,
  ) {
    try {
      const res = await this.truckBreakDownService.update(id, body);
      response.status(res.status).json(res.message);
    } catch (err) {
      console.log(err);
      response.status(500).json(err);
    }
  }
}
