import { HttpException, Injectable } from '@nestjs/common';
import { HttpStatusCode } from 'axios';
import { AppService } from './app.service';

@Injectable()
export class AppController {
  constructor(private readonly appService: AppService) {}
  async Statistics() {
    try {
      const res = await this.Statistics();
      //PND: return from memcache
    } catch (err) {
      console.log(err);
    }
  }
}
