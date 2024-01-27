import { Body, Controller, Param, Post, Put, Res } from '@nestjs/common';
import { TruckBreakDownItemsService } from './truck-break-down-items.service';
import { Response } from 'express';

@Controller()
export class TrukBreakDownItemsController {
  constructor(
    private readonly truckBreakDownItemsService: TruckBreakDownItemsService,
  ) {}
  @Post('/api/truckbreakdown')
  async generateDriverCode(@Body() body: any, @Res() response: Response) {
    try {
      const res =
        await this.truckBreakDownItemsService.insertTruckBreakDownItems(body);
      response.status(res.status).json(res.message);
    } catch (err) {
      console.log(err);
      response.status(500).json(err);
    }
  }

  @Put('/api/truckbreakdown/driver/:id')
  async updateById(
    @Param('id') id: number,
    @Body() body: any,
    @Res() response: Response,
  ) {
    try {
      const res = await this.truckBreakDownItemsService.updateByDriver(
        id,
        body,
      );
      response.status(res.status).json(res.message);
    } catch (err) {
      console.log(err);
      response.status(500).json(err);
    }
  }
}
