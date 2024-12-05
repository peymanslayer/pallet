import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
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
}
