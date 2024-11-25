import { Controller, Get, Query } from '@nestjs/common';
import { TruckInfoService } from './truck-info.service';

@Controller()
export class TruckInfoController {
  constructor(private readonly truckInfoService: TruckInfoService) {}

  @Get('/api/truckInfo')
  async get(@Query('zone') zone: string, @Query('company') company: string) {
    try {
      return await this.truckInfoService.getLogisticManagerDriverList(
        zone,
        company,
      );
    } catch (err) {
      console.log(err);
    }
  }
}
