import { Body, Controller, Delete, Get, Param, Post, Query, Res } from '@nestjs/common';
import { KilometerDetailsService } from './kilometer-details.service';
import { Response } from 'express';

@Controller('api/kilometer-details')
export class KilometerDetailsController {
  constructor(private readonly kilometerDetailsService: KilometerDetailsService) {}

  @Post('/add')
  async create(@Body() carNumber: string ,driverId:number ,kilometer: number , @Res() response: Response){
    const res = await this.kilometerDetailsService.create(carNumber , driverId , kilometer);
    response.status(res.status).json({data :res.data , message: res.message});
  }

  @Get('/filter')
  async getKilometerDetailsByFilter(
    @Query('driverIds') driverIds: number[] ,
    @Query('carNumbers') carNumbers: string[] ,
    @Query('startDate') startDate: string ,
    @Query('endDate') endDate: string ,
    @Res() response: Response
  ){
    const res = await this.kilometerDetailsService.getKilometerDetailsByFilter(driverIds , carNumbers , startDate , endDate);
    response.status(res.status).json({data :res.data , message: res.message});
  }

  @Delete("remove/:id")
  async deleteKilometerDetails(@Param('id') id: number , @Res() response: Response){
    const res = await this.kilometerDetailsService.deleteKilometerDetails(id);
    response.status(res.status).json({data :res.data , message: res.message});
  }
}
