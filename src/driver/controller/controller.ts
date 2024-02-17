import { Controller } from '@nestjs/common';
import { DriverService } from '../services/driver.service';
import { Post, Body, Res } from '@nestjs/common';
import { Response } from 'express';
import { InsertDriverDto } from '../dto/insert.driver.dto';
@Controller()
export class DriverController {
  constructor(private readonly driverService: DriverService) {}
  // comment: not used in front. depricated
  @Post('/api/generateDriverCode')
  async generateDriverCode(
    @Body() body: InsertDriverDto,
    @Res() response: Response,
  ) {
    try {
      const generateDriverCode = await this.driverService.insertDriver(
        body.driverName,
      );
      response
        .status(generateDriverCode.status)
        .json(generateDriverCode.message);
    } catch (err) {
      console.log(err);
      response.status(500).json('internal server error');
    }
  }
  // comment: not used in front. depricated
  @Post('/api/findDriverByName')
  async findDriverByName(
    @Body() body: InsertDriverDto,
    @Res() response: Response,
  ) {
    try {
      const findDriverByName = await this.driverService.findDriverByName(
        body.driverName,
      );
      response.status(findDriverByName.status).json(findDriverByName.message);
    } catch (err) {
      console.log(err);
      response.status(500).json('inetrnal server error');
    }
  }
}
