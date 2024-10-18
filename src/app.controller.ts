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
      //HIGH: 1.return direct "statisctics"
      //HIGH: 2.calculate in first run
      //HIGH: 3.update each count of event

      //test
      //PND: return from memcache
    } catch (err) {
      console.log(err);
    }
  }
}
