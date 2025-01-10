import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Query } from '@nestjs/common';
import { KilometerService } from './kilometer.service';
import { CreateKilometerDto } from './dto/create-kilometer.dto';
import { UpdateKilometerDto } from './dto/update-kilometer.dto';
import { Response } from 'express';

@Controller('api/kilometer')
export class KilometerController {
  constructor(private readonly kilometerService: KilometerService) {}

  @Get('by-car-number')
  findOne(@Query('carNumber') carNumber: string) {
    return this.kilometerService.findOne(carNumber);
  }

  @Post('/add')
  async create(@Body() carNumber: string, currenrKilometer: number , previousKilometer: number , @Res() response: Response) {
    const res = await this.kilometerService.create(carNumber , currenrKilometer , previousKilometer);
    response.status(res.status).json({data :res.data , message: res.message});
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.kilometerService.remove(+id);
  // }
}
