import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PeriodicTruckCheckService } from './periodic-truck-check.service';
import { CreatePeriodicTruckCheckDto } from './dto/create-periodic-truck-check.dto';

@UsePipes(new ValidationPipe())
@Controller('/api/periodicTruckCheck')
export class PeriodicTruckCheckController {
  constructor(
    private readonly periodicTruckCheckService: PeriodicTruckCheckService,
  ) {}

  @Post()
  async create(@Body() payload: CreatePeriodicTruckCheckDto) {
    try {
      return await this.periodicTruckCheckService.create(payload);
    } catch (err) {
      console.log(err);
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async getAll() {
    try {
      return await this.periodicTruckCheckService.getAll();
    } catch (err) {
      console.log(err);
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('/alerts')
  async getAlerts() {
    try {
      return await this.periodicTruckCheckService.getAlertPeriodicTruckCheck();
    } catch (err) {
      console.log(err);
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('/types')
  async getTypesCheck() {
    try {
      return await this.periodicTruckCheckService.getTypes();
    } catch (err) {
      console.log(err);
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  // @Get('/test/:id')
  // async getOne(@Param('id') periodicId: number) {
  //   try {
  //     return await this.periodicTruckCheckService.getOne(periodicId);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }

  // @Get('/alertlist')
  // async getAlertList() {
  //   try {
  //     return await this.periodicTruckCheckService.getAlertList();
  //   } catch (err) {
  //     console.log(err);
  //     throw new HttpException(err, HttpStatus.BAD_REQUEST);
  //   }
  // }
}
