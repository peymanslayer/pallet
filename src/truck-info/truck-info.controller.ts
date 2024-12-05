import { Body, Controller, Get, Param, Put, Query } from '@nestjs/common';
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

  @Get('/api/truckInfo/carNumber/:carNumber')
  async getByCarNumber(@Param('carNumber') carNumber: string) {
    try {
      return await this.truckInfoService.getByCarNumber(carNumber);
    } catch (err) {
      console.log(err);
    }
  }

  @Get('/api/truckInfo/id/:id')
  async getById(@Param('id') id: number) {
    try {
      return await this.truckInfoService.getById(id);
    } catch (err) {
      console.log(err);
    }
  }

  @Put('/api/truckInfo/:driverId')
  // MID: type for payload
  async updateTruckInfo(
    @Body() payload: any,
    @Param('driverId') driverId: number,
  ) {
    try {
      return await this.truckInfoService.update(driverId, payload);
    } catch (err) {
      console.log(err);
    }
  }
}
