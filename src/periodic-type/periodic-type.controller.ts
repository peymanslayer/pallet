import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { PeriodicTypeService } from './periodic-type.service';

@Controller('/api/periodicType')
export class PeriodicTypeController {
  constructor(private readonly periodicService: PeriodicTypeService) {}
  @Post()
  async create(@Body() payload: any) {
    try {
      return await this.periodicService.create(payload);
    } catch (err) {
      console.error(err);
      throw new HttpException('bad request', HttpStatus.BAD_REQUEST);
    }
  }
  @Get()
  async getAll() {
    try {
      return await this.periodicService.getAll();
    } catch (err) {
      console.error(err);
      throw new HttpException('bad request', HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':/id')
  async getOneById(@Param('id') id: number) {
    try {
    } catch (err) {
      console.error(err);
      throw new HttpException('bad request', HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':/id')
  async delete(@Param('id') id: number) {
    try {
    } catch (err) {
      console.error(err);
      throw new HttpException('bad request', HttpStatus.BAD_REQUEST);
    }
  }
}
