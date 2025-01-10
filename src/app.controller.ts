import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('api/statistics')
  async Statistics(@Res() response: Response) {
    try {
      return response.send(
        await this.appService.calculateSevenLastDayStatistics(),
      );
    } catch (err) {
      console.log(err);
    }
  }
}
